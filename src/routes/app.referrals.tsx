import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gift, Heart, Users, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/referrals")({
  component: Referrals,
  head: () => ({
    meta: [
      { title: "Parrainage · MaFeliza" },
      { name: "description", content: "Invitez vos proches à créer leur événement et recevez des étoiles MaFeliza." },
      { property: "og:title", content: "Parrainage · MaFeliza" },
      { property: "og:description", content: "Partagez la magie, gagnez des étoiles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const invited = [
  { name: "Camille D.", when: "Il y a 3 j", status: "Inscrite", stars: 50, avatar: "https://i.pravatar.cc/80?img=47" },
  { name: "Julien M.", when: "Il y a 6 j", status: "Événement créé", stars: 100, avatar: "https://i.pravatar.cc/80?img=12" },
  { name: "Amélie R.", when: "Il y a 2 sem.", status: "En attente", stars: 0, avatar: "https://i.pravatar.cc/80?img=32" },
];

function Referrals() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Parrainage</p>
          <p className="text-xs text-muted-foreground">Faites entrer vos proches</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Heart className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Offrez MaFeliza à vos proches</p>
          <p className="mt-2 text-sm opacity-90">
            +50 étoiles à l'inscription, +100 étoiles quand ils créent leur premier événement.
          </p>
          <div className="mt-5 rounded-2xl bg-white/15 p-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-widest opacity-80">Votre code</p>
            <p className="mt-0.5 font-mono text-xl font-bold tracking-widest">SARAH-ROSE</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="rounded-full bg-white/25 py-2.5 text-xs font-semibold backdrop-blur">Partager</button>
            <button className="rounded-full bg-white py-2.5 text-xs font-semibold text-primary">Copier le lien</button>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-surface p-4 text-center shadow-soft">
            <Users className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 font-serif text-2xl leading-none">7</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Invités</p>
          </div>
          <div className="rounded-2xl bg-surface p-4 text-center shadow-soft">
            <Sparkles className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-2 font-serif text-2xl leading-none">450</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Étoiles gagnées</p>
          </div>
          <div className="rounded-2xl bg-surface p-4 text-center shadow-soft">
            <Gift className="mx-auto h-5 w-5 text-primary-dark" />
            <p className="mt-2 font-serif text-2xl leading-none">2</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Récompenses</p>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Vos filleul·e·s
          </p>
          <div className="space-y-2">
            {invited.map((i) => (
              <div key={i.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft">
                <img src={i.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.when} · {i.status}</p>
                </div>
                {i.stars > 0 ? (
                  <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-bold text-gold">
                    +{i.stars} ★
                  </span>
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">Prochain palier</p>
          <p className="mt-1 font-serif text-lg leading-tight">
            10 filleul·e·s = 1 livre photo premium offert
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-primary" style={{ width: "70%" }} />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Plus que 3 filleul·e·s à inviter</p>
        </section>
      </main>
    </div>
  );
}
