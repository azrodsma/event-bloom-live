import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Calendar, Heart, Bell, Gift, ChevronRight, Play, Share2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/anniversaries")({
  component: Anniversaries,
  head: () => ({
    meta: [
      { title: "Anniversaires · MaFeliza" },
      { name: "description", content: "Ne manquez plus les dates qui comptent : mariages, baptêmes, anniversaires marquants." },
      { property: "og:title", content: "Anniversaires · MaFeliza" },
      { property: "og:description", content: "Les dates qui comptent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Anni = {
  id: string;
  emoji: string;
  title: string;
  original: string;
  yearsAgo: number;
  daysUntil: number;
  role: string;
  cover: string;
  gift?: string;
  celebrated?: boolean;
};

const upcoming: Anni[] = [
  {
    id: "a1",
    emoji: "💍",
    title: "Sarah & Thomas",
    original: "14 juin 2026",
    yearsAgo: 1,
    daysUntil: 12,
    role: "Ami·e",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    gift: "Papier",
  },
  {
    id: "a2",
    emoji: "🕊️",
    title: "Baptême de Gabriel",
    original: "5 mai 2026",
    yearsAgo: 1,
    daysUntil: 45,
    role: "Marraine",
    cover: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800",
  },
  {
    id: "a3",
    emoji: "🎂",
    title: "40 ans de Camille",
    original: "22 sept. 2025",
    yearsAgo: 1,
    daysUntil: 128,
    role: "Cousine",
    cover: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800",
  },
];

const memories = [
  { id: "m1", when: "Il y a 3 ans", event: "Notre mariage", cover: "https://images.unsplash.com/photo-1521543387223-cffef79eb5b6?w=400" },
  { id: "m2", when: "Il y a 5 ans", event: "Baptême de Léon", cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400" },
  { id: "m3", when: "Il y a 7 ans", event: "30 ans de Marie", cover: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400" },
];

const traditions = [
  { year: 1, name: "Noces de coton", desc: "Un mouchoir brodé, un plaid tout doux…" },
  { year: 5, name: "Noces de bois", desc: "Un cadre photo, un objet artisanal en bois." },
  { year: 10, name: "Noces d'étain", desc: "Un objet du quotidien, revisité." },
  { year: 25, name: "Noces d'argent", desc: "Un bijou, un dîner mémorable." },
];

function Anniversaries() {
  const [reminders, setReminders] = useState<Set<string>>(new Set(["a1", "a2"]));
  const toggle = (id: string) =>
    setReminders((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const next = upcoming[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Anniversaires</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden">
        <img src={next.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
        <div className="relative px-4 pb-6 pt-8 text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur">
            <Sparkles className="h-3 w-3" /> Prochain anniversaire
          </span>
          <h1 className="mt-3 font-serif text-4xl leading-tight">
            {next.title}
            <br />
            <span className="text-white/80">fête ses {next.yearsAgo} an{next.yearsAgo > 1 ? "s" : ""}</span>
          </h1>
          <p className="mt-2 text-sm text-white/85">Dans {next.daysUntil} jours · {next.original}</p>
          <div className="mt-5 flex gap-2">
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-3 text-xs font-bold text-foreground shadow-glow">
              <Heart className="h-4 w-4" /> Envoyer un mot
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-black/40 px-4 py-3 text-xs font-semibold text-white backdrop-blur">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">À venir</p>
        <ul className="mt-3 space-y-2">
          {upcoming.map((a) => (
            <li key={a.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              <div className="flex items-center gap-3 p-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">
                  {a.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold">{a.title}</p>
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      {a.yearsAgo} an{a.yearsAgo > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Dans {a.daysUntil} j · {a.role} {a.gift ? `· Noces de ${a.gift.toLowerCase()}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => toggle(a.id)}
                  aria-label="Rappel"
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    reminders.has(a.id) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                <button className="py-2 text-[11px] font-semibold text-muted-foreground hover:bg-secondary">Revoir l'album</button>
                <button className="py-2 text-[11px] font-semibold text-muted-foreground hover:bg-secondary">Idée cadeau</button>
                <button className="py-2 text-[11px] font-semibold text-muted-foreground hover:bg-secondary">Écrire un mot</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/30 to-background p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Calendar className="h-3.5 w-3.5" /> Ce jour-là
        </div>
        <h2 className="mt-2 font-serif text-2xl leading-tight">Un souvenir<br />chaque matin</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Recevez chaque jour un mini-souvenir : une photo, un vocal, un instant du passé.
        </p>
        <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {memories.map((m) => (
            <article key={m.id} className="w-44 shrink-0 overflow-hidden rounded-2xl bg-card ring-1 ring-border/60">
              <div className="relative aspect-square overflow-hidden">
                <img src={m.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/85 backdrop-blur">
                  <Play className="h-3 w-3 fill-current pl-0.5" />
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{m.when}</p>
                <p className="mt-0.5 truncate text-xs font-semibold">{m.event}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Noces & traditions</p>
        <ul className="mt-3 space-y-1.5">
          {traditions.map((t) => (
            <li key={t.year} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Gift className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.year} an{t.year > 1 ? "s" : ""} · {t.name}</p>
                <p className="text-[11px] text-muted-foreground">{t.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
