import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowLeft, Wallet, TrendingUp, Plus, ExternalLink, LogIn, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import {
  listRegistryItems,
  createRegistryItem,
  reserveRegistryItem,
  unreserveRegistryItem,
  deleteRegistryItem,
} from "@/lib/registry.functions";
import { useAuth } from "@/hooks/use-auth";
import { findEvent } from "@/lib/mock-data";

const routeLoader = async ({ params }: { params: { slug: string } }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) {
      const e = findEvent(params.slug);
      if (!e) throw notFound();
      return { event: e, dbId: null as string | null, isOwner: false };
    }
    return { event: adaptEvent(db), dbId: db.id, isOwner: false };
  };
type RouteLoaderData = Awaited<ReturnType<typeof routeLoader>>;

export const Route = createFileRoute("/events/$slug/gift-registry")({
  head: ({ params }) => ({
    meta: [
      { title: `Liste de cadeaux · ${params.slug} — MaFeliza` },
      { name: "description", content: "Cadeaux ciblés et cagnotte externe : liberté totale des invités." },
      { property: "og:title", content: "Liste · MaFeliza" },
      { property: "og:description", content: "Idées curatées, cagnotte externe, zéro commission." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: routeLoader,
  component: GiftRegistry,
});

function GiftRegistry() {
  const { event, dbId } = Route.useLoaderData() as RouteLoaderData;
  const { slug } = useParams({ from: "/events/$slug/gift-registry" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const list = useServerFn(listRegistryItems);
  const create = useServerFn(createRegistryItem);
  const reserve = useServerFn(reserveRegistryItem);
  const unreserve = useServerFn(unreserveRegistryItem);
  const remove = useServerFn(deleteRegistryItem);

  const { data: items = [] } = useQuery({
    queryKey: ["registry", dbId],
    queryFn: () => (dbId ? list({ data: { eventId: dbId } }) : Promise.resolve([])),
    enabled: !!dbId,
  });

  const [form, setForm] = useState({ title: "", price: "", url: "", desc: "" });
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["registry", dbId] });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!dbId || !form.title.trim()) return;
    setBusy(true);
    try {
      await create({
        data: {
          eventId: dbId,
          title: form.title.trim(),
          description: form.desc.trim() || undefined,
          price: form.price ? Number(form.price) : undefined,
          externalUrl: form.url.trim() || undefined,
        },
      });
      setForm({ title: "", price: "", url: "", desc: "" });
      await invalidate();
    } finally {
      setBusy(false);
    }
  }

  const total = items.reduce((a, it) => a + Number(it.price ?? 0), 0);
  const reserved = items.filter((i) => i.is_reserved).reduce((a, it) => a + Number(it.price ?? 0), 0);

  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Liste de cadeaux</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{event.title}</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Wallet className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-gold/20 p-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">L'argent reste dehors. La joie reste dedans.</h2>
          <p className="mt-2 text-sm text-muted-foreground">MaFeliza ne prend zéro commission. Vos invités paient directement sur la plateforme externe.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-background/60 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Objectif total</p>
              <p className="font-display text-2xl text-primary">{Math.round(total).toLocaleString("fr-FR")} €</p>
            </div>
            <div className="rounded-2xl bg-background/60 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Déjà réservé</p>
              <p className="font-display text-2xl text-foreground">{Math.round(reserved).toLocaleString("fr-FR")} €</p>
            </div>
          </div>
        </section>

        {user && dbId ? (
          <form onSubmit={onCreate} className="space-y-2 rounded-2xl border border-border/60 bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Ajouter une idée</p>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre du cadeau" className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Prix €" className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
              <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="Lien externe (https://…)" className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
            </div>
            <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Description (optionnelle)" className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2 text-xs font-bold text-background disabled:opacity-60">
              <Plus className="h-4 w-4" /> Ajouter à la liste
            </button>
          </form>
        ) : !user ? (
          <div className="flex items-center justify-between rounded-2xl border border-dashed border-border/60 p-4 text-sm">
            <span className="text-muted-foreground">Connectez-vous pour proposer ou réserver un cadeau.</span>
            <Link to="/auth" className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><LogIn className="h-3 w-3" /> Se connecter</Link>
          </div>
        ) : null}

        <section className="space-y-3">
          {items.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
              Aucun cadeau pour l'instant. {user ? "Ajoutez votre première idée ci-dessus." : "Revenez bientôt !"}
            </p>
          )}
          {items.map((it) => (
            <div key={it.id} className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">{it.title}</p>
                  {it.description && <p className="mt-1 text-xs text-muted-foreground">{it.description}</p>}
                  {it.is_reserved && (
                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <Check className="h-3 w-3" /> Réservé par {it.reserved_by ?? "un invité"}
                    </p>
                  )}
                </div>
                {it.price != null && <span className="shrink-0 font-display text-lg">{Number(it.price).toLocaleString("fr-FR")} €</span>}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {it.external_url && (
                  <a href={it.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
                    <ExternalLink className="h-3 w-3" /> Voir
                  </a>
                )}
                {user && !it.is_reserved && (
                  <div className="flex flex-1 items-center gap-2">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre prénom" className="min-w-0 flex-1 rounded-full border border-border/60 bg-background px-3 py-1 text-xs" />
                    <button
                      onClick={async () => {
                        const n = name.trim();
                        if (!n) return;
                        await reserve({ data: { id: it.id, reservedBy: n } });
                        await invalidate();
                      }}
                      className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
                    >
                      Réserver
                    </button>
                  </div>
                )}
                {user && it.is_reserved && (
                  <button
                    onClick={async () => { await unreserve({ data: { id: it.id } }); await invalidate(); }}
                    className="rounded-full bg-secondary px-3 py-1 text-xs"
                  >
                    Libérer
                  </button>
                )}
                {user && (
                  <button
                    onClick={async () => { await remove({ data: { id: it.id } }); await invalidate(); }}
                    className="ml-auto grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
