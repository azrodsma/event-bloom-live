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

export const listLiveMessages = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ eventId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("live_messages")
      .select("id, event_id, author_id, author_name, content, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const sendLiveMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ eventId: z.string().uuid(), content: z.string().min(1).max(500) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
    const { data: row, error } = await context.supabase
      .from("live_messages")
      .insert({
        event_id: data.eventId,
        author_id: context.userId,
        author_name: profile?.display_name ?? "Invité",
        content: data.content,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const sendLiveReaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ eventId: z.string().uuid(), emoji: z.string().min(1).max(8) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("live_reactions")
      .insert({ event_id: data.eventId, user_id: context.userId, emoji: data.emoji });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
