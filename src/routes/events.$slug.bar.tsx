import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Wine, Sparkles, Plus, Minus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/bar")({
  component: BarConfig,
  head: () => ({
    meta: [
      { title: "Bar & cocktails · MaFeliza" },
      { name: "description", content: "Composez votre carte de bar : cocktails signature, softs et estimation des quantités." },
      { property: "og:title", content: "Bar & cocktails · MaFeliza" },
      { property: "og:description", content: "La carte parfaite pour vos invités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Drink = { id: string; name: string; type: "Signature" | "Vin" | "Bière" | "Soft"; note: string; emoji: string };

const catalog: Drink[] = [
  { id: "d1", name: "Rose Spritz", type: "Signature", note: "Prosecco · litchi · rose", emoji: "🌸" },
  { id: "d2", name: "Bordeaux Old-Fashioned", type: "Signature", note: "Bourbon · sirop de figue", emoji: "🥃" },
  { id: "d3", name: "Sauvignon blanc", type: "Vin", note: "Loire · frais et vif", emoji: "🥂" },
  { id: "d4", name: "Saint-Émilion", type: "Vin", note: "Rouge · corsé", emoji: "🍷" },
  { id: "d5", name: "IPA locale", type: "Bière", note: "Brasserie Bordeaux", emoji: "🍺" },
  { id: "d6", name: "Virgin Rose", type: "Soft", note: "Pamplemousse · rose · tonic", emoji: "🍹" },
  { id: "d7", name: "Limonade artisanale", type: "Soft", note: "Citron · basilic", emoji: "🍋" },
];

function BarConfig() {
  const { slug } = useParams({ from: "/events/$slug/bar" });
  const guests = 120;
  const [qty, setQty] = useState<Record<string, number>>({ d1: 90, d3: 60, d4: 60, d6: 40 });

  const total = Object.values(qty).reduce((a, b) => a + b, 0);
  const coverage = Math.min(100, Math.round((total / (guests * 3)) * 100));

  const inc = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) + delta) }));

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <p className="font-serif text-lg leading-tight">Bar & cocktails</p>
          <p className="text-xs text-muted-foreground">{guests} invités · 3 verres/pers.</p>
        </div>
        <Wine className="h-5 w-5 text-primary" />
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-5 text-white shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">Couverture estimée</p>
              <p className="font-serif text-4xl">{coverage}%</p>
              <p className="text-xs opacity-90">{total} verres prévus sur {guests * 3}</p>
            </div>
            <Sparkles className="h-8 w-8 opacity-80" />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${coverage}%` }} />
          </div>
        </section>

        {(["Signature", "Vin", "Bière", "Soft"] as const).map((cat) => (
          <section key={cat}>
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat}</p>
            <div className="space-y-2">
              {catalog.filter((d) => d.type === cat).map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-cream text-2xl">{d.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold">{d.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{d.note}</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-cream p-1">
                    <button onClick={() => inc(d.id, -10)} className="grid h-7 w-7 place-items-center rounded-full bg-surface">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums">{qty[d.id] || 0}</span>
                    <button onClick={() => inc(d.id, 10)} className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <button className="w-full rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background">
          Envoyer la carte au traiteur
        </button>
      </main>
    </div>
  );
}
