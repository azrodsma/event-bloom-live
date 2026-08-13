import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowLeft, Handshake, Search, Phone, Mail, Plus, Trash2, LogIn } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import {
  listEventVendors,
  createEventVendor,
  updateEventVendor,
  deleteEventVendor,
} from "@/lib/vendors.functions";
import { useAuth } from "@/hooks/use-auth";
import { findEvent } from "@/lib/mock-data";

const routeLoader = async ({ params }: { params: { slug: string } }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) {
      const e = findEvent(params.slug);
      if (!e) throw notFound();
      return { event: e, dbId: null as string | null };
    }
    return { event: adaptEvent(db), dbId: db.id };
  };
type RouteLoaderData = Awaited<ReturnType<typeof routeLoader>>;

export const Route = createFileRoute("/events/$slug/vendors-hub")({
  head: ({ params }) => ({
    meta: [
      { title: `Prestataires · ${params.slug} — MaFeliza` },
      { name: "description", content: "Le hub central de tous vos prestataires : statut, contact, devis, contrats." },
      { property: "og:title", content: "Prestataires · MaFeliza" },
      { property: "og:description", content: "Un seul endroit pour orchestrer votre équipe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: routeLoader,
  component: VendorsHub,
});

const STATUSES = ["à contacter", "négociation", "confirmé", "acompte payé"] as const;

const statusStyle: Record<string, string> = {
  "acompte payé": "bg-emerald-100 text-emerald-800",
  confirmé: "bg-primary/10 text-primary",
  négociation: "bg-amber-100 text-amber-800",
  "à contacter": "bg-rose-100 text-rose-800",
};

function VendorsHub() {
  const { dbId } = Route.useLoaderData() as RouteLoaderData;
  const { slug } = useParams({ from: "/events/$slug/vendors-hub" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const list = useServerFn(listEventVendors);
  const create = useServerFn(createEventVendor);
  const update = useServerFn(updateEventVendor);
  const remove = useServerFn(deleteEventVendor);

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors", dbId],
    queryFn: () => (dbId ? list({ data: { eventId: dbId } }) : Promise.resolve([])),
    enabled: !!dbId,
  });

  const [q, setQ] = useState("");
  const [f, setF] = useState<"Tous" | (typeof STATUSES)[number]>("Tous");
  const [form, setForm] = useState({ name: "", category: "", email: "", phone: "", price: "" });
  const [busy, setBusy] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["vendors", dbId] });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!dbId || !form.name.trim()) return;
    setBusy(true);
    try {
      await create({
        data: {
          eventId: dbId,
          name: form.name.trim(),
          category: form.category.trim() || undefined,
          contactEmail: form.email.trim() || undefined,
          contactPhone: form.phone.trim() || undefined,
          price: form.price ? Number(form.price) : undefined,
          status: "à contacter",
        },
      });
      setForm({ name: "", category: "", email: "", phone: "", price: "" });
      await invalidate();
    } finally {
      setBusy(false);
    }
  }

  const filtered = vendors.filter((v) => {
    const okS = f === "Tous" ? true : v.status === f;
    const okQ = !q.trim() ? true : ((v.name ?? "") + (v.category ?? "")).toLowerCase().includes(q.toLowerCase());
    return okS && okQ;
  });

  const total = vendors.reduce((s, v) => s + Number(v.price ?? 0), 0);
  const paid = vendors.filter((v) => v.status === "acompte payé").reduce((s, v) => s + Number(v.price ?? 0) * 0.5, 0);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Prestataires</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Handshake className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/30 to-background px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Handshake className="h-3.5 w-3.5 text-primary" /> Votre équipe du jour
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">L'orchestre au complet</h1>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">{vendors.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Prestas</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">{Math.round(total).toLocaleString("fr-FR")} €</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none text-primary">{Math.round(paid).toLocaleString("fr-FR")} €</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Versés</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2.5 backdrop-blur">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom, métier…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </section>

      <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3">
        {(["Tous", ...STATUSES] as const).map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
              f === x ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
            }`}
          >
            {x}
          </button>
        ))}
      </div>

      {user && dbId ? (
        <form onSubmit={onCreate} className="mx-4 space-y-2 rounded-2xl border border-border/60 bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Ajouter un prestataire</p>
          <div className="grid grid-cols-2 gap-2">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom" className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Métier (DJ, Traiteur…)" className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone" className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
          </div>
          <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Budget prévu €" className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm" />
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2 text-xs font-bold text-background disabled:opacity-60">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      ) : !user ? (
        <div className="mx-4 flex items-center justify-between rounded-2xl border border-dashed border-border/60 p-4 text-sm">
          <span className="text-muted-foreground">Connectez-vous pour gérer vos prestataires.</span>
          <Link to="/auth" className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><LogIn className="h-3 w-3" /> Se connecter</Link>
        </div>
      ) : null}

      <ul className="space-y-3 px-4 pt-4">
        {filtered.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
            Aucun prestataire {f !== "Tous" ? `en statut "${f}"` : "pour l'instant"}.
          </li>
        )}
        {filtered.map((v) => (
          <li key={v.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
            <div className="flex items-start gap-3 p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 font-serif text-lg text-primary">
                {v.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[15px] leading-tight">{v.name}</p>
                    {v.category && <p className="mt-0.5 text-[11px] text-muted-foreground">{v.category}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${statusStyle[v.status ?? ""] ?? "bg-secondary text-foreground"}`}>
                    {v.status ?? "—"}
                  </span>
                </div>
                {v.price != null && (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    <span className="font-serif text-foreground">{Number(v.price).toLocaleString("fr-FR")} €</span>
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-border/60 bg-secondary/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                {v.contact_phone && (
                  <a href={`tel:${v.contact_phone}`} className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-[11px]">
                    <Phone className="h-3 w-3" /> {v.contact_phone}
                  </a>
                )}
                {v.contact_email && (
                  <a href={`mailto:${v.contact_email}`} className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-[11px]">
                    <Mail className="h-3 w-3" /> {v.contact_email}
                  </a>
                )}
              </div>
              {user && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={v.status ?? "à contacter"}
                    onChange={async (e) => { await update({ data: { id: v.id, status: e.target.value } }); await invalidate(); }}
                    className="rounded-full border border-border/60 bg-background px-3 py-1 text-[11px]"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={async () => { await remove({ data: { id: v.id } }); await invalidate(); }}
                    className="ml-auto grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-background"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
