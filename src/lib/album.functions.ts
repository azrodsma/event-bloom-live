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

export const listAlbumMedia = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ eventId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("album_media")
      .select("id, event_id, uploader_id, uploader_name, url, media_type, caption, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createAlbumMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      url: z.string().url(),
      mediaType: z.enum(["image", "video"]).default("image"),
      caption: z.string().max(500).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
    const { data: row, error } = await context.supabase
      .from("album_media")
      .insert({
        event_id: data.eventId,
        uploader_id: context.userId,
        uploader_name: profile?.display_name ?? "Invité",
        url: data.url,
        media_type: data.mediaType,
        caption: data.caption ?? null,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });
