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
    return row;
  });
