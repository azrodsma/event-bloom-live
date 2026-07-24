import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, MoreVertical, Calendar, MapPin, Clock, Sparkles, Trash2, Copy } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/drafts")({
  component: Drafts,
  head: () => ({
    meta: [
      { title: "Brouillons · Memento Live" },
      { name: "description", content: "Reprenez la création de vos événements là où vous vous êtes arrêté·e." },
      { property: "og:title", content: "Brouillons · Memento Live" },
      { property: "og:description", content: "Vos événements en préparation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Draft = {
  id: string;
  emoji: string;
  type: string;
  title: string;
  date?: string;
  venue?: string;
  progress: number;
  step: string;
  edited: string;
  color: string;
};

const initial: Draft[] = [
  {
    id: "d1",
    emoji: "💍",
    type: "Mariage",
    title: "Notre mariage à la campagne",
    date: "14 juin 2026",
    venue: "Domaine des Lilas",
    progress: 75,
    step: "Étape 6/8 · Faire-part",
    edited: "il y a 12 min",
    color: "from-rose-100 to-rose-200",
  },
  {
    id: "d2",
    emoji: "🎂",
    type: "Anniversaire",
    title: "40 ans de Camille",
    date: "22 septembre 2026",
    progress: 40,
    step: "Étape 3/8 · Confidentialité",
    edited: "hier",
    color: "from-amber-100 to-amber-200",
  },
  {
    id: "d3",
    emoji: "🕊️",
    type: "Baptême",
    title: "Baptême de Léa",
    progress: 15,
    step: "Étape 2/8 · Informations",
    edited: "il y a 3 j",
    color: "from-sky-100 to-sky-200",
  },
  {
    id: "d4",
    emoji: "🏡",
    type: "Crémaillère",
    title: "Nouvelle maison — pendaison",
    date: "à définir",
    progress: 10,
    step: "Étape 1/8 · Type d'événement",
    edited: "la semaine dernière",
    color: "from-emerald-100 to-emerald-200",
  },
];

function Drafts() {
  const [drafts, setDrafts] = useState(initial);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const removeDraft = (id: string) => {
    setDrafts((d) => d.filter((x) => x.id !== id));
    setMenuOpen(null);
  };

  const duplicate = (id: string) => {
    const d = drafts.find((x) => x.id === id);
    if (!d) return;
    setDrafts((prev) => [{ ...d, id: `${id}-copy-${Date.now()}`, title: `${d.title} (copie)`, edited: "à l'instant" }, ...prev]);
    setMenuOpen(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Brouillons</p>
        <Link to="/app/create" className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Nouveau">
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> {drafts.length} événement{drafts.length > 1 ? "s" : ""} en préparation
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Reprenez<br />où vous vous étiez arrêté·e</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Vos brouillons sont enregistrés automatiquement toutes les 30 secondes.
        </p>
      </section>

      {drafts.length === 0 ? (
        <div className="mx-4 mt-6 rounded-3xl border border-dashed border-border p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-2xl">📝</span>
          <p className="mt-3 font-serif text-lg">Aucun brouillon</p>
          <p className="mx-auto mt-1 max-w-xs text-[11px] text-muted-foreground">
            Commencez à créer un événement — nous garderons chaque étape en mémoire.
          </p>
          <Link to="/app/create" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground">
            <Plus className="h-4 w-4" /> Créer un événement
          </Link>
        </div>
      ) : (
        <ul className="space-y-3 px-4 pt-2">
          {drafts.map((d) => (
            <li key={d.id} className="relative overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className={`relative h-24 w-full bg-gradient-to-br ${d.color}`}>
                <span className="absolute left-4 top-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/70 text-3xl shadow-sm backdrop-blur">
                  {d.emoji}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
                  {d.type}
                </span>
                <button
                  onClick={() => setMenuOpen((m) => (m === d.id ? null : d.id))}
                  className="absolute right-3 bottom-3 grid h-8 w-8 place-items-center rounded-full bg-white/80 backdrop-blur"
                  aria-label="Actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4">
                <h2 className="font-serif text-lg leading-tight">{d.title}</h2>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  {d.date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {d.date}
                    </span>
                  )}
                  {d.venue && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {d.venue}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Modifié {d.edited}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold">{d.step}</span>
                    <span className="text-muted-foreground">{d.progress}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${d.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to="/app/create"
                    className="flex-1 rounded-full bg-foreground py-2.5 text-center text-xs font-bold text-background"
                  >
                    Reprendre
                  </Link>
                  <button
                    onClick={() => duplicate(d.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-2.5 text-xs font-semibold"
                  >
                    <Copy className="h-3.5 w-3.5" /> Dupliquer
                  </button>
                </div>
              </div>

              {menuOpen === d.id && (
                <div className="absolute right-3 top-14 z-10 w-44 overflow-hidden rounded-2xl border border-border bg-popover shadow-glow">
                  <button
                    onClick={() => duplicate(d.id)}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-muted"
                  >
                    <Copy className="h-3.5 w-3.5" /> Dupliquer
                  </button>
                  <button
                    onClick={() => removeDraft(d.id)}
                    className="flex w-full items-center gap-2 border-t border-border px-3.5 py-2.5 text-left text-xs font-semibold text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mx-4 mt-6 rounded-3xl bg-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Astuce</p>
        <p className="mt-2 font-serif text-lg leading-tight">Créez à plusieurs</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Invitez votre partenaire ou un proche à co-organiser un brouillon en temps réel.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background">
          Inviter un co-organisateur
        </button>
      </div>
    </div>
  );
}
