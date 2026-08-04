import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, Share2, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getPost, togglePostLike, listPostComments, createComment } from "@/lib/social.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/posts/$id")({
  component: PostDetail,
  head: () => ({
    meta: [
      { title: "Publication · MaFeliza" },
      { name: "description", content: "Découvrez cette publication partagée par la communauté MaFeliza." },
      { property: "og:title", content: "Publication · MaFeliza" },
      { property: "og:description", content: "Un moment capturé sur MaFeliza." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

function PostDetail() {
  const { id } = useParams({ from: "/app/posts/$id" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const fetchPost = useServerFn(getPost);
  const fetchComments = useServerFn(listPostComments);
  const like = useServerFn(togglePostLike);
  const addComment = useServerFn(createComment);

  const [data, setData] = useState<Awaited<ReturnType<typeof getPost>> | null>(null);
  const [comments, setComments] = useState<Array<{ id: string; author_name: string | null; content: string; created_at: string }>>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetchPost({ data: { postId: id } });
        if (!alive) return;
        setData(res);
        setLikeCount(res?.likeCount ?? 0);
        const cs = await fetchComments({ data: { postId: id } });
        if (alive) setComments(cs);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, fetchPost, fetchComments]);

  async function submit() {
    if (!draft.trim()) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    const text = draft.trim();
    setDraft("");
    const row = await addComment({ data: { postId: id, content: text } });
    setComments((prev) => [...prev, { id: row.id, author_name: row.author_name, content: row.content, created_at: row.created_at }]);
  }

  async function onLike() {
    if (!user) { navigate({ to: "/auth" }); return; }
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? n - 1 : n + 1));
    try { await like({ data: { postId: id } }); } catch { setLiked((v) => !v); }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Chargement…</div>;
  }
  if (!data || !data.post) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Publication introuvable.</p>
        <Link to="/app" className="mt-4 inline-block text-primary underline">Retour au feed</Link>
      </div>
    );
  }

  const { post, event } = data;
  const cover = post.media_urls?.[0] ?? event?.cover_url ?? "";

  return (
    <div className="pb-32">
      <div className="sticky top-[57px] z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => history.back()} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="font-serif text-lg">Publication</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Partager">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      <article className="border-b border-border/60">
        <div className="flex items-center gap-3 px-4 py-3">
          {post.author_avatar ? (
            <img src={post.author_avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {(post.author_name ?? "?").slice(0, 1)}
            </div>
          )}
          <div className="flex-1">
            {event ? (
              <Link to="/events/$slug" params={{ slug: event.slug }} className="text-sm font-medium hover:underline">
                {post.author_name ?? "Invité"}
              </Link>
            ) : (
              <p className="text-sm font-medium">{post.author_name ?? "Invité"}</p>
            )}
            {event && <p className="text-xs text-muted-foreground">{event.title}</p>}
          </div>
          {event && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{event.type}</span>}
        </div>

        {cover && <img src={cover} alt="" className="aspect-square w-full object-cover" />}

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={onLike} aria-label="J'aime" className="transition-transform active:scale-90">
              <Heart className={`h-7 w-7 ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>
            <button aria-label="Commenter">
              <MessageCircle className="h-7 w-7" />
            </button>
            <button aria-label="Envoyer">
              <Send className="h-7 w-7" />
            </button>
          </div>
          <button onClick={() => setSaved((v) => !v)} aria-label="Sauvegarder">
            <Bookmark className={`h-7 w-7 ${saved ? "fill-foreground" : ""}`} />
          </button>
        </div>

        <div className="px-4 pb-4">
          <p className="text-sm font-semibold">{likeCount} j'aime</p>
          {post.content && (
            <p className="mt-2 text-sm">
              <span className="font-semibold">{post.author_name ?? "Invité"}</span> <span className="text-foreground/90">{post.content}</span>
            </p>
          )}
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{timeAgo(post.created_at)}</p>
        </div>
      </article>

      <section className="px-4 py-4">
        <h2 className="font-serif text-lg">Commentaires · {comments.length}</h2>
        {comments.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Soyez le premier à commenter.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {(c.author_name ?? "?").slice(0, 1)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{c.author_name ?? "Invité"}</span>{" "}
                    <span className="text-foreground/90">{c.content}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{timeAgo(c.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-20 z-30 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted" aria-label="Emoji">
            <Smile className="h-5 w-5" />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={user ? "Ajouter un commentaire…" : "Connectez-vous pour commenter"}
            className="flex-1 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button onClick={submit} disabled={!draft.trim()} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40">
            Publier
          </button>
        </div>
      </div>
    </div>
  );
}
