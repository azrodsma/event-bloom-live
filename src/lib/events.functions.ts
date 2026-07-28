import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
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

export const listPublicEvents = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverPublic();
  const { data, error } = await sb
    .from("events")
    .select("id, slug, title, type, visibility, is_demo, status, event_date, location, cover_url, description, cagnotte_url, cagnotte_goal, cagnotte_current, live_url")
    .in("visibility", ["public"])
    .order("event_date", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getEventBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: e, error } = await sb
      .from("events")
      .select("id, slug, title, type, visibility, is_demo, status, event_date, location, cover_url, description, cagnotte_url, cagnotte_goal, cagnotte_current, live_url, owner_id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return e;
  });

export const listActiveStories = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverPublic();
  const { data, error } = await sb
    .from("stories")
    .select("id, event_id, author_name, author_avatar, media_url, media_type, expires_at, events!inner(slug, title, status, visibility)")
    .gt("expires_at", new Date().toISOString())
    .eq("events.visibility", "public")
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw new Error(error.message);
  return data ?? [];
});
