import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

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

export const listEventVendors = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ eventId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("vendors")
      .select("id, event_id, name, category, contact_name, contact_email, contact_phone, price, status, notes, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createEventVendor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      name: z.string().min(1).max(200),
      category: z.string().max(80).optional(),
      contactName: z.string().max(120).optional(),
      contactEmail: z.string().email().optional().or(z.literal("")),
      contactPhone: z.string().max(40).optional(),
      price: z.number().nonnegative().optional(),
      status: z.string().max(40).optional(),
      notes: z.string().max(2000).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("vendors")
      .insert({
        event_id: data.eventId,
        name: data.name,
        category: data.category ?? null,
        contact_name: data.contactName ?? null,
        contact_email: data.contactEmail || null,
        contact_phone: data.contactPhone ?? null,
        price: data.price ?? null,
        status: data.status ?? "à contacter",
        notes: data.notes ?? null,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateEventVendor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      status: z.string().max(40).optional(),
      price: z.number().nonnegative().optional(),
      notes: z.string().max(2000).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.price !== undefined) patch.price = data.price;
    if (data.notes !== undefined) patch.notes = data.notes;
    const { error } = await context.supabase.from("vendors").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteEventVendor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("vendors").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
