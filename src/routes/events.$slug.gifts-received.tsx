import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Gift, Heart, Check, Camera, MoreHorizontal, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/gifts-received")({
  component: GiftsReceived,
  head: () => ({
    meta: [
      { title: "Cadeaux reçus · MaFeliza" },
      { name: "description", content: "Retrouvez chaque cadeau reçu, gardez la trace des donateurs et cochez les remerciements envoyés." },
      { property: "og:title", content: "Cadeaux reçus · MaFeliza" },
      { property: "og:description", content: "Le journal de vos cadeaux post-événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Kind = "cash" | "object" | "experience";
type Status = "toThank" | "thanked";

interface Received {
  id: string;
  kind: Kind;
  title: string;
  amount?: number;
  from: string;
  avatar: string;
  date: string;
  note?: string;
  status: Status;
  photo?: string;
}

const initial: Received[] = [
  {
    id: "g1",
    kind: "cash",
    title: "Cagnotte Voyage de noces",
    amount: 300,
    from: "Isabelle & Marc Bernard",
    avatar: "https://i.pravatar.cc/64?img=47",
    date: "2026-07-25",
    note: "Pour votre lune de miel à Bali 🌴",
    status: "toThank",
  },
  {
    id: "g2",
    kind: "object",
    title: "Machine à café Nespresso Vertuo",
    from: "Camille Rousseau",
    avatar: "https://i.pravatar.cc/64?img=32",
    date: "2026-07-24",
    status: "thanked",
    photo: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=400&auto=format&fit=crop",
  },
  {
    id: "g3",
    kind: "cash",
    title: "Cagnotte Voyage de noces",
    amount: 150,
    from: "Julien Mercier",
    avatar: "https://i.pravatar.cc/64?img=12",
    date: "2026-07-22",
    status: "toThank",
  },
  {
    id: "g4",
    kind: "experience",
    title: "Dîner gastronomique · Le Cinq",
    amount: 250,
    from: "Nadia Ouali",
    avatar: "https://i.pravatar.cc/64?img=45",
    date: "2026-07-20",
    note: "À déguster à deux, félicitations !",
    status: "toThank",
  },
  {
    id: "g5",
    kind: "object",
    title: "Service à raclette Riviera",
    from: "Famille Kessler",
    avatar: "https://i.pravatar.cc/64?img=13",
    date: "2026-07-19",
    status: "thanked",
    photo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop",
  },
  {
    id: "g6",
    kind: "cash",
    title: "Chèque cadeau Décoration",
    amount: 200,
    from: "Léa Durand",
    avatar: "https://i.pravatar.cc/64?img=44",
    date: "2026-07-18",
    status: "toThank",
  },
  {
    id: "g7",
    kind: "experience",
    title: "Cours de cuisine à deux",
    amount: 180,
    from: "Paul & Émilie Vasseur",
    avatar: "https://i.pravatar.cc/64?img=14",
    date: "2026-07-17",
    status: "thanked",
  },
];

const kindMeta: Record<Kind, { label: string; color: string; icon: typeof Gift }> = {
  cash: { label: "Cagnotte", color: "bg-primary/10 text-primary", icon: Heart },
  object: { label: "Objet", color: "bg-accent/20 text-accent-foreground", icon: Gift },
  experience: { label: "Expérience", color: "bg-secondary text-foreground", icon: Camera },
};

function GiftsReceived() {
  const { slug } = useParams({ from: "/events/$slug/gifts-received" });
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");

  const totals = useMemo(() => {
    const cash = items.filter((i) => i.amount).reduce((s, i) => s + (i.amount || 0), 0);
    const objects = items.filter((i) => i.kind === "object").length;
    const toThank = items.filter((i) => i.status === "toThank").length;
    return { cash, objects, toThank };
  }, [items]);

  const filtered = items.filter((i) => {
    if (filter !== "all" && i.kind !== filter) return false;
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (q && !`${i.title} ${i.from}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function toggle(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: i.status === "thanked" ? "toThank" : "thanked" } : i)));
  }

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Cadeaux reçus</p>
        <Link to="/events/$slug/thanks" params={{ slug }} className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
          Remercier
        </Link>
      </div>

      <section className="bg-gradient-to-b from-secondary/70 to-transparent px-4 pb-6 pt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Vos cadeaux</p>
        <h1 className="mt-1 font-serif text-3xl">Journal des présents</h1>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none text-primary">{totals.cash} €</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Reçus</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none">{totals.objects}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Objets</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none">{totals.toThank}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">À remercier</p>
          </div>
        </div>
      </section>

      <div className="sticky top-14 z-10 space-y-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un cadeau ou un invité"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {(["all", "cash", "object", "experience"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${
                filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
              }`}
            >
              {k === "all" ? "Tous" : kindMeta[k].label}
            </button>
          ))}
          <span className="mx-1 w-px shrink-0 bg-border" />
          {(["all", "toThank", "thanked"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${
                statusFilter === s ? "border-foreground bg-foreground text-background" : "border-border bg-background"
              }`}
            >
              {s === "all" ? "Tous statuts" : s === "toThank" ? "À remercier" : "Remerciés"}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3 px-4 pt-4">
        {filtered.length === 0 ? (
          <li className="rounded-3xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Aucun cadeau ne correspond à ces filtres.
          </li>
        ) : (
          filtered.map((g) => {
            const meta = kindMeta[g.kind];
            const Icon = meta.icon;
            return (
              <li
                key={g.id}
                className={`rounded-3xl border p-4 ${
                  g.status === "thanked" ? "border-primary/30 bg-primary/[0.03]" : "border-border/60 bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  {g.photo ? (
                    <img src={g.photo} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                  ) : (
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${meta.color}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">{g.title}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <img src={g.avatar} alt="" className="h-4 w-4 rounded-full object-cover" />
                          {g.from}
                        </p>
                      </div>
                      {g.amount && (
                        <p className="shrink-0 font-serif text-lg leading-none text-primary">{g.amount} €</p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${meta.color}`}>
                        {meta.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(g.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    {g.note && (
                      <p className="mt-2 rounded-xl bg-secondary/60 px-3 py-2 text-[11px] italic text-foreground/80">
                        « {g.note} »
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => toggle(g.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-colors ${
                      g.status === "thanked"
                        ? "bg-primary/10 text-primary"
                        : "bg-foreground text-background"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {g.status === "thanked" ? "Remerciement envoyé" : "Marquer comme remercié"}
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-full border border-border" aria-label="Options">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
