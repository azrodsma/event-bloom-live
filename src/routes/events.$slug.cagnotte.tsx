import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ChevronLeft, ExternalLink, Save } from "lucide-react";
import { useState } from "react";
import { getEventBySlug, updateCagnotte } from "@/lib/events.functions";
import { CagnotteCard } from "@/components/CagnotteCard";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/events/$slug/cagnotte")({
  head: () => ({ meta: [{ title: "Cagnotte — Memento Live" }, { name: "description", content: "Configurez votre cagnotte externe." }] }),
  loader: async ({ params }) => {
    const ev = await getEventBySlug({ data: { slug: params.slug } });
    if (!ev) throw notFound();
    return { event: ev };
  },
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Événement introuvable</div>,
  component: CagnottePage,
});

function CagnottePage() {
  const { event } = Route.useLoaderData();
  const { slug } = useParams({ from: "/events/$slug/cagnotte" });
  const qc = useQueryClient();
  const update = useServerFn(updateCagnotte);
  const [url, setUrl] = useState(event.cagnotte_url ?? "");
  const [goal, setGoal] = useState(event.cagnotte_goal ? String(event.cagnotte_goal) : "");
  const [current, setCurrent] = useState(event.cagnotte_current ? String(event.cagnotte_current) : "");

  const mut = useMutation({
    mutationFn: () => update({
      data: {
        eventId: event.id,
        cagnotte_url: url || null,
        cagnotte_goal: goal ? Number(goal) : null,
        cagnotte_current: current ? Number(current) : null,
      },
    }),
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Cagnotte mise à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link to="/events/$slug" params={{ slug }} className="grid h-10 w-10 place-items-center rounded-full bg-surface">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl">Cagnotte externe</h1>
            <p className="text-xs text-muted-foreground">{event.title}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-5">
        <div className="rounded-2xl border border-gold/30 bg-gold-light/40 p-4 text-sm">
          <p><strong>Cagnotte externe uniquement.</strong> Nous n'encaissons rien : collez le lien de votre cagnotte Leetchi, Lydia, PayPal Pool, OnParticipe…</p>
        </div>

        <section className="rounded-3xl bg-surface p-5 shadow-card space-y-3">
          <Field label="Lien de la cagnotte" value={url} onChange={setUrl} placeholder="https://leetchi.com/..." />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Objectif (€)" type="number" value={goal} onChange={setGoal} placeholder="7000" />
            <Field label="Montant actuel (€)" type="number" value={current} onChange={setCurrent} placeholder="0" />
          </div>
          <button
            disabled={mut.isPending}
            onClick={() => mut.mutate()}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {mut.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </section>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Aperçu invités</p>
          <CagnotteCard url={url} goal={goal ? Number(goal) : null} current={current ? Number(current) : null} />
        </div>

        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            Ouvrir la cagnotte externe <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </main>
    </div>
  );
}

function Field({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
    </div>
  );
}

