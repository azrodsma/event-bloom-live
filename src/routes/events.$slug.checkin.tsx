import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, QrCode, Search, Check, UserCheck, X, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/checkin")({
  component: CheckIn,
  head: () => ({
    meta: [
      { title: "Check-in · Memento Live" },
      { name: "description", content: "Scannez les QR codes de vos invités et suivez leurs arrivées en temps réel." },
      { property: "og:title", content: "Check-in des invités · Memento Live" },
      { property: "og:description", content: "Un accueil fluide grâce aux QR codes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Guest {
  id: string;
  name: string;
  table: string;
  avatar: string;
  status: "En attente" | "Arrivé" | "Absent";
  arrivedAt?: string;
  plusOnes: number;
}

const seed: Guest[] = [
  { id: "g1", name: "Camille Rousseau", table: "Table 3", avatar: "https://i.pravatar.cc/64?img=32", status: "Arrivé", arrivedAt: "15:42", plusOnes: 1 },
  { id: "g2", name: "Julien Mercier", table: "Table 3", avatar: "https://i.pravatar.cc/64?img=12", status: "Arrivé", arrivedAt: "15:44", plusOnes: 0 },
  { id: "g3", name: "Nadia Ouali", table: "Table d'honneur", avatar: "https://i.pravatar.cc/64?img=45", status: "Arrivé", arrivedAt: "15:46", plusOnes: 1 },
  { id: "g4", name: "Antoine Kessler", table: "Table d'honneur", avatar: "https://i.pravatar.cc/64?img=13", status: "En attente", plusOnes: 0 },
  { id: "g5", name: "Léa Durand", table: "Table 2", avatar: "https://i.pravatar.cc/64?img=44", status: "Arrivé", arrivedAt: "15:51", plusOnes: 0 },
  { id: "g6", name: "Paul Vasseur", table: "Table 3", avatar: "https://i.pravatar.cc/64?img=14", status: "En attente", plusOnes: 2 },
  { id: "g7", name: "Mathilde Roux", table: "Table 3", avatar: "https://i.pravatar.cc/64?img=48", status: "En attente", plusOnes: 0 },
  { id: "g8", name: "Yanis Belkacem", table: "Table 3", avatar: "https://i.pravatar.cc/64?img=16", status: "Absent", plusOnes: 0 },
  { id: "g9", name: "Sofia Marchetti", table: "Table 3", avatar: "https://i.pravatar.cc/64?img=49", status: "Arrivé", arrivedAt: "15:55", plusOnes: 1 },
  { id: "g10", name: "Hugo Prévost", table: "Table 3", avatar: "https://i.pravatar.cc/64?img=52", status: "En attente", plusOnes: 0 },
];

function CheckIn() {
  const { slug } = useParams({ from: "/events/$slug/checkin" });
  const [guests, setGuests] = useState(seed);
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState<{ name: string; table: string } | null>(null);

  const stats = useMemo(() => {
    const arrived = guests.filter((g) => g.status === "Arrivé");
    const totalHeads = guests.reduce((a, g) => a + 1 + g.plusOnes, 0);
    const arrivedHeads = arrived.reduce((a, g) => a + 1 + g.plusOnes, 0);
    return {
      arrived: arrived.length,
      total: guests.length,
      totalHeads,
      arrivedHeads,
      percent: Math.round((arrivedHeads / totalHeads) * 100),
    };
  }, [guests]);

  const filtered = useMemo(() => {
    const list = query
      ? guests.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
      : guests;
    return [...list].sort((a, b) => {
      const order = { "En attente": 0, "Arrivé": 1, Absent: 2 } as const;
      return order[a.status] - order[b.status];
    });
  }, [guests, query]);

  function checkInGuest(id: string) {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status: "Arrivé",
              arrivedAt: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            }
          : g,
      ),
    );
    const g = guests.find((x) => x.id === id);
    if (g) {
      setToast({ name: g.name, table: g.table });
      setTimeout(() => setToast(null), 2600);
    }
  }

  useEffect(() => {
    if (!scanning) return;
    const t = setTimeout(() => {
      const waiting = guests.find((g) => g.status === "En attente");
      if (waiting) checkInGuest(waiting.id);
      setScanning(false);
    }, 1800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Check-in</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-transparent px-4 pb-6 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Arrivées en direct</p>
        <div className="mt-1 flex items-baseline gap-2">
          <h1 className="font-serif text-4xl leading-none">{stats.arrivedHeads}</h1>
          <span className="text-lg text-muted-foreground">/ {stats.totalHeads}</span>
          <span className="ml-2 text-sm font-medium text-primary">{stats.percent}%</span>
        </div>
        <p className="text-xs text-muted-foreground">personnes présentes</p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-background/70">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${stats.percent}%` }} />
        </div>

        <button
          onClick={() => setScanning(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-sm font-semibold text-background shadow-lg"
        >
          <QrCode className="h-5 w-5" /> Scanner un QR code
        </button>
      </section>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un invité…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <ul className="mt-4 space-y-2 px-4">
        {filtered.map((g) => {
          const arrived = g.status === "Arrivé";
          const absent = g.status === "Absent";
          return (
            <li
              key={g.id}
              className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
                arrived ? "border-transparent bg-primary/5" : absent ? "border-transparent bg-muted/60" : "border-border/60 bg-card"
              }`}
            >
              <div className="relative">
                <img src={g.avatar} alt="" className={`h-11 w-11 rounded-full object-cover ${absent ? "opacity-60" : ""}`} />
                {arrived && (
                  <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${absent ? "text-muted-foreground line-through" : ""}`}>
                  {g.name}
                  {g.plusOnes > 0 && <span className="ml-1 text-[10px] font-normal text-muted-foreground">+{g.plusOnes}</span>}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {g.table}
                  {arrived && ` · arrivé à ${g.arrivedAt}`}
                </p>
              </div>
              {!arrived && !absent && (
                <button
                  onClick={() => checkInGuest(g.id)}
                  className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
                >
                  Check-in
                </button>
              )}
              {arrived && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                  <UserCheck className="h-3 w-3" /> {g.arrivedAt}
                </span>
              )}
              {absent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                  <X className="h-3 w-3" /> Absent
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {scanning && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85" onClick={() => setScanning(false)}>
          <div className="relative aspect-square w-72 max-w-[80vw]" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 rounded-3xl border-2 border-white/20" />
            <div className="absolute inset-4 rounded-2xl border-2 border-primary shadow-glow" />
            <div className="absolute inset-x-8 top-1/2 h-0.5 animate-pulse bg-primary shadow-glow" />
            <span className="absolute left-4 top-4 h-6 w-6 rounded-tl-xl border-l-4 border-t-4 border-white" />
            <span className="absolute right-4 top-4 h-6 w-6 rounded-tr-xl border-r-4 border-t-4 border-white" />
            <span className="absolute bottom-4 left-4 h-6 w-6 rounded-bl-xl border-b-4 border-l-4 border-white" />
            <span className="absolute bottom-4 right-4 h-6 w-6 rounded-br-xl border-b-4 border-r-4 border-white" />
          </div>
          <p className="mt-6 text-sm text-white/80">Recherche du QR code…</p>
          <button onClick={() => setScanning(false)} className="mt-4 rounded-full border border-white/20 px-4 py-2 text-xs text-white">
            Annuler
          </button>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-xl">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <strong>{toast.name}</strong> · {toast.table} enregistré
          </span>
        </div>
      )}
    </div>
  );
}
