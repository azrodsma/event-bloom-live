import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Clock, Sparkles, Coffee, Utensils, Music } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/after-party")({
  component: AfterParty,
  head: () => ({
    meta: [
      { title: "After-party · MaFeliza" },
      { name: "description", content: "Prolongez la fête : brunch du lendemain, karaoké, plage privée. Réservez votre place." },
      { property: "og:title", content: "After-party · MaFeliza" },
      { property: "og:description", content: "La fête continue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Event = { id: string; title: string; when: string; place: string; icon: typeof Coffee; note: string; going: number; cap: number; color: string };

const events: Event[] = [
  { id: "e1", title: "Brunch du lendemain", when: "Dim. 26 juil · 11h30", place: "Terrasse du château", icon: Coffee, note: "Buffet gourmand · mimosas · musique douce", going: 42, cap: 60, color: "from-gold to-primary" },
  { id: "e2", title: "Karaoké nuit blanche", when: "Sam. 25 juil · 02h00", place: "Salle des voûtes", icon: Music, note: "Playlist collaborative · bar ouvert", going: 28, cap: 40, color: "from-primary to-primary-dark" },
  { id: "e3", title: "Plage privée", when: "Dim. 26 juil · 15h00", place: "Lac du domaine", icon: Utensils, note: "Barbecue, transats et paddle", going: 18, cap: 35, color: "from-primary-dark to-gold" },
];

function AfterParty() {
  const { slug } = useParams({ from: "/events/$slug/after-party" });
  const [rsvp, setRsvp] = useState<Record<string, boolean>>({ e1: true });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">After-party</p>
          <p className="text-xs text-muted-foreground">3 moments prolongés</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Sparkles className="h-6 w-6" />
          <p className="mt-3 font-serif text-2xl leading-tight">La fête ne s'arrête pas au dessert</p>
          <p className="mt-2 text-sm opacity-90">
            Réservez votre place pour prolonger l'aventure avec les autres invités.
          </p>
        </section>

        <div className="space-y-3">
          {events.map((e) => {
            const going = rsvp[e.id];
            const count = e.going + (going ? 1 : 0);
            const pct = Math.min(100, (count / e.cap) * 100);
            const Icon = e.icon;
            return (
              <article key={e.id} className="overflow-hidden rounded-3xl bg-surface shadow-soft">
                <div className={`bg-gradient-to-br ${e.color} p-4 text-white`}>
                  <Icon className="h-6 w-6" />
                  <p className="mt-2 font-serif text-xl">{e.title}</p>
                  <p className="text-xs opacity-90">{e.note}</p>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1">
                      <Clock className="h-3 w-3" /> {e.when}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1">
                      <MapPin className="h-3 w-3" /> {e.place}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{count} / {e.cap} inscrits</span>
                      <span className="font-semibold">{e.cap - count} places</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => setRsvp((r) => ({ ...r, [e.id]: !r[e.id] }))}
                    className={`w-full rounded-full py-2.5 text-sm font-semibold transition ${
                      going ? "bg-success/15 text-success" : "bg-foreground text-background"
                    }`}
                  >
                    {going ? "✓ Je serai là" : "Réserver ma place"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
