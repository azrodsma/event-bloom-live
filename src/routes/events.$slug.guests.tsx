import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ChevronLeft, Users, UserCheck, UserX, HelpCircle, Download, ScanLine, MailPlus, Trash2 } from "lucide-react";
import { getEventBySlug } from "@/lib/events.functions";
import { listGuests, getRsvpStats, sendRsvpReminders, deleteGuest } from "@/lib/rsvp.functions";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/guests")({
  head: () => ({ meta: [{ title: "Invités — Memento Live" }, { name: "description", content: "Suivez les RSVP en temps réel." }] }),
  loader: async ({ params }) => {
    const ev = await getEventBySlug({ data: { slug: params.slug } });
    if (!ev) throw notFound();
    return { event: ev };
  },
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Événement introuvable</div>,
  component: GuestsPage,
});

function GuestsPage() {
  const { event } = Route.useLoaderData();
  const { slug } = useParams({ from: "/events/$slug/guests" });
  const listFn = useServerFn(listGuests);
  const statsFn = useServerFn(getRsvpStats);
  const remindFn = useServerFn(sendRsvpReminders);
  const deleteFn = useServerFn(deleteGuest);
  const qc = useQueryClient();
  const [toast, setToast] = useState<string | null>(null);

  const guests = useQuery({
    queryKey: ["guests", event.id],
    queryFn: () => listFn({ data: { eventId: event.id } }),
  });
  const stats = useQuery({
    queryKey: ["rsvp-stats", event.id],
    queryFn: () => statsFn({ data: { eventId: event.id } }),
  });

  const remind = useMutation({
    mutationFn: () => remindFn({ data: { eventId: event.id } }),
    onSuccess: (r) => {
      setToast(r.reason === "email_not_configured"
        ? "Envoi d'email non configuré."
        : `Rappels envoyés : ${r.sent} · ignorés : ${r.skipped}`);
      setTimeout(() => setToast(null), 4000);
    },
  });

  const del = useMutation({
    mutationFn: (guestId: string) => deleteFn({ data: { guestId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guests", event.id] });
      qc.invalidateQueries({ queryKey: ["rsvp-stats", event.id] });
    },
  });

  const labelFor = (r: string) =>
    r === "confirmed" ? { label: "Confirmé", cls: "bg-success/15 text-success" }
    : r === "declined" ? { label: "Absent", cls: "bg-destructive/15 text-destructive" }
    : r === "maybe" ? { label: "Peut-être", cls: "bg-gold-light text-gold" }
    : { label: "En attente", cls: "bg-secondary text-muted-foreground" };

  function exportCsv() {
    const rows = guests.data ?? [];
    const headers = ["Nom", "Email", "Téléphone", "Statut", "Accompagnants", "Régime", "Table", "Check-in", "Notes"];
    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      headers.join(","),
      ...rows.map((g) => [
        g.full_name, g.email ?? "", g.phone ?? "", g.rsvp,
        g.plus_ones ?? 0, g.dietary ?? "", g.table_number ?? "",
        g.checked_in_at ? new Date(g.checked_in_at).toLocaleString("fr-FR") : "",
        g.notes ?? "",
      ].map(esc).join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invites-${event.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link to="/events/$slug" params={{ slug }} className="grid h-10 w-10 place-items-center rounded-full bg-surface">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-xl">Invités & RSVP</h1>
            <p className="truncate text-xs text-muted-foreground">{event.title}</p>
          </div>
          <button onClick={exportCsv} disabled={!guests.data?.length} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold disabled:opacity-50">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="grid grid-cols-4 gap-2">
          <Stat icon={Users} label="Total" value={stats.data?.total ?? "—"} />
          <Stat icon={UserCheck} label="Oui" value={stats.data?.confirmed ?? "—"} tone="success" />
          <Stat icon={HelpCircle} label="?" value={stats.data?.maybe ?? "—"} tone="gold" />
          <Stat icon={UserX} label="Non" value={stats.data?.declined ?? "—"} tone="danger" />
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/events/$slug/invite" params={{ slug }} className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center text-sm font-semibold text-primary">
            Partager le lien RSVP
          </Link>
          <Link to="/events/$slug/checkin" params={{ slug }} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary p-4 text-center text-sm font-semibold text-white shadow-glow">
            <ScanLine className="h-4 w-4" /> Check-in à l'accueil
          </Link>
        </div>

        <section className="space-y-2">
          {guests.isLoading && <p className="text-center text-sm text-muted-foreground">Chargement…</p>}
          {!guests.isLoading && !guests.data?.length && (
            <p className="rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground">
              Aucun RSVP pour l'instant. Partagez le lien d'invitation pour recevoir les réponses.
            </p>
          )}
          {guests.data?.map((g) => {
            const lbl = labelFor(g.rsvp);
            return (
              <div key={g.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                  {g.full_name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {g.full_name}{g.plus_ones ? ` +${g.plus_ones}` : ""}
                    {g.checked_in_at && <span className="ml-2 rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">✓ Arrivé</span>}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{g.email}{g.dietary ? ` · ${g.dietary}` : ""}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${lbl.cls}`}>{lbl.label}</span>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number | string; tone?: "success" | "gold" | "danger" }) {
  const color = tone === "success" ? "text-success" : tone === "gold" ? "text-gold" : tone === "danger" ? "text-destructive" : "text-primary";
  return (
    <div className="rounded-2xl bg-surface p-3 text-center shadow-card">
      <Icon className={`mx-auto h-4 w-4 ${color}`} />
      <p className={`mt-1 font-serif text-xl ${color}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
