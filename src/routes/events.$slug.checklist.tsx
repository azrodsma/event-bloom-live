import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, CheckCircle2, Circle, Trash2, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getEventBySlug } from "@/lib/events.functions";
import {
  listChecklist,
  createChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
} from "@/lib/logistics.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/events/$slug/checklist")({
  component: Checklist,
  head: () => ({
    meta: [
      { title: "Checklist · Memento Live" },
      { name: "description", content: "Une checklist collaborative pour ne rien oublier." },
      { property: "og:title", content: "Checklist · Memento Live" },
      { property: "og:description", content: "Cochez chaque étape de votre organisation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const categorySuggestions = ["Administratif", "Lieu & Déco", "Prestataires", "Invités", "Jour J"];

function Checklist() {
  const { slug } = useParams({ from: "/events/$slug/checklist" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchEvent = useServerFn(getEventBySlug);
  const fetchList = useServerFn(listChecklist);
  const addItem = useServerFn(createChecklistItem);
  const toggle = useServerFn(toggleChecklistItem);
  const remove = useServerFn(deleteChecklistItem);

  const { data: event } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent({ data: { slug } }),
  });
  const eventId = event?.id;

  const { data: tasks = [], isLoading } = useQuery({
    enabled: !!eventId,
    queryKey: ["checklist", eventId],
    queryFn: () => fetchList({ data: { eventId: eventId! } }),
  });

  const [filter, setFilter] = useState<"Tous" | "À faire" | "Faits">("À faire");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<string>("Prestataires");

  const done = tasks.filter((t) => t.is_done).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const filtered = useMemo(() => {
    if (filter === "À faire") return tasks.filter((t) => !t.is_done);
    if (filter === "Faits") return tasks.filter((t) => t.is_done);
    return tasks;
  }, [tasks, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    for (const t of filtered) {
      const cat = t.category ?? "Autres";
      const arr = map.get(cat) ?? [];
      arr.push(t);
      map.set(cat, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["checklist", eventId] });

  const addMut = useMutation({
    mutationFn: (input: { title: string; category: string }) =>
      addItem({ data: { eventId: eventId!, title: input.title, category: input.category } }),
    onSuccess: () => {
      setNewTitle("");
      setShowAdd(false);
      invalidate();
      toast.success("Tâche ajoutée");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });
  const toggleMut = useMutation({
    mutationFn: (input: { id: string; isDone: boolean }) => toggle({ data: input }),
    onSuccess: invalidate,
  });
  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
  });

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Checklist</p>
        <button
          onClick={() => user ? setShowAdd(true) : toast.error("Connecte-toi pour ajouter une tâche")}
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

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      <div className="space-y-6 px-4">
        {grouped.map(([cat, list]) => (
          <section key={cat}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">{cat}</span>
              <span className="text-xs text-muted-foreground">{list.length}</span>
            </div>
            <ul className="space-y-2">
              {list.map((t) => (
                <li
                  key={t.id}
                  className={`group flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                    t.is_done ? "border-transparent bg-secondary/50" : "border-border/60 bg-card"
                  }`}
                >
                  <button
                    onClick={() => user && toggleMut.mutate({ id: t.id, isDone: !t.is_done })}
                    disabled={!user}
                    className="mt-0.5 shrink-0"
                    aria-label={t.is_done ? "Décocher" : "Cocher"}
                  >
                    {t.is_done ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/60" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-snug ${t.is_done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {t.title}
                    </p>
                    {t.due_date && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {t.due_date}</span>
                      </div>
                    )}
                  </div>
                  {user && (
                    <button
                      onClick={() => delMut.mutate(t.id)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {!isLoading && grouped.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Aucune tâche pour ce filtre.</p>
        )}
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
              {categorySuggestions.map((c) => (
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
                onClick={() => newTitle.trim() && addMut.mutate({ title: newTitle.trim(), category: newCategory })}
                disabled={!newTitle.trim() || addMut.isPending}
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
