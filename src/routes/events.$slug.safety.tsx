import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Users, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/events/$slug/safety")({
  component: Safety,
  head: () => ({
    meta: [
      { title: "Sécurité & premiers secours · MaFeliza" },
      { name: "description", content: "Points de secours, référents SST, numéros d'urgence et plan d'évacuation." },
      { property: "og:title", content: "Sécurité · MaFeliza" },
      { property: "og:description", content: "La fête, en confiance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const referents = [
  { name: "Dr. Amélie R.", role: "Médecin invitée", cert: "Urgentiste", where: "Table Pivoine", color: "from-destructive to-primary" },
  { name: "Karim B.", role: "Référent SST", cert: "Secouriste PSC1", where: "Bar principal", color: "from-primary to-primary-dark" },
  { name: "Manuel (agent)", role: "Sécurité", cert: "SIA · CSSIAP", where: "Portail entrée", color: "from-foreground to-primary-dark" },
];

const kits = [
  { l: "Trousse premiers soins", loc: "Vestiaire" },
  { l: "Défibrillateur (DAE)", loc: "Hall accueil" },
  { l: "Extincteur × 4", loc: "Points signalés" },
  { l: "Kit bris de verre", loc: "Cuisine" },
];

function Safety() {
  const { slug } = useParams({ from: "/events/$slug/safety" });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Sécurité</p>
          <p className="text-xs text-muted-foreground">Plan d'urgence · référents sur place</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <ShieldCheck className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">La fête, en confiance</p>
          <p className="mt-2 text-sm opacity-90">
            Trois référents identifiés, un plan d'évacuation testé et un point de rassemblement clair.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-2">
          {[
            { l: "SAMU", n: "15", tone: "bg-destructive text-white" },
            { l: "Pompiers", n: "18", tone: "bg-primary text-white" },
            { l: "Police", n: "17", tone: "bg-foreground text-background" },
            { l: "Européen", n: "112", tone: "bg-gold text-foreground" },
          ].map((u) => (
            <a key={u.l} href={`tel:${u.n}`} className={`flex items-center justify-between rounded-2xl p-4 shadow-soft ${u.tone}`}>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-80">{u.l}</p>
                <p className="font-serif text-3xl leading-none">{u.n}</p>
              </div>
              <Phone className="h-5 w-5" />
            </a>
          ))}
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Référents sur place</p>
          <div className="space-y-2">
            {referents.map((r) => (
              <article key={r.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${r.color} font-bold text-white`}>
                  {r.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{r.role} · {r.cert}</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-[11px] text-primary-dark">
                    <MapPin className="h-3 w-3" /> {r.where}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Équipements localisés</p>
          <div className="grid grid-cols-2 gap-2">
            {kits.map((k) => (
              <div key={k.l} className="rounded-2xl bg-cream p-3">
                <p className="text-sm font-semibold">{k.l}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {k.loc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Point de rassemblement
          </div>
          <p className="mt-2 font-serif text-lg leading-tight">Parking sud · sous l'arche pierre</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Signalisation lumineuse et brief oral fait par le MC dès l'arrivée en salle.
          </p>
        </section>
      </main>
    </div>
  );
}
