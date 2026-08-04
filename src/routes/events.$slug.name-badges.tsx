import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Printer, Palette, Search, Check, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/name-badges")({
  component: NameBadges,
  head: () => ({
    meta: [
      { title: "Badges nominatifs · MaFeliza" },
      { name: "description", content: "Créez et imprimez des étiquettes élégantes pour chaque invité, avec table, régime et rôle." },
      { property: "og:title", content: "Badges nominatifs · MaFeliza" },
      { property: "og:description", content: "Chaque invité, reconnu au premier regard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Badge = {
  id: string;
  first: string;
  last: string;
  table: string;
  role: string;
  diet?: string;
};

const initial: Badge[] = [
  { id: "b1", first: "Camille", last: "Durand", table: "Table 1 · Roses", role: "Témoin", diet: "Végétarien" },
  { id: "b2", first: "Antoine", last: "Bernard", table: "Table 2 · Pivoines", role: "Famille" },
  { id: "b3", first: "Léa", last: "Moreau", table: "Table 3 · Jasmin", role: "Amie", diet: "Sans gluten" },
  { id: "b4", first: "Julien", last: "Petit", table: "Table 1 · Roses", role: "Témoin" },
  { id: "b5", first: "Sophie", last: "Laurent", table: "Table 4 · Lilas", role: "Collègue" },
  { id: "b6", first: "Marc", last: "Fontaine", table: "Table 5 · Muguet", role: "Famille", diet: "Halal" },
  { id: "b7", first: "Élise", last: "Vidal", table: "Table 2 · Pivoines", role: "Amie" },
  { id: "b8", first: "Nicolas", last: "Roche", table: "Table 6 · Iris", role: "Cousin" },
];

const themes = [
  { id: "gold", label: "Doré", bg: "bg-cream", border: "border-gold", accent: "text-gold" },
  { id: "rose", label: "Rose", bg: "bg-primary-light", border: "border-primary/40", accent: "text-primary" },
  { id: "noir", label: "Noir", bg: "bg-foreground", border: "border-foreground", accent: "text-gold" },
] as const;

function NameBadges() {
  const { slug } = useParams({ from: "/events/$slug/name-badges" });
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState<(typeof themes)[number]["id"]>("gold");
  const [selected, setSelected] = useState<Set<string>>(new Set(initial.map((b) => b.id)));
  const active = themes.find((t) => t.id === theme)!;
  const filtered = useMemo(
    () => initial.filter((b) => (b.first + " " + b.last + " " + b.table).toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-serif text-lg leading-tight">Badges nominatifs</p>
            <p className="text-xs text-muted-foreground">{selected.size} sélectionnés · {initial.length} invités</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow">
          <Printer className="h-4 w-4" /> Imprimer PDF
        </button>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-surface p-4 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Palette className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Thème d'impression</p>
          </div>
          <div className="flex gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex-1 rounded-2xl border-2 px-3 py-3 text-sm font-medium transition ${
                  theme === t.id ? "border-primary bg-primary-light" : "border-border bg-background"
                }`}
              >
                <span className={`mx-auto mb-1 block h-6 w-6 rounded-full ${t.bg} border ${t.border}`} />
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un invité, une table…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((b) => {
            const on = selected.has(b.id);
            const dark = theme === "noir";
            return (
              <button
                key={b.id}
                onClick={() => toggle(b.id)}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition ${
                  on ? "border-primary shadow-glow" : "border-border opacity-70"
                } ${active.bg} ${dark ? "text-white" : "text-foreground"}`}
              >
                <div className={`absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full ${on ? "bg-primary text-white" : "bg-background/60"}`}>
                  {on && <Check className="h-3.5 w-3.5" />}
                </div>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${active.accent}`}>MaFeliza · {b.role}</p>
                <p className="mt-2 font-serif text-2xl leading-tight">{b.first}</p>
                <p className="font-serif text-lg opacity-90">{b.last}</p>
                <div className={`my-3 h-px w-10 ${dark ? "bg-gold" : "bg-foreground/30"}`} />
                <p className="text-xs opacity-80">{b.table}</p>
                {b.diet && (
                  <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${dark ? "bg-white/10 text-white" : "bg-background/70"}`}>
                    <Sparkles className="h-3 w-3" /> {b.diet}
                  </span>
                )}
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
}
