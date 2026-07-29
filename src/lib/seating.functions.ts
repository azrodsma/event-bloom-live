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

export const listSeating = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ eventId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const [tablesRes, guestsRes] = await Promise.all([
      sb
        .from("tables_seating")
        .select("id, event_id, table_number, label, capacity, created_at")
        .eq("event_id", data.eventId)
        .order("table_number", { ascending: true }),
      sb
        .from("guests")
        .select("id, event_id, full_name, dietary, table_number, rsvp, plus_ones")
        .eq("event_id", data.eventId)
        .order("full_name", { ascending: true }),
    ]);
    if (tablesRes.error) throw new Error(tablesRes.error.message);
    if (guestsRes.error) throw new Error(guestsRes.error.message);
    return { tables: tablesRes.data ?? [], guests: guestsRes.data ?? [] };
  });

export const createTable = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      tableNumber: z.number().int().min(0).max(999),
      label: z.string().max(120).optional(),
      capacity: z.number().int().min(1).max(50),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("tables_seating")
      .insert({
        event_id: data.eventId,
        table_number: data.tableNumber,
        label: data.label ?? null,
        capacity: data.capacity,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteTable = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid(), eventId: z.string().uuid(), tableNumber: z.number().int() }).parse(i))
  .handler(async ({ data, context }) => {
    await context.supabase
      .from("guests")
      .update({ table_number: null })
      .eq("event_id", data.eventId)
      .eq("table_number", data.tableNumber);
    const { error } = await context.supabase.from("tables_seating").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const assignGuest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ guestId: z.string().uuid(), tableNumber: z.number().int().nullable() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("guests")
      .update({ table_number: data.tableNumber })
      .eq("id", data.guestId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
