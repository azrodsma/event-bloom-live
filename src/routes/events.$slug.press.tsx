import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Download, Share2, Instagram, Facebook, Video, Image as ImageIcon, Sparkles, Copy, Lock, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/press")({
  component: Press,
  head: () => ({
    meta: [
      { title: "Espace presse & partage · MaFeliza" },
      { name: "description", content: "Kit média officiel de l'événement : photos HD, vidéos courtes, communiqué et hashtags." },
      { property: "og:title", content: "Espace presse & partage · MaFeliza" },
      { property: "og:description", content: "Partagez, avec style et cadre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const kits = [
  {
    id: "k1",
    title: "Selection presse — Cérémonie",
    files: 24,
    weight: "312 Mo",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    kind: "photo" as const,
  },
  {
    id: "k2",
    title: "Reel Instagram — Ouverture de bal",
    files: 3,
    weight: "84 Mo",
    cover: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600",
    kind: "video" as const,
  },
  {
    id: "k3",
    title: "Album grand public",
    files: 128,
    weight: "1,2 Go",
    cover: "https://images.unsplash.com/photo-1521543387223-cffef79eb5b6?w=600",
    kind: "photo" as const,
  },
];

const posts = [
  { platform: "Instagram", icon: Instagram, tone: "Story vertical", accent: "from-fuchsia-500 to-orange-500" },
  { platform: "Facebook", icon: Facebook, tone: "Post carré", accent: "from-sky-500 to-indigo-500" },
  { platform: "TikTok", icon: Video, tone: "Vidéo 15 s", accent: "from-slate-800 to-slate-950" },
];

const releaseText = `Sarah & Thomas se sont dit oui le 14 juin 2026 au Château de Villette, en Provence. Une cérémonie laïque intime, suivie d'une soirée en plein air rassemblant 128 invités venus de 12 régions.

Photographies signées Studio Léon — libres d'utilisation pour les médias partenaires avec mention obligatoire "© Studio Léon / MaFeliza".`;

const hashtags = ["#SarahThomas2026", "#MaFelizaLive", "#ChateauVillette", "#MariageProvence", "#JeMeMarie"];

function Press() {
  const { slug } = useParams({ from: "/events/$slug/press" });
  const [copied, setCopied] = useState(false);
  const [audience, setAudience] = useState<"press" | "guests" | "public">("press");

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Espace presse</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Kit média officiel
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Partagez,<br />avec style et cadre</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Sélection curatée par les mariés. Utilisation autorisée avec mention obligatoire.
        </p>
      </section>

      <section className="px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Audience</p>
        <div className="grid grid-cols-3 gap-1">
          {(
            [
              { id: "press" as const, label: "Presse" },
              { id: "guests" as const, label: "Invités" },
              { id: "public" as const, label: "Public" },
            ]
          ).map((a) => {
            const on = audience === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setAudience(a.id)}
                className={`rounded-full py-2 text-[11px] font-semibold ${
                  on ? "bg-foreground text-background" : "bg-secondary text-foreground"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
        {audience === "press" && (
          <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" /> Accès sur invitation — code envoyé aux journalistes accrédités.
          </p>
        )}
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Kits téléchargeables</p>
        <ul className="space-y-2">
          {kits.map((k) => (
            <li key={k.id} className="flex gap-3 rounded-3xl border border-border/60 bg-card p-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                <img src={k.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-foreground">
                  {k.kind === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold leading-tight">{k.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {k.files} fichiers · {k.weight}
                </p>
                <button className="mt-2 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold text-background">
                  <Download className="h-3 w-3" /> Télécharger .zip
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Formats prêts à publier</p>
        <div className="grid grid-cols-3 gap-2">
          {posts.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.platform}
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.accent} p-3 text-white`}
              >
                <div className="grid aspect-square place-items-center rounded-2xl bg-white/10 backdrop-blur">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-2 text-[11px] font-bold">{p.platform}</p>
                <p className="text-[9px] text-white/80">{p.tone}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Communiqué</p>
          <button onClick={copy} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold">
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copié" : "Copier"}
          </button>
        </div>
        <p className="mt-3 whitespace-pre-line text-[12px] leading-relaxed text-muted-foreground">
          {releaseText}
        </p>
      </section>

      <section className="mx-4 mt-4 rounded-3xl bg-secondary/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hashtags officiels</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {hashtags.map((h) => (
            <span key={h} className="rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/30">
              {h}
            </span>
          ))}
        </div>
      </section>

      <div className="mx-4 mt-6 flex items-center gap-2 rounded-3xl bg-primary/5 p-4 text-[11px] text-muted-foreground">
        <Lock className="h-4 w-4 shrink-0 text-primary" />
        <p>Chaque téléchargement est tracé. Un email récap est envoyé aux mariés toutes les 24 h.</p>
      </div>
    </div>
  );
}
