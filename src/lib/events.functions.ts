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

const eventTypeEnum = z.enum(["wedding", "baptism", "birthday", "anniversary", "engagement", "babyshower", "other"]);
const visibilityEnum = z.enum(["private", "unlisted", "public"]);

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "event";
}

export const createEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        title: z.string().trim().min(2).max(120),
        type: eventTypeEnum,
        event_date: z.string().datetime().optional().nullable(),
        location: z.string().trim().max(200).optional().nullable(),
        description: z.string().trim().max(2000).optional().nullable(),
        cover_url: z.string().url().optional().nullable(),
        visibility: visibilityEnum,
        cagnotte_url: z.string().url().optional().nullable(),
        cagnotte_goal: z.number().nonnegative().optional().nullable(),
        live_url: z.string().url().optional().nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const base = slugify(data.title);
    let slug = base;
    for (let i = 0; i < 6; i++) {
      const { data: existing } = await context.supabase.from("events").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const { data: ev, error } = await context.supabase
      .from("events")
      .insert({
        owner_id: context.userId,
        slug,
        title: data.title,
        type: data.type,
        event_date: data.event_date ?? null,
        location: data.location ?? null,
        description: data.description ?? null,
        cover_url: data.cover_url ?? null,
        visibility: data.visibility,
        status: "upcoming",
        is_demo: false,
        cagnotte_url: data.cagnotte_url ?? null,
        cagnotte_goal: data.cagnotte_goal ?? null,
        cagnotte_current: 0,
        live_url: data.live_url ?? null,
      })
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    await context.supabase.from("event_members").insert({
      event_id: ev.id,
      user_id: context.userId,
      role: "owner",
    });
    return ev;
  });

export const updateCagnotte = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        eventId: z.string().uuid(),
        cagnotte_url: z.string().url().nullable(),
        cagnotte_goal: z.number().nonnegative().nullable(),
        cagnotte_current: z.number().nonnegative().nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("is_event_organizer", {
      _event_id: data.eventId,
      _user_id: context.userId,
    });
    if (!allowed) throw new Error("Non autorisé");
    const { error } = await context.supabase
      .from("events")
      .update({
        cagnotte_url: data.cagnotte_url,
        cagnotte_goal: data.cagnotte_goal,
        cagnotte_current: data.cagnotte_current,
      })
      .eq("id", data.eventId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listEventStories = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ eventId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("stories")
      .select("id, author_name, author_avatar, media_url, media_type, created_at, expires_at")
      .eq("event_id", data.eventId)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createStory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      mediaUrl: z.string().url(),
      mediaType: z.enum(["image", "video"]).default("image"),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles").select("display_name, avatar_url").eq("id", context.userId).maybeSingle();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { data: row, error } = await context.supabase
      .from("stories")
      .insert({
        event_id: data.eventId,
        author_id: context.userId,
        author_name: profile?.display_name ?? "Invité",
        author_avatar: profile?.avatar_url ?? null,
        media_url: data.mediaUrl,
        media_type: data.mediaType,
        expires_at: expiresAt,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });


