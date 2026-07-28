import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Cake, Sparkles, Flame, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/cake")({
  component: CakeDesigner,
  head: () => ({
    meta: [
      { title: "Pièce montée · Memento Live" },
      { name: "description", content: "Composez votre gâteau : étages, parfums, décor et cérémonie de la découpe." },
      { property: "og:title", content: "Pièce montée · Memento Live" },
      { property: "og:description", content: "Le dessert qui fait rêver." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const flavors = [
  { id: "f1", name: "Vanille & framboise", emoji: "🍓", note: "Biscuit vanille · confit framboise · crémeux mascarpone" },
  { id: "f2", name: "Chocolat noir & noisette", emoji: "🍫", note: "Biscuit chocolat · praliné noisette · ganache 70%" },
  { id: "f3", name: "Citron & basilic", emoji: "🍋", note: "Sablé breton · lemon curd · chantilly basilic" },
  { id: "f4", name: "Pistache & rose", emoji: "🌹", note: "Biscuit pistache · gelée de rose · crémeux vanille" },
];

const decors = ["Fleurs fraîches", "Feuilles d'or", "Meringues nuage", "Cascade de fruits", "Rubans satin"];

function CakeDesigner() {
  const { slug } = useParams({ from: "/events/$slug/cake" });
  const [tiers, setTiers] = useState(3);
  const [flavor, setFlavor] = useState("f1");
  const [decor, setDecor] = useState<string[]>(["Fleurs fraîches", "Feuilles d'or"]);

  const servings = tiers === 2 ? 40 : tiers === 3 ? 80 : tiers === 4 ? 130 : 200;
  const price = tiers * 320 + decor.length * 45;
  const toggle = (d: string) =>
    setDecor((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]));

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Pièce montée</p>
          <p className="text-xs text-muted-foreground">{servings} parts · ~{price} €</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/10 to-gold/20 p-6 shadow-card">
          <div className="mx-auto flex flex-col items-center gap-1">
            {Array.from({ length: tiers }).map((_, i) => {
              const w = 240 - i * 50;
              const h = 42;
              return (
                <div
                  key={i}
                  className="relative rounded-t-lg bg-gradient-to-b from-white via-cream to-white shadow-soft"
                  style={{ width: w, height: h }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-lg bg-primary/70" />
                  {i === 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">🌸</div>
                  )}
                </div>
              );
            })}
            <div className="mt-3 h-3 w-64 rounded-full bg-gold/60 shadow-inner" />
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Étages</p>
            <span className="font-serif text-2xl">{tiers}</span>
          </div>
          <input
            type="range"
            min={2}
            max={5}
            value={tiers}
            onChange={(e) => setTiers(Number(e.target.value))}
            className="mt-3 w-full accent-primary"
          />
          <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Intime · 2</span>
            <span>Grandiose · 5</span>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parfum principal</p>
          <div className="grid grid-cols-2 gap-2">
            {flavors.map((f) => (
              <button
                key={f.id}
                onClick={() => setFlavor(f.id)}
                className={`rounded-2xl border-2 p-3 text-left transition ${
                  flavor === f.id ? "border-primary bg-surface shadow-glow" : "border-border bg-surface"
                }`}
              >
                <div className="text-2xl">{f.emoji}</div>
                <p className="mt-2 text-sm font-semibold">{f.name}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{f.note}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Décor · {decor.length} choisis
          </p>
          <div className="flex flex-wrap gap-2">
            {decors.map((d) => {
              const on = decor.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => toggle(d)}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    on ? "bg-primary text-white" : "bg-surface text-muted-foreground shadow-soft"
                  }`}
                >
                  {on && "✓ "}{d}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-5 text-white shadow-card">
          <Flame className="h-5 w-5" />
          <p className="mt-2 font-serif text-lg leading-tight">Cérémonie de la découpe</p>
          <p className="mt-1 text-sm opacity-90">
            Prévue à 22h30, sous 3 feux de bengale. La coupe est diffusée en live pour les absents.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">
              <Sparkles className="mr-1 inline h-3 w-3" /> Feu de bengale
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">
              <Users className="mr-1 inline h-3 w-3" /> Photographe positionné
            </span>
          </div>
        </section>

        <div className="flex items-center justify-between rounded-3xl bg-surface p-4 shadow-soft">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Estimation</p>
            <p className="font-serif text-3xl">{price} €</p>
            <p className="text-xs text-muted-foreground">TTC · pâtissier local</p>
          </div>
          <button className="flex items-center gap-1 rounded-full bg-foreground px-5 py-3 text-xs font-semibold text-background">
            <Cake className="h-3.5 w-3.5" /> Envoyer au pâtissier
          </button>
        </div>
      </main>
    </div>
  );
}
