import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, Share2, Smile } from "lucide-react";
import { useMemo, useState } from "react";
import { mockEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/app/posts/$id")({
  component: PostDetail,
  head: () => ({
    meta: [
      { title: "Publication · Memento Live" },
      { name: "description", content: "Découvrez cette publication partagée par la communauté Memento Live." },
      { property: "og:title", content: "Publication · Memento Live" },
      { property: "og:description", content: "Un moment capturé sur Memento Live." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const seedComments = [
  { id: "c1", author: "Camille R.", avatar: "https://i.pravatar.cc/80?img=32", text: "Trop beau ce moment 😍 Merci de partager !", time: "il y a 12 min", likes: 8 },
  { id: "c2", author: "Julien M.", avatar: "https://i.pravatar.cc/80?img=15", text: "La lumière est incroyable 🔥", time: "il y a 34 min", likes: 3 },
  { id: "c3", author: "Aïcha B.", avatar: "https://i.pravatar.cc/80?img=47", text: "On aurait tellement voulu être là 💕", time: "il y a 1 h", likes: 12 },
  { id: "c4", author: "Marc D.", avatar: "https://i.pravatar.cc/80?img=12", text: "Bravo aux mariés 🥂", time: "il y a 2 h", likes: 5 },
];

function PostDetail() {
  const { id } = useParams({ from: "/app/posts/$id" });
  const event = useMemo(() => mockEvents[parseInt(id, 10) % mockEvents.length] ?? mockEvents[0], [id]);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState(seedComments);
  const [draft, setDraft] = useState("");

  function submit() {
    if (!draft.trim()) return;
    setComments((prev) => [
      { id: `c${Date.now()}`, author: "Vous", avatar: "https://i.pravatar.cc/80?img=5", text: draft.trim(), time: "à l'instant", likes: 0 },
      ...prev,
    ]);
    setDraft("");
  }

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
          <img src={event.cover} alt="" className="h-10 w-10 rounded-full object-cover" />
          <div className="flex-1">
            <Link to="/events/$slug" params={{ slug: event.slug }} className="text-sm font-medium hover:underline">
              {event.organizers}
            </Link>
            <p className="text-xs text-muted-foreground">{event.venue} · {event.city}</p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{event.type}</span>
        </div>

        <img src={event.cover} alt={event.title} className="aspect-square w-full object-cover" />

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setLiked((v) => !v)} aria-label="J'aime" className="transition-transform active:scale-90">
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
          <p className="text-sm font-semibold">{liked ? 243 : 242} j'aime</p>
          <p className="mt-2 text-sm">
            <span className="font-semibold">{event.organizers}</span>{" "}
            Un moment suspendu, gravé dans nos mémoires. Merci à toutes celles et ceux qui étaient présents 💕
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">il y a 3 heures</p>
        </div>
      </article>

      <section className="px-4 py-4">
        <h2 className="font-serif text-lg">Commentaires · {comments.length}</h2>
        <ul className="mt-4 space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <img src={c.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{c.author}</span> <span className="text-foreground/90">{c.text}</span>
                </p>
                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{c.time}</span>
                  <button className="hover:text-foreground">{c.likes} j'aime</button>
                  <button className="hover:text-foreground">Répondre</button>
                </div>
              </div>
              <button aria-label="Aimer le commentaire">
                <Heart className="h-4 w-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
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
            placeholder="Ajouter un commentaire…"
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
