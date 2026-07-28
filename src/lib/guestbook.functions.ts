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

export const listGuestbookEntries = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ eventId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("guestbook_entries")
      .select("id, event_id, author_id, author_name, kind, content, media_url, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createGuestbookEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      kind: z.enum(["text", "photo", "video", "audio"]).default("text"),
      content: z.string().max(2000).optional(),
      mediaUrl: z.string().url().optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
    const { data: row, error } = await context.supabase
      .from("guestbook_entries")
      .insert({
        event_id: data.eventId,
        author_id: context.userId,
        author_name: profile?.display_name ?? "Invité",
        kind: data.kind,
        content: data.content ?? null,
        media_url: data.mediaUrl ?? null,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });
