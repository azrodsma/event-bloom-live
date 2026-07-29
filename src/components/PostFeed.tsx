import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Heart, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { listEventPosts, createPost, togglePostLike } from "@/lib/social.functions";
import { CommentThread } from "@/components/CommentThread";
import { useAuth } from "@/hooks/use-auth";

export function PostFeed({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchPosts = useServerFn(listEventPosts);
  const addPost = useServerFn(createPost);
  const toggleLike = useServerFn(togglePostLike);
  const [content, setContent] = useState("");
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["posts", eventId],
    queryFn: () => fetchPosts({ data: { eventId } }),
  });

  useEffect(() => {
    if (!eventId) return;
    const channel = supabase
      .channel(`posts-${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts", filter: `event_id=eq.${eventId}` },
        () => qc.invalidateQueries({ queryKey: ["posts", eventId] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_likes" },
        () => qc.invalidateQueries({ queryKey: ["posts", eventId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, qc]);


  const postMut = useMutation({
    mutationFn: (text: string) => addPost({ data: { eventId, content: text } }),
    onSuccess: () => {
      setContent("");
      qc.invalidateQueries({ queryKey: ["posts", eventId] });
      toast.success("Publié");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const likeMut = useMutation({
    mutationFn: (postId: string) => toggleLike({ data: { postId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts", eventId] }),
  });

  return (
    <section className="space-y-4">
      <h2 className="font-serif text-xl">Fil de l'événement</h2>

      {user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (content.trim()) postMut.mutate(content.trim());
          }}
          className="rounded-3xl bg-surface p-4 shadow-card"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partagez un mot, un souvenir…"
            className="w-full resize-none rounded-2xl bg-muted p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={postMut.isPending || !content.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> Publier
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl bg-surface p-4 text-center text-sm text-muted-foreground shadow-card">
          Connectez-vous pour publier.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(data?.posts ?? []).map((p) => {
            const likes = data?.likeCounts[p.id] ?? 0;
            const comments = data?.commentCounts[p.id] ?? 0;
            return (
              <article key={p.id} className="rounded-3xl bg-surface p-4 shadow-card">
                <header className="flex items-center gap-3">
                  <img
                    src={p.author_avatar ?? `https://i.pravatar.cc/80?u=${p.author_id ?? p.id}`}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.author_name ?? "Invité"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </header>
                {p.content && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{p.content}</p>}
                {Array.isArray(p.media_urls) && p.media_urls.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {p.media_urls.slice(0, 4).map((u: string, i: number) => (
                      <img key={i} src={u} alt="" className="aspect-square w-full rounded-2xl object-cover" />
                    ))}
                  </div>
                )}
                <footer className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => (user ? likeMut.mutate(p.id) : toast.error("Connectez-vous pour aimer"))}
                    className="inline-flex items-center gap-1.5 transition hover:text-primary"
                  >
                    <Heart className="h-4 w-4" /> {likes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenComments((s) => ({ ...s, [p.id]: !s[p.id] }))}
                    className="inline-flex items-center gap-1.5 transition hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" /> {comments}
                  </button>
                </footer>
                {openComments[p.id] && <CommentThread postId={p.id} eventId={eventId} />}
              </article>
            );
          })}
          {(data?.posts ?? []).length === 0 && (
            <p className="rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground shadow-card">
              Aucun message pour l'instant.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
