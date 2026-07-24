import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, Users, Heart, MessageCircle, Sparkles, TrendingUp, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/community")({
  component: Community,
  head: () => ({
    meta: [
      { title: "Communauté · Memento Live" },
      { name: "description", content: "Rejoignez des cercles d'organisateurs qui préparent le même type d'événement que vous et partagez conseils, inspirations et prestataires." },
      { property: "og:title", content: "Communauté · Memento Live" },
      { property: "og:description", content: "Organisez à plusieurs, inspirez-vous." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const circles = [
  { emoji: "💍", name: "Futurs mariés 2026", members: 4820, active: 128, hot: true },
  { emoji: "🕊️", name: "Baptêmes bienveillants", members: 1240, active: 42, hot: false },
  { emoji: "🎂", name: "Anniversaires marquants (30/40/50)", members: 2130, active: 68, hot: true },
  { emoji: "🏡", name: "Crémaillères & pendaisons de crémaillère", members: 720, active: 18, hot: false },
  { emoji: "🎓", name: "Diplômés fêtards", members: 1580, active: 34, hot: false },
];

const posts = [
  {
    author: "Emma L.",
    avatar: "https://i.pravatar.cc/64?img=32",
    circle: "Futurs mariés 2026",
    time: "il y a 12 min",
    content: "Notre traiteur vient d'annuler à 3 mois du mariage 😰 Vous auriez des adresses en région lyonnaise ? Budget 90€/pers.",
    replies: 24,
    hearts: 18,
    solved: false,
    tags: ["Traiteur", "Lyon", "Urgence"],
  },
  {
    author: "Marc & Sophie",
    avatar: "https://i.pravatar.cc/64?img=45",
    circle: "Futurs mariés 2026",
    time: "il y a 1 h",
    content: "Retour d'expérience : cérémonie laïque avec 3 rituels différents. Le meilleur choix de notre organisation. AMA !",
    replies: 42,
    hearts: 96,
    solved: false,
    tags: ["Cérémonie", "Retour d'exp"],
  },
  {
    author: "Camille P.",
    avatar: "https://i.pravatar.cc/64?img=25",
    circle: "Anniversaires marquants",
    time: "il y a 3 h",
    content: "Un thème original pour mes 40 ans ? Pas de gala mais pas non plus soirée pizza 😄",
    replies: 31,
    hearts: 22,
    solved: true,
    tags: ["Thème", "40 ans"],
  },
];

const guides = [
  { emoji: "📋", title: "Rétroplanning mariage sur 12 mois", reads: 8420 },
  { emoji: "💰", title: "Ventiler un budget de 15 000 €", reads: 5210 },
  { emoji: "🎤", title: "Écrire un discours qui touche", reads: 3890 },
  { emoji: "📸", title: "Brief photographe : les 20 must", reads: 2760 },
];

function Community() {
  const [tab, setTab] = useState<"feed" | "circles" | "guides">("feed");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Communauté</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Rechercher">
          <Search className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Users className="h-3.5 w-3.5 text-primary" /> 12 340 organisateurs actifs
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Vous n'organisez<br />pas tout·e seul·e</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Échangez avec d'autres personnes qui vivent la même aventure. Conseils, adresses, retours d'expérience.
        </p>
      </section>

      <div className="sticky top-14 z-10 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-secondary p-1">
          {(["feed", "circles", "guides"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                tab === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {v === "feed" ? "Discussions" : v === "circles" ? "Cercles" : "Guides"}
            </button>
          ))}
        </div>
      </div>

      {tab === "feed" && (
        <section className="px-4 pt-5">
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.author + p.time} className="rounded-3xl border border-border/60 bg-card p-4">
                <div className="flex items-start gap-3">
                  <img src={p.avatar} alt="" className="h-10 w-10 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold">{p.author}</span>
                      <span className="text-[10px] text-muted-foreground">· {p.time}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-primary">{p.circle}</p>
                    <p className="mt-2 text-sm leading-relaxed">{p.content}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">
                          {t}
                        </span>
                      ))}
                      {p.solved && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                          ✓ Résolu
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="inline-flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" /> {p.hearts}
                      </button>
                      <button className="inline-flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" /> {p.replies} réponses
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button className="fixed bottom-24 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" /> Poser une question
          </button>
        </section>
      )}

      {tab === "circles" && (
        <section className="px-4 pt-5">
          <ul className="space-y-2">
            {circles.map((c) => (
              <li
                key={c.name}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">
                  {c.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    {c.hot && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                        <TrendingUp className="h-2.5 w-2.5" /> Actif
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {c.members.toLocaleString("fr-FR")} membres · {c.active} en ligne
                  </p>
                </div>
                <button className="rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold text-background">
                  Rejoindre
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-3xl border border-dashed border-border p-5 text-center">
            <Sparkles className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 font-serif text-lg">Créez votre cercle</p>
            <p className="mx-auto mt-1 max-w-xs text-[11px] text-muted-foreground">
              Rassemblez d'autres organisateurs autour d'un thème (ex : mariages en Provence).
            </p>
            <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background">
              Proposer un cercle
            </button>
          </div>
        </section>
      )}

      {tab === "guides" && (
        <section className="px-4 pt-5">
          <ul className="space-y-2">
            {guides.map((g) => (
              <li key={g.title}>
                <button className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-border/60">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">
                    {g.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{g.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {g.reads.toLocaleString("fr-FR")} lectures · rédigé par la communauté
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-3xl bg-primary/5 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Contribuer</p>
            <p className="mt-2 font-serif text-lg leading-tight">Partagez votre retour d'expérience</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Après votre événement, aidez d'autres futurs organisateurs en publiant un guide.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
