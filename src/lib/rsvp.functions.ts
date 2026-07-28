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
      .select("rsvp, plus_ones, checked_in_at")
      .eq("event_id", data.eventId);
    if (error) throw new Error(error.message);
    const stats = { total: 0, confirmed: 0, declined: 0, maybe: 0, pending: 0, plus_ones: 0, checked_in: 0 };
    for (const r of rows ?? []) {
      stats.total += 1;
      stats.plus_ones += r.plus_ones ?? 0;
      if (r.checked_in_at) stats.checked_in += 1;
      const k = r.rsvp as keyof typeof stats;
      if (typeof stats[k] === "number") (stats[k] as number) += 1;
    }
    return stats;
  });

export const listGuests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ eventId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("guests")
      .select("id, full_name, email, phone, rsvp, plus_ones, dietary, table_number, notes, invite_token, checked_in_at, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

/* ---------- Per-guest invite tokens ---------- */

export const createGuestInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      eventId: z.string().uuid(),
      full_name: z.string().trim().min(1).max(120),
      email: z.string().trim().email().max(255).optional().nullable(),
      phone: z.string().trim().max(40).optional().nullable(),
      plus_ones: z.number().int().min(0).max(10).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("guests")
      .insert({
        event_id: data.eventId,
        full_name: data.full_name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        plus_ones: data.plus_ones ?? 0,
        rsvp: "pending",
      })
      .select("id, invite_token, full_name")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const getGuestByToken = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ token: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: g, error } = await supabaseAdmin
      .from("guests")
      .select("id, event_id, full_name, email, phone, rsvp, plus_ones, dietary, notes, checked_in_at, events!inner(id, slug, title, event_date, location, cover_url, visibility)")
      .eq("invite_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!g) throw new Error("Invitation introuvable");
    return g;
  });

export const updateRsvpByToken = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      token: z.string().uuid(),
      full_name: z.string().trim().min(1).max(120),
      email: z.string().trim().email().max(255),
      phone: z.string().trim().max(40).optional().nullable(),
      rsvp: z.enum(["confirmed", "declined", "maybe", "pending"]),
      plus_ones: z.number().int().min(0).max(10),
      dietary: z.string().trim().max(300).optional().nullable(),
      notes: z.string().trim().max(500).optional().nullable(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("guests")
      .update({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone ?? null,
        rsvp: data.rsvp,
        plus_ones: data.plus_ones,
        dietary: data.dietary ?? null,
        notes: data.notes ?? null,
      })
      .eq("invite_token", data.token);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkInGuest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      guestId: z.string().uuid(),
      checked_in: z.boolean().default(true),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("guests")
      .update({ checked_in_at: data.checked_in ? new Date().toISOString() : null })
      .eq("id", data.guestId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
