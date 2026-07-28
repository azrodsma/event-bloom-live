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

export const listRegistryItems = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ eventId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("gift_registry_items")
      .select("id, event_id, title, description, price, image_url, external_url, reserved_by, is_reserved, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createRegistryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      title: z.string().min(1).max(200),
      description: z.string().max(1000).optional(),
      price: z.number().nonnegative().optional(),
      imageUrl: z.string().url().optional(),
      externalUrl: z.string().url().optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("gift_registry_items")
      .insert({
        event_id: data.eventId,
        title: data.title,
        description: data.description ?? null,
        price: data.price ?? null,
        image_url: data.imageUrl ?? null,
        external_url: data.externalUrl ?? null,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const reserveRegistryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid(), reservedBy: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("gift_registry_items")
      .update({ is_reserved: true, reserved_by: data.reservedBy })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const unreserveRegistryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("gift_registry_items")
      .update({ is_reserved: false, reserved_by: null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteRegistryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("gift_registry_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
