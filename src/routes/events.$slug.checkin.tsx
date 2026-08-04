import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ChevronLeft, Check, Search, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { getEventBySlug } from "@/lib/events.functions";
import { listGuests, checkInGuest } from "@/lib/rsvp.functions";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/events/$slug/checkin")({
  head: () => ({ meta: [{ title: "Check-in — MaFeliza" }, { name: "description", content: "Accueillez et pointez vos invités à l'arrivée." }] }),
  loader: async ({ params }) => {
    const ev = await getEventBySlug({ data: { slug: params.slug } });
    if (!ev) throw notFound();
    return { event: ev };
  },
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Événement introuvable</div>,
  component: CheckinPage,
});

function CheckinPage() {
  const { event } = Route.useLoaderData();
  const { slug } = useParams({ from: "/events/$slug/checkin" });
  const listFn = useServerFn(listGuests);
  const checkFn = useServerFn(checkInGuest);
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const guests = useQuery({
    queryKey: ["guests", event.id],
    queryFn: () => listFn({ data: { eventId: event.id } }),
  });

  const mut = useMutation({
    mutationFn: (v: { guestId: string; checked_in: boolean }) => checkFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guests", event.id] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const rows = guests.data ?? [];
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((g) => g.full_name.toLowerCase().includes(s) || (g.email ?? "").toLowerCase().includes(s));
  }, [guests.data, q]);

  const stats = useMemo(() => {
    const rows = guests.data ?? [];
    const checked = rows.filter((g) => g.checked_in_at).length;
    const expected = rows.filter((g) => g.rsvp === "confirmed").reduce((sum, g) => sum + 1 + (g.plus_ones ?? 0), 0);
    return { checked, expected, total: rows.length };
  }, [guests.data]);

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link to="/events/$slug" params={{ slug }} className="grid h-10 w-10 place-items-center rounded-full bg-surface">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl">Accueil & check-in</h1>
            <p className="text-xs text-muted-foreground">{event.title}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-surface p-3 text-center shadow-card">
            <UserCheck className="mx-auto h-4 w-4 text-success" />
            <p className="mt-1 font-serif text-xl text-success">{stats.checked}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Arrivés</p>
          </div>
          <div className="rounded-2xl bg-surface p-3 text-center shadow-card">
            <p className="mt-1 font-serif text-xl text-primary">{stats.expected}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attendus (avec +1)</p>
          </div>
          <div className="rounded-2xl bg-surface p-3 text-center shadow-card">
            <p className="mt-1 font-serif text-xl">{stats.total}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Invités</p>
          </div>
        </section>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un invité…"
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <section className="space-y-2">
          {guests.isLoading && <p className="text-center text-sm text-muted-foreground">Chargement…</p>}
          {!guests.isLoading && filtered.length === 0 && (
            <p className="rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground">Aucun invité trouvé.</p>
          )}
          {filtered.map((g) => {
            const checked = !!g.checked_in_at;
            return (
              <div key={g.id} className={`flex items-center gap-3 rounded-2xl p-3 shadow-card transition ${checked ? "bg-success/10" : "bg-surface"}`}>
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${checked ? "bg-success" : "bg-gradient-primary"}`}>
                  {checked ? <Check className="h-5 w-5" /> : g.full_name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{g.full_name}{g.plus_ones ? ` +${g.plus_ones}` : ""}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {g.rsvp === "confirmed" ? "Confirmé" : g.rsvp === "maybe" ? "Peut-être" : g.rsvp === "declined" ? "Absent" : "En attente"}
                    {g.table_number ? ` · Table ${g.table_number}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => mut.mutate({ guestId: g.id, checked_in: !checked })}
                  disabled={mut.isPending}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    checked ? "bg-surface text-muted-foreground" : "bg-gradient-primary text-white shadow-glow"
                  }`}
                >
                  {checked ? "Annuler" : "Pointer"}
                </button>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
