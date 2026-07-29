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

export const listEventPosts = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ eventId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: posts, error } = await sb
      .from("posts")
      .select("id, event_id, author_id, author_name, author_avatar, content, media_urls, media_type, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    const ids = (posts ?? []).map((p) => p.id);
    if (ids.length === 0) return { posts: posts ?? [], likeCounts: {} as Record<string, number>, commentCounts: {} as Record<string, number> };
    const [{ data: likes }, { data: comments }] = await Promise.all([
      sb.from("post_likes").select("post_id").in("post_id", ids),
      sb.from("comments").select("post_id").in("post_id", ids),
    ]);
    const likeCounts: Record<string, number> = {};
    (likes ?? []).forEach((l) => { likeCounts[l.post_id] = (likeCounts[l.post_id] ?? 0) + 1; });
    const commentCounts: Record<string, number> = {};
    (comments ?? []).forEach((c) => { commentCounts[c.post_id] = (commentCounts[c.post_id] ?? 0) + 1; });
    return { posts: posts ?? [], likeCounts, commentCounts };
  });

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ postId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: post, error } = await sb
      .from("posts")
      .select("id, event_id, author_id, author_name, author_avatar, content, media_urls, media_type, created_at")
      .eq("id", data.postId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return null;
    const [{ data: likes }, { data: event }] = await Promise.all([
      sb.from("post_likes").select("user_id").eq("post_id", data.postId),
      sb.from("events").select("id, slug, title, type, cover_url").eq("id", post.event_id).maybeSingle(),
    ]);
    return { post, likeCount: likes?.length ?? 0, event };
  });

export const getUserProfile = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ userId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const [profileRes, postsRes, eventsRes, countRes] = await Promise.all([
      sb.from("profiles").select("id, display_name, avatar_url, bio, created_at").eq("id", data.userId).maybeSingle(),
      sb.from("posts")
        .select("id, content, media_urls, media_type, created_at, event_id, events!inner(slug, cover_url, visibility)")
        .eq("author_id", data.userId)
        .in("events.visibility", ["public", "unlisted"])
        .order("created_at", { ascending: false })
        .limit(24),
      sb.from("events")
        .select("id, slug, title, type, cover_url, event_date, status, visibility")
        .eq("owner_id", data.userId)
        .in("visibility", ["public", "unlisted"])
        .order("event_date", { ascending: false, nullsFirst: false })
        .limit(12),
      sb.from("posts").select("id", { count: "exact", head: true }).eq("author_id", data.userId),
    ]);
    return {
      profile: profileRes.data,
      posts: postsRes.data ?? [],
      events: eventsRes.data ?? [],
      postCount: countRes.count ?? (postsRes.data?.length ?? 0),
    };
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      content: z.string().min(1).max(2000),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles").select("display_name, avatar_url").eq("id", context.userId).maybeSingle();
    const { data: post, error } = await context.supabase
      .from("posts")
      .insert({
        event_id: data.eventId,
        author_id: context.userId,
        author_name: profile?.display_name ?? "Invité",
        author_avatar: profile?.avatar_url ?? null,
        content: data.content,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return post;
  });

export const togglePostLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ postId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("post_likes")
      .select("post_id")
      .eq("post_id", data.postId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (existing) {
      await context.supabase.from("post_likes").delete().eq("post_id", data.postId).eq("user_id", context.userId);
      return { liked: false };
    }
    await context.supabase.from("post_likes").insert({ post_id: data.postId, user_id: context.userId });
    // Notify author (skip self-likes)
    const { data: post } = await context.supabase
      .from("posts").select("author_id, event_id, content").eq("id", data.postId).maybeSingle();
    if (post?.author_id && post.author_id !== context.userId) {
      const { data: liker } = await context.supabase
        .from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("notifications").insert({
        user_id: post.author_id,
        event_id: post.event_id,
        type: "like",
        title: `${liker?.display_name ?? "Un invité"} a aimé votre publication`,
        body: (post.content ?? "").slice(0, 120),
      });
    }
    return { liked: true };
  });

export const listPostComments = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ postId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("comments")
      .select("id, post_id, author_name, content, created_at")
      .eq("post_id", data.postId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ postId: z.string().uuid(), content: z.string().min(1).max(1000) }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
    const { data: row, error } = await context.supabase
      .from("comments")
      .insert({
        post_id: data.postId,
        author_id: context.userId,
        author_name: profile?.display_name ?? "Invité",
        content: data.content,
      })
      .select().single();
    if (error) throw new Error(error.message);
    const { data: post } = await context.supabase
      .from("posts").select("author_id, event_id").eq("id", data.postId).maybeSingle();
    if (post?.author_id && post.author_id !== context.userId) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("notifications").insert({
        user_id: post.author_id,
        event_id: post.event_id,
        type: "comment",
        title: `${profile?.display_name ?? "Un invité"} a commenté votre publication`,
        body: data.content.slice(0, 160),
      });
    }
    return row;
  });
