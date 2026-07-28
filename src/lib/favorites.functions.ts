import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listMyFavorites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("event_favorites")
      .select("event_id, created_at, events:event_id ( id, slug, title, type, visibility, is_demo, status, event_date, location, cover_url, description, cagnotte_url, cagnotte_goal, cagnotte_current, live_url, owner_id )")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? [])
      .map((r: any) => r.events)
      .filter(Boolean);
  });

export const listMyFavoriteIds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("event_favorites")
      .select("event_id");
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.event_id);
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ eventId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("event_favorites")
      .select("event_id")
      .eq("user_id", context.userId)
      .eq("event_id", data.eventId)
      .maybeSingle();
    if (existing) {
      const { error } = await context.supabase
        .from("event_favorites")
        .delete()
        .eq("user_id", context.userId)
        .eq("event_id", data.eventId);
      if (error) throw new Error(error.message);
      return { favorited: false };
    }
    const { error } = await context.supabase
      .from("event_favorites")
      .insert({ user_id: context.userId, event_id: data.eventId });
    if (error) throw new Error(error.message);
    return { favorited: true };
  });
