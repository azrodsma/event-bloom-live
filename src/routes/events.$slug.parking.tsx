import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ParkingSquare, Zap, Accessibility, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/events/$slug/parking")({
  component: Parking,
  head: () => ({
    meta: [
      { title: "Parking & voiturier · MaFeliza" },
      { name: "description", content: "Plan du parking, voiturier et bornes de recharge pour vos invités." },
      { property: "og:title", content: "Parking & voiturier · MaFeliza" },
      { property: "og:description", content: "Un stationnement fluide dès l'arrivée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const zones = [
  { l: "Zone A · VIP & mariés", spots: "12 places", icon: ShieldCheck, note: "Réservées famille proche" },
  { l: "Zone B · Invités", spots: "80 places", icon: ParkingSquare, note: "Sol gravier · Éclairage LED" },
  { l: "Zone C · PMR", spots: "6 places", icon: Accessibility, note: "Accès plain-pied cérémonie" },
  { l: "Zone D · Bornes recharge", spots: "4 bornes 22 kW", icon: Zap, note: "Type 2 · Gratuit invités" },
];

function Parking() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Parking & voiturier</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">102 places · voiturier 16h → 02h</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <ParkingSquare className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-gold/20 to-cream p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Voiturier premium</p>
          <h2 className="mt-2 font-display text-2xl">Service assuré par Prestige Valet</h2>
          <p className="mt-2 text-sm text-muted-foreground">4 voituriers en livrée · Clés stockées dans coffre verrouillé · Assurance tous risques incluse.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/70 p-3">
              <p className="text-xs text-muted-foreground">Coût total</p>
              <p className="font-display text-xl">640 €</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-3">
              <p className="text-xs text-muted-foreground">Ticket invité</p>
              <p className="font-display text-xl">Gratuit</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Zones de stationnement</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {zones.map((z) => (
              <div key={z.l} className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2"><z.icon className="h-4 w-4 text-primary" /></div>
                  <p className="font-medium text-sm">{z.l}</p>
                </div>
                <p className="mt-2 text-sm">{z.spots}</p>
                <p className="text-xs text-muted-foreground">{z.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-4">
          <p className="font-medium">Plan interactif</p>
          <p className="text-xs text-muted-foreground">QR code envoyé aux invités 48h avant · Waze & Google Maps synchronisés.</p>
          <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-cream to-white flex items-center justify-center text-sm text-muted-foreground">
            [ Plan du parking · Château de Villette ]
          </div>
        </section>
      </main>
    </div>
  );
}
