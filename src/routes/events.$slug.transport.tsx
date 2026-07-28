import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bus, Car, MapPin, Clock, Users } from "lucide-react";

export const Route = createFileRoute("/events/$slug/transport")({
  component: Transport,
  head: () => ({
    meta: [
      { title: "Navettes & transport · Memento Live" },
      { name: "description", content: "Coordonnez les navettes, covoiturages et taxis de vos invités." },
      { property: "og:title", content: "Navettes & transport · Memento Live" },
      { property: "og:description", content: "Personne ne rentre à pied. Personne ne se perd." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const shuttles = [
  { l: "Gare Lyon Part-Dieu → Château", h: "15:30", seats: "48 / 50", driver: "Michel · Autocars Rhône", status: "Confirmé" },
  { l: "Hôtel Ibis → Château", h: "16:15", seats: "22 / 30", driver: "Sophie · VTC Signature", status: "Confirmé" },
  { l: "Château → Hôtels (fin de soirée)", h: "02:00", seats: "62 / 80", driver: "3 véhicules · Rotation", status: "En attente" },
  { l: "Château → Brunch dimanche", h: "11:00", seats: "34 / 50", driver: "Michel · Autocars Rhône", status: "Confirmé" },
];

const carpools = [
  { driver: "Léa & Thomas", from: "Paris", seats: "3 / 4", contact: "06 12 34 56 78" },
  { driver: "Famille Bernard", from: "Marseille", seats: "1 / 5", contact: "06 98 76 54 32" },
  { driver: "Julien", from: "Genève", seats: "2 / 3", contact: "06 45 67 89 01" },
];

function Transport() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Navettes & transport</h1>
            <p className="text-xs text-muted-foreground">4 navettes · 3 covoiturages actifs</p>
          </div>
          <Bus className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">Vue d'ensemble</p>
          <h2 className="mt-2 font-display text-2xl">166 invités · 4 rotations planifiées</h2>
          <p className="mt-2 text-sm opacity-90">Aucun invité ne rentre au volant. Chauffeurs pros identifiés, plaques enregistrées, contact 24/7.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Navettes officielles</h3>
          <div className="space-y-3">
            {shuttles.map((s) => (
              <div key={s.l} className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{s.l}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.h}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{s.seats}</span>
                      <span>{s.driver}</span>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${s.status === "Confirmé" ? "bg-primary/10 text-primary" : "bg-gold/20 text-foreground"}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Covoiturages invités</h3>
          <div className="space-y-3">
            {carpools.map((c) => (
              <div key={c.driver} className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-cream p-2"><Car className="h-4 w-4 text-primary" /></div>
                  <div className="flex-1">
                    <p className="font-medium">{c.driver}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />Depuis {c.from} · {c.seats} places</p>
                  </div>
                  <button className="rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary">Contacter</button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-full border border-dashed border-primary/50 py-3 text-sm text-primary">+ Proposer un covoiturage</button>
        </section>
      </main>
    </div>
  );
}
