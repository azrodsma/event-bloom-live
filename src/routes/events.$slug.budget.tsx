import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, TrendingUp, Wallet, Loader2, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getEventBySlug } from "@/lib/events.functions";
import { listBudget, createBudgetItem, updateBudgetItem } from "@/lib/logistics.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/events/$slug/budget")({
  component: Budget,
  head: () => ({
    meta: [
      { title: "Budget · Memento Live" },
      { name: "description", content: "Suivez chaque dépense de votre événement, catégorie par catégorie." },
      { property: "og:title", content: "Budget · Memento Live" },
      { property: "og:description", content: "Un suivi budgétaire clair et partagé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function euro(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function Budget() {
  const { slug } = useParams({ from: "/events/$slug/budget" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchEvent = useServerFn(getEventBySlug);
  const fetchList = useServerFn(listBudget);
  const addItem = useServerFn(createBudgetItem);
  const update = useServerFn(updateBudgetItem);

  const { data: event } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent({ data: { slug } }),
  });
  const eventId = event?.id;

  const { data: lines = [], isLoading } = useQuery({
    enabled: !!eventId,
    queryKey: ["budget", eventId],
    queryFn: () => fetchList({ data: { eventId: eventId! } }),
  });

  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("Prestataires");
  const [estimated, setEstimated] = useState("");

  const stats = useMemo(() => {
    const planned = lines.reduce((a, l) => a + Number(l.estimated ?? 0), 0);
    const spent = lines.reduce((a, l) => a + Number(l.actual ?? 0), 0);
    return { planned, spent, engaged: planned - spent };
  }, [lines]);

  const byCategory = useMemo(() => {
    const map = new Map<string, { planned: number; spent: number }>();
    for (const l of lines) {
      const cat = l.category ?? "Divers";
      const cur = map.get(cat) ?? { planned: 0, spent: 0 };
      cur.planned += Number(l.estimated ?? 0);
      cur.spent += Number(l.actual ?? 0);
      map.set(cat, cur);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].planned - a[1].planned);
  }, [lines]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["budget", eventId] });

  const addMut = useMutation({
    mutationFn: () =>
      addItem({
        data: { eventId: eventId!, label: label.trim(), category, estimated: Number(estimated) || 0 },
      }),
    onSuccess: () => {
      setLabel(""); setEstimated(""); setShowAdd(false);
      invalidate();
      toast.success("Dépense ajoutée");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const paidMut = useMutation({
    mutationFn: (input: { id: string; paid: boolean; actual: number }) =>
      update({ data: input }),
    onSuccess: invalidate,
  });

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Budget</p>
        <button
          onClick={() => user ? setShowAdd(true) : toast.error("Connecte-toi pour ajouter")}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"
          aria-label="Nouvelle dépense">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-accent/15 to-transparent px-4 pb-8 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Budget prévu</p>
        <h1 className="mt-1 font-serif text-4xl leading-tight">{euro(stats.planned)}</h1>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-background/70">
          <div className="h-full bg-primary transition-all" style={{ width: `${stats.planned ? (stats.spent / stats.planned) * 100 : 0}%` }} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-background/70 p-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dépensé</p>
            <p className="mt-1 font-serif text-lg leading-none">{euro(stats.spent)}</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Reste à payer</p>
            <p className="mt-1 font-serif text-lg leading-none">{euro(Math.max(0, stats.engaged))}</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lignes</p>
            <p className="mt-1 font-serif text-lg leading-none">{lines.length}</p>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {byCategory.length > 0 && (
        <section className="px-4 pt-6">
          <h2 className="mb-3 font-serif text-lg">Répartition par catégorie</h2>
          <ul className="space-y-2">
            {byCategory.map(([cat, val]) => {
              const percent = stats.planned ? Math.round((val.planned / stats.planned) * 100) : 0;
              return (
                <li key={cat} className="rounded-2xl border border-border/60 bg-card p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">{cat}</p>
                    <p className="text-xs font-mono">{euro(val.planned)}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{percent}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="px-4 pt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Dépenses détaillées</h2>
          <span className="text-xs text-muted-foreground">{lines.length} lignes</span>
        </div>
        <ul className="space-y-2">
          {lines.map((l) => {
            const planned = Number(l.estimated ?? 0);
            const spent = Number(l.actual ?? 0);
            return (
              <li key={l.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                <button
                  onClick={() =>
                    user && paidMut.mutate({ id: l.id, paid: !l.paid, actual: l.paid ? spent : planned })
                  }
                  disabled={!user}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${l.paid ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}
                  aria-label="Marquer payé"
                >
                  <Check className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.label}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${l.paid ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {l.paid ? "Payé" : "À payer"}
                    </span>
                    {l.category && <span className="text-[10px] text-muted-foreground">{l.category}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium">{euro(planned)}</p>
                  {spent > 0 && spent !== planned && (
                    <p className="font-mono text-[10px] text-muted-foreground">Versé {euro(spent)}</p>
                  )}
                </div>
              </li>
            );
          })}
          {!isLoading && lines.length === 0 && (
            <li className="py-10 text-center text-sm text-muted-foreground">Aucune dépense pour l'instant.</li>
          )}
        </ul>
      </section>

      {event?.cagnotte_url && (
        <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-foreground to-foreground/80 p-6 text-background">
          <div className="flex items-center gap-3">
            <Wallet className="h-6 w-6" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] opacity-80">Cagnotte externe</p>
              <p className="font-serif text-lg">Contributions : {euro(Number(event.cagnotte_current ?? 0))}</p>
            </div>
          </div>
          <p className="mt-3 text-xs opacity-80">
            Les fonds sont gérés sur la plateforme externe et viennent soutenir votre budget.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-full bg-background/10 px-3 py-2 text-xs">
            <TrendingUp className="h-3.5 w-3.5" /> Objectif {euro(Number(event.cagnotte_goal ?? 0))}
          </div>
        </section>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-background p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl">Nouvelle dépense</h3>
            <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Libellé</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex. Photographe" autoFocus
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary" />
            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Catégorie</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary" />
            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Montant estimé (€)</label>
            <input type="number" value={estimated} onChange={(e) => setEstimated(e.target.value)} placeholder="0"
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary" />
            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-full border border-border py-3 text-sm font-medium">Annuler</button>
              <button onClick={() => label.trim() && addMut.mutate()}
                disabled={!label.trim() || addMut.isPending}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
