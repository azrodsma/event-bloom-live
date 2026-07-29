import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const toggleBookmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ postId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("post_bookmarks")
      .select("post_id")
      .eq("user_id", userId)
      .eq("post_id", data.postId)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase
        .from("post_bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", data.postId);
      if (error) throw error;
      return { bookmarked: false };
    }
    const { error } = await supabase
      .from("post_bookmarks")
      .insert({ user_id: userId, post_id: data.postId });
    if (error) throw error;
    return { bookmarked: true };
  });

export const listMyBookmarkIds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("post_bookmarks")
      .select("post_id")
      .eq("user_id", context.userId);
    if (error) throw error;
    return (data ?? []).map((r) => r.post_id as string);
  });

export const listMyBookmarkedPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: bms, error } = await supabase
      .from("post_bookmarks")
      .select("post_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    const ids = (bms ?? []).map((b) => b.post_id as string);
    if (ids.length === 0) return [];
    const { data: posts, error: e2 } = await supabase
      .from("posts")
      .select("id, event_id, author_id, author_name, author_avatar, content, media_urls, media_type, created_at, events(slug, title)")
      .in("id", ids);
    if (e2) throw e2;
    const byId = new Map((posts ?? []).map((p) => [p.id as string, p]));
    return ids
      .map((id) => byId.get(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  });
