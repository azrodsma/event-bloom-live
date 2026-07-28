import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function serverPublic() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const rsvpSchema = z.object({
  slug: z.string().min(1).max(120),
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().nullable(),
  rsvp: z.enum(["confirmed", "declined", "maybe", "pending"]),
  plus_ones: z.number().int().min(0).max(10),
  dietary: z.string().trim().max(300).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((input) => rsvpSchema.parse(input))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: ev, error: evErr } = await sb
      .from("events")
      .select("id, visibility")
      .eq("slug", data.slug)
      .maybeSingle();
    if (evErr) throw new Error(evErr.message);
    if (!ev) throw new Error("Événement introuvable");
    if (!["public", "unlisted"].includes(ev.visibility)) {
      throw new Error("Cet événement n'accepte pas les RSVP publics");
    }
    const { error } = await sb.from("guests").insert({
      event_id: ev.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone ?? null,
      rsvp: data.rsvp,
      plus_ones: data.plus_ones,
      dietary: data.dietary ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getRsvpStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ eventId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("guests")
      .select("rsvp, plus_ones")
      .eq("event_id", data.eventId);
    if (error) throw new Error(error.message);
    const stats = { total: 0, confirmed: 0, declined: 0, maybe: 0, pending: 0, plus_ones: 0 };
    for (const r of rows ?? []) {
      stats.total += 1;
      stats.plus_ones += r.plus_ones ?? 0;
      stats[r.rsvp as keyof typeof stats] = (stats[r.rsvp as keyof typeof stats] as number) + 1;
    }
    return stats;
  });

export const listGuests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ eventId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("guests")
      .select("id, full_name, email, phone, rsvp, plus_ones, dietary, table_number, notes, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
