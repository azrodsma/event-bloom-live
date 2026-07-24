import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Lock, Heart, Save, Clock, Sparkles, Eye, EyeOff, Feather, Mic } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/events/$slug/vows")({
  component: Vows,
  head: () => ({
    meta: [
      { title: "Mes vœux · Memento Live" },
      { name: "description", content: "Un espace confidentiel pour écrire vos vœux. Chiffré, invisible pour votre partenaire jusqu'au jour J." },
      { property: "og:title", content: "Mes vœux · Memento Live" },
      { property: "og:description", content: "Vos mots, pour un seul instant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const prompts = [
  { emoji: "✨", label: "Notre première rencontre" },
  { emoji: "💫", label: "Ce que j'aime chez toi" },
  { emoji: "🌱", label: "Nos petites habitudes" },
  { emoji: "🤝", label: "Ma promesse" },
  { emoji: "🕰️", label: "Dans dix ans" },
];

const sampleLines = [
  "Le jour où je t'ai vu·e, j'ai su que…",
  "Ce qui me touche chez toi, c'est…",
  "Je te promets de…",
  "Je choisis de t'aimer, même quand…",
];

function Vows() {
  const { slug } = useParams({ from: "/events/$slug/vows" });
  const [text, setText] = useState(
    "Mon amour,\n\nCela fait cinq ans que je te regarde dormir et que je me dis chaque matin la même chose : quelle chance.\n\nJe te promets de te faire rire quand tout va mal, de te préparer du thé quand tu es fatigué·e, et de te choisir, encore et encore, tous les matins…"
  );
  const [visible, setVisible] = useState(true);
  const [saved, setSaved] = useState<string>("il y a 4 min");
  const [selected, setSelected] = useState(new Set([prompts[0].label, prompts[3].label]));

  useEffect(() => {
    const t = setTimeout(() => setSaved("à l'instant"), 800);
    return () => clearTimeout(t);
  }, [text]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 130));

  const togglePrompt = (l: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(l)) n.delete(l);
      else n.add(l);
      return n;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Mes vœux</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
          <Lock className="h-3 w-3" /> Chiffré
        </span>
      </div>

      <section className="bg-gradient-to-b from-primary/10 via-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Feather className="h-3.5 w-3.5 text-primary" /> Espace privé
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Vos mots,<br />pour un seul instant</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Personne d'autre que vous ne verra ce texte. Thomas rédige les siens de son côté.
        </p>
      </section>

      <section className="px-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Inspirations
        </p>
        <div className="flex flex-wrap gap-1.5">
          {prompts.map((p) => {
            const on = selected.has(p.label);
            return (
              <button
                key={p.label}
                onClick={() => togglePrompt(p.label)}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-colors ${
                  on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                }`}
              >
                <span>{p.emoji}</span> {p.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1">
            <Save className="h-3 w-3" /> Enregistré {saved}
          </span>
          <button
            onClick={() => setVisible((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 font-semibold"
          >
            {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {visible ? "Masquer" : "Afficher"}
          </button>
        </div>

        <div className="mt-2 rounded-3xl border border-border/60 bg-card p-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`h-72 w-full resize-none rounded-3xl bg-transparent p-4 font-serif text-base leading-relaxed outline-none transition-all ${
              visible ? "" : "blur-sm select-none"
            }`}
            placeholder="Mon amour…"
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{wordCount} mots · ~ {readTime} min à voix haute</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> Auto-sauvegarde
          </span>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amorces si vous êtes bloqué·e</p>
        <ul className="space-y-1.5">
          {sampleLines.map((l) => (
            <li key={l}>
              <button
                onClick={() => setText((t) => `${t}${t.trim() ? "\n\n" : ""}${l}`)}
                className="flex w-full items-center justify-between rounded-2xl bg-card px-3.5 py-3 text-left text-sm ring-1 ring-border/60 hover:bg-secondary"
              >
                <span className="italic">« {l} »</span>
                <span className="text-[10px] text-primary">Insérer</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-border/60 bg-card p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
            <Mic className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Répétez à voix haute</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Enregistrez-vous en lecture. On chronomètre et on vous conseille sur le rythme.
            </p>
          </div>
          <button className="rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold text-background">
            Répéter
          </button>
        </div>
      </section>

      <section className="mx-4 mt-4 flex items-center gap-3 rounded-3xl bg-primary/5 p-4">
        <Heart className="h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1 text-[11px] text-muted-foreground">
          Thomas a écrit <b className="text-foreground">312 mots</b>. Il pourra les lire au jour J.
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl">
        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-glow">
          <Lock className="h-4 w-4" /> Sceller mes vœux
        </button>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          Une fois scellés, vous ne pourrez plus modifier avant le 14 juin à 15 h.
        </p>
      </div>
    </div>
  );
}
