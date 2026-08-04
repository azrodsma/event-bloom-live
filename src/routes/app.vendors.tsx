import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, MapPin, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { vendors, type Vendor } from "@/lib/vendors";

export const Route = createFileRoute("/app/vendors")({
  component: Vendors,
  head: () => ({
    meta: [
      { title: "Prestataires · MaFeliza" },
      { name: "description", content: "Découvrez photographes, DJs, traiteurs et lieux de réception recommandés par la communauté MaFeliza." },
      { property: "og:title", content: "Prestataires recommandés · MaFeliza" },
      { property: "og:description", content: "Les meilleurs prestataires événementiels sélectionnés." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const categories: Array<Vendor["category"] | "Tous"> = ["Tous", "Photographe", "DJ", "Traiteur", "Fleuriste", "Vidéaste", "Lieu"];

function Vendors() {
  const [category, setCategory] = useState<Vendor["category"] | "Tous">("Tous");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const okCat = category === "Tous" || v.category === category;
      const okQuery = !query.trim() || (v.name + v.city + v.tags.join(" ")).toLowerCase().includes(query.toLowerCase());
      return okCat && okQuery;
    });
  }, [category, query]);

  const featured = vendors.filter((v) => v.verified).slice(0, 3);

  return (
    <div className="pb-24">
      <section className="bg-gradient-to-b from-secondary/60 to-transparent px-4 pb-6 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Marketplace</p>
        <h1 className="mt-1 font-serif text-3xl leading-tight">Prestataires recommandés</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sélectionnés à la main, notés par les couples et familles MaFeliza.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-background px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom, ville, style…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <button className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background" aria-label="Filtres">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </section>

      <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              category === c
                ? "bg-foreground text-background"
                : "border border-border bg-background text-foreground hover:border-primary/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {category === "Tous" && !query && (
        <section className="px-4 pb-6">
          <h2 className="mb-3 font-serif text-lg">Coups de cœur de la semaine</h2>
          <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4">
            {featured.map((v) => (
              <Link
                key={v.id}
                to="/app/vendors/$id"
                params={{ id: v.id }}
                className="relative w-64 shrink-0 snap-start overflow-hidden rounded-3xl"
              >
                <img src={v.cover} alt={v.name} className="h-80 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] backdrop-blur">
                    <ShieldCheck className="h-3 w-3" /> Vérifié
                  </span>
                  <p className="mt-2 font-serif text-xl leading-tight">{v.name}</p>
                  <p className="text-xs opacity-90">{v.category} · {v.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="px-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">{filtered.length} prestataires</h2>
          <button className="text-xs text-muted-foreground">Trier par pertinence</button>
        </div>

        <ul className="space-y-3">
          {filtered.map((v) => (
            <li key={v.id}>
              <Link
                to="/app/vendors/$id"
                params={{ id: v.id }}
                className="flex gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-3 transition-colors hover:border-primary/40"
              >
                <img src={v.cover} alt={v.name} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{v.name}</p>
                    {v.verified && <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-label="Vérifié" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{v.category}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {v.city}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="font-medium">{v.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({v.reviews})</span>
                    </span>
                    <span className="text-xs font-semibold text-primary">{v.price}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              Aucun prestataire pour cette recherche.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
