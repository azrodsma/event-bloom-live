import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Church, MapPin } from "lucide-react";

export const Route = createFileRoute("/events/$slug/religious")({
  component: Religious,
  head: () => ({
    meta: [
      { title: "Cérémonie religieuse · Memento Live" },
      { name: "description", content: "Coordination avec l'officiant, préparation spirituelle et logistique." },
      { property: "og:title", content: "Cérémonie religieuse · Memento Live" },
      { property: "og:description", content: "Respecter le rite, préparer le cœur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  { d: "M-6", l: "Rencontre curé", ok: true, note: "Père Baptiste · Église Saint-Vincent · dossier canonique remis" },
  { d: "M-5", l: "Cours de préparation au mariage (CPM)", ok: true, note: "6 séances · groupe de 4 couples · vendredi soirs" },
  { d: "M-4", l: "Certificat de baptême · mariée", ok: true, note: "Reçu paroisse d'origine (Lille)" },
  { d: "M-4", l: "Certificat de baptême · marié", ok: false, note: "Relancer paroisse Nice avant 20 mai" },
  { d: "M-3", l: "Choix des lectures", ok: true, note: "1 Co 13 · Cantique 8 · Jean 15 · validées avec le curé" },
  { d: "M-2", l: "Choix des chants et musique", ok: true, note: "Chorale Sainte-Cécile + organiste titulaire" },
  { d: "M-1", l: "Répétition à l'église", ok: false, note: "Jeudi 4 juin 18h · témoins et enfants d'honneur convoqués" },
  { d: "J-1", l: "Confession", ok: false, note: "Facultative · disponible à 17h veille" },
];

function Religious() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Cérémonie religieuse</h1>
            <p className="text-xs text-muted-foreground">Église Saint-Vincent · 5 juin 15h00</p>
          </div>
          <Church className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-2xl leading-tight">Église Saint-Vincent</h2>
          <p className="mt-1 text-sm text-muted-foreground">12 rue de l'Église, 33350 Saint-Émilion · capacité 220 places · parking rue Guadet</p>
        </section>

        <section className="space-y-2">
          {steps.map((s) => (
            <div key={s.l} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-4">
              <span className="font-mono text-xs text-primary w-10">{s.d}</span>
              <div className="flex-1">
                <p className="font-medium text-sm flex items-center gap-2">
                  {s.l}
                  <span className={`text-[10px] rounded-full px-2 py-0.5 ${s.ok ? "bg-primary/10 text-primary" : "bg-gold/20 text-foreground"}`}>{s.ok ? "Fait" : "À faire"}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Offrande à la paroisse</p>
          <p className="text-xs text-muted-foreground mt-1">Suggérée 300–500 € · chèque ou espèces remis à la sacristie le jour J via un témoin.</p>
        </section>
      </main>
    </div>
  );
}
