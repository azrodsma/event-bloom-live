import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, CheckCircle2, Circle, Trash2, Calendar as CalendarIcon, Users } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/checklist")({
  component: Checklist,
  head: () => ({
    meta: [
      { title: "Checklist · Memento Live" },
      { name: "description", content: "Cochez chaque étape de votre organisation, de la réservation du lieu au jour J." },
      { property: "og:title", content: "Checklist · Memento Live" },
      { property: "og:description", content: "Une checklist collaborative pour ne rien oublier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Category = "Administratif" | "Lieu & Déco" | "Prestataires" | "Invités" | "Jour J";

interface Task {
  id: string;
  title: string;
  done: boolean;
  category: Category;
  due: string;
  assignee: string;
}

const initialTasks: Task[] = [
  { id: "t1", title: "Réserver le lieu de réception", done: true, category: "Lieu & Déco", due: "J-180", assignee: "Sarah" },
  { id: "t2", title: "Envoyer les faire-part", done: true, category: "Invités", due: "J-120", assignee: "Thomas" },
  { id: "t3", title: "Choisir le photographe / vidéaste", done: true, category: "Prestataires", due: "J-150", assignee: "Sarah" },
  { id: "t4", title: "Sélectionner le traiteur et menu", done: true, category: "Prestataires", due: "J-90", assignee: "Thomas" },
  { id: "t5", title: "Répétition à la mairie", done: false, category: "Administratif", due: "J-14", assignee: "Sarah" },
  { id: "t6", title: "Confirmer la playlist finale avec le DJ", done: false, category: "Prestataires", due: "J-10", assignee: "Camille" },
  { id: "t7", title: "Finaliser le plan de table", done: false, category: "Invités", due: "J-7", assignee: "Sarah" },
  { id: "t8", title: "Préparer les accessoires du photobooth", done: false, category: "Lieu & Déco", due: "J-3", assignee: "Julien" },
  { id: "t9", title: "Briefing des témoins", done: false, category: "Jour J", due: "J-1", assignee: "Thomas" },
  { id: "t10", title: "Vérifier le matériel de diffusion Live", done: false, category: "Jour J", due: "Jour J", assignee: "Camille" },
];

const categoryOrder: Category[] = ["Administratif", "Lieu & Déco", "Prestataires", "Invités", "Jour J"];

const categoryStyles: Record<Category, string> = {
  "Administratif": "bg-primary/10 text-primary",
  "Lieu & Déco": "bg-accent/30 text-foreground",
  "Prestataires": "bg-secondary text-foreground",
  "Invités": "bg-primary/15 text-primary",
  "Jour J": "bg-foreground text-background",
};

function Checklist() {
  const { slug } = useParams({ from: "/events/$slug/checklist" });
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<"Tous" | "À faire" | "Faits">("À faire");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Prestataires");

  const done = tasks.filter((t) => t.done).length;
  const percent = Math.round((done / tasks.length) * 100);

  const filtered = useMemo(() => {
    if (filter === "À faire") return tasks.filter((t) => !t.done);
    if (filter === "Faits") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const grouped = useMemo(() => {
    const map = new Map<Category, Task[]>();
    for (const t of filtered) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return categoryOrder.map((c) => [c, map.get(c) ?? []] as const).filter(([, arr]) => arr.length > 0);
  }, [filtered]);

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }
  function add() {
    if (!newTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: `t${Date.now()}`, title: newTitle.trim(), done: false, category: newCategory, due: "J-30", assignee: "Moi" },
    ]);
    setNewTitle("");
    setShowAdd(false);
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Checklist</p>
        <button
          onClick={() => setShowAdd(true)}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"
          aria-label="Ajouter une tâche"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-secondary/60 to-transparent px-4 pb-6 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Progression</p>
        <div className="mt-2 flex items-baseline justify-between">
          <h1 className="font-serif text-3xl">
            {done}<span className="text-muted-foreground">/{tasks.length}</span>
          </h1>
          <span className="text-sm font-medium text-primary">{percent}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/70">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-4">
        {(["À faire", "Faits", "Tous"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              f === filter ? "bg-foreground text-background" : "border border-border bg-background"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-6 px-4">
        {grouped.map(([cat, list]) => (
          <section key={cat}>
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${categoryStyles[cat]}`}>
                {cat}
              </span>
              <span className="text-xs text-muted-foreground">{list.length}</span>
            </div>
            <ul className="space-y-2">
              {list.map((t) => (
                <li
                  key={t.id}
                  className={`group flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                    t.done ? "border-transparent bg-secondary/50" : "border-border/60 bg-card"
                  }`}
                >
                  <button
                    onClick={() => toggle(t.id)}
                    className="mt-0.5 shrink-0"
                    aria-label={t.done ? "Décocher" : "Cocher"}
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/60" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-snug ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {t.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {t.due}</span>
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {t.assignee}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(t.id)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-danger" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-background p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl">Nouvelle tâche</h3>

            <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Titre</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex. Confirmer le fleuriste"
              autoFocus
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary"
            />

            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Catégorie</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {categoryOrder.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewCategory(c)}
                  className={`rounded-2xl border px-3 py-2 text-xs font-medium ${
                    newCategory === c ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-full border border-border py-3 text-sm font-medium">
                Annuler
              </button>
              <button
                onClick={add}
                disabled={!newTitle.trim()}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
