import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Ticket, QrCode, Sparkles, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/tickets")({
  component: Tickets,
  head: () => ({
    meta: [
      { title: "Billetterie · Memento Live" },
      { name: "description", content: "Billets nominatifs avec QR code, sans manipuler d'argent — reversés vers votre cagnotte externe." },
      { property: "og:title", content: "Billetterie · Memento Live" },
      { property: "og:description", content: "Le contrôle d'accès élégant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tiers = [
  { id: "t1", name: "Cérémonie & dîner", price: 0, note: "Invités confirmés", stock: 120, sold: 96 },
  { id: "t2", name: "Soirée dansante", price: 0, note: "Invités confirmés + plus-un", stock: 160, sold: 138 },
  { id: "t3", name: "Brunch du lendemain", price: 25, note: "Participation optionnelle · Lydia", stock: 80, sold: 42 },
];

function Tickets() {
  const { slug } = useParams({ from: "/events/$slug/tickets" });
  const [sel, setSel] = useState("t1");
  const active = tiers.find((t) => t.id === sel)!;
  const pct = Math.round((active.sold / active.stock) * 100);

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Billetterie</p>
          <p className="text-xs text-muted-foreground">Contrôle d'accès nominatif</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="grid grid-cols-3 gap-2">
          {tiers.map((t) => (
            <button
              key={t.id}
              onClick={() => setSel(t.id)}
              className={`rounded-2xl border-2 p-3 text-left transition ${
                sel === t.id ? "border-primary bg-surface shadow-glow" : "border-transparent bg-surface shadow-soft"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t.name}</p>
              <p className="mt-1 font-serif text-lg leading-tight">
                {t.price === 0 ? "Offert" : `${t.price} €`}
              </p>
              <p className="mt-0.5 text-[10px] text-primary">{t.sold}/{t.stock}</p>
            </button>
          ))}
        </section>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-1 shadow-card">
          <div className="rounded-[22px] bg-background p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Memento Live · Billet</p>
                <p className="mt-2 font-serif text-2xl leading-tight">Sarah & Thomas</p>
                <p className="text-xs text-muted-foreground">Château de Vaux · 12 sept. 2026</p>
              </div>
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-foreground">
                <QrCode className="h-14 w-14 text-background" />
              </div>
            </div>
            <div className="my-4 flex items-center gap-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="h-px flex-1 bg-border" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Nom</p>
                <p className="font-semibold">Camille D.</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Formule</p>
                <p className="font-semibold">{active.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Table</p>
                <p className="font-semibold">Pivoine · 4</p>
              </div>
            </div>
          </div>
          <div className="absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute right-0 top-1/2 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{active.name}</span>
            <span className="text-xs text-muted-foreground">{active.sold} / {active.stock}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream">
            <div className="h-full bg-gradient-to-r from-primary to-gold" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{active.note}</p>
        </section>

        <section className="rounded-3xl bg-cream p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-dark">
            <Sparkles className="h-4 w-4" /> Zéro flux financier chez Memento
          </div>
          <ul className="mt-3 space-y-2 text-xs">
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> Paiements optionnels redirigés vers Lydia, Leetchi ou HelloAsso.</li>
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> QR codes nominatifs, non-transférables, invalidables en un tap.</li>
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> Scanner d'accueil compatible mode hors-ligne.</li>
          </ul>
        </section>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background">
          <Ticket className="h-4 w-4" /> Envoyer les billets aux invités
        </button>
      </main>
    </div>
  );
}
