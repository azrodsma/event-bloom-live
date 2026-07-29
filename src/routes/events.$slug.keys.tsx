import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, DoorOpen, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/keys")({
  component: Keys,
  head: () => ({
    meta: [
      { title: "Trousseau · Memento Live" },
      { name: "description", content: "Toutes les clés, badges et codes en un seul trousseau numérique." },
      { property: "og:title", content: "Trousseau · Memento Live" },
      { property: "og:description", content: "Aucune porte fermée le jour J." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const keys = [
  { l: "Grand portail", type: "Digicode", code: "•• •• ••", holder: "MC · Wedding planner", color: "from-primary to-primary-dark" },
  { l: "Salle de réception", type: "Clé physique + double", holder: "Coordinatrice", color: "from-foreground to-primary-dark" },
  { l: "Suite nuptiale", type: "Badge NFC", holder: "Léa & Thomas", color: "from-gold to-primary" },
  { l: "Local traiteur", type: "Cadenas 4 chiffres", holder: "Chef Bruno", color: "from-primary-dark to-foreground" },
  { l: "Régie son & lumière", type: "Trousseau régisseur", holder: "DJ Milan", color: "from-primary to-gold" },
];

function Keys() {
  const { slug } = useParams({ from: "/events/$slug/keys" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Trousseau</p>
          <p className="text-xs text-muted-foreground">5 accès · remise J-1 · 18h</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <KeyRound className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Aucune porte fermée le jour J</p>
          <p className="mt-2 text-sm opacity-90">
            Codes chiffrés, badges numériques et clés physiques : tout est tracé jusqu'à la restitution J+1.
          </p>
        </section>

        <section className="space-y-2">
          {keys.map((k) => (
            <article key={k.l} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${k.color} p-4 text-white shadow-soft`}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/20">
                  <DoorOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg leading-tight">{k.l}</p>
                  <p className="text-[11px] opacity-85">{k.type}</p>
                </div>
                <span className="rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-semibold">{k.holder}</span>
              </div>
              {k.code && (
                <div className="mt-3 rounded-xl bg-white/20 px-3 py-2 text-center font-mono text-sm tracking-widest">
                  {k.code}
                  <button className="ml-2 text-[10px] font-semibold underline">Révéler</button>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Journal de remise
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3 w-3" /> Digicode → MC · 13 juin 14h32</li>
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3 w-3" /> Régie → DJ Milan · 13 juin 16h05</li>
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3 w-3" /> Suite → Léa · 13 juin 18h20</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
