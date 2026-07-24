import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Clock, MapPin, Music, Utensils, Camera, Sparkles, Heart, GlassWater, PartyPopper } from "lucide-react";
import { useState } from "react";
import { mockEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/events/$slug/timeline")({
  component: Timeline,
  head: () => ({
    meta: [
      { title: "Programme de la journée · Memento Live" },
      { name: "description", content: "Suivez le déroulé complet de l'événement, minute par minute." },
      { property: "og:title", content: "Programme · Memento Live" },
      { property: "og:description", content: "Le déroulé de la journée en un coup d'œil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Icon = "heart" | "glass" | "music" | "food" | "camera" | "sparkle" | "party" | "pin";

interface Step {
  id: string;
  time: string;
  title: string;
  desc?: string;
  place?: string;
  icon: Icon;
  highlight?: boolean;
}

const iconMap: Record<Icon, typeof Heart> = {
  heart: Heart, glass: GlassWater, music: Music, food: Utensils, camera: Camera, sparkle: Sparkles, party: PartyPopper, pin: MapPin,
};

const defaultSteps: Step[] = [
  { id: "s1", time: "14:30", title: "Accueil des invités", desc: "Cocktail de bienvenue au jardin", place: "Château de Villandry", icon: "glass" },
  { id: "s2", time: "15:30", title: "Cérémonie laïque", desc: "Échange des vœux et des alliances", place: "Chapelle extérieure", icon: "heart", highlight: true },
  { id: "s3", time: "17:00", title: "Séance photos", desc: "Photos de groupe puis couple", place: "Roseraie", icon: "camera" },
  { id: "s4", time: "19:00", title: "Vin d'honneur", desc: "Champagne, canapés et discours", icon: "sparkle" },
  { id: "s5", time: "20:30", title: "Dîner de gala", desc: "Menu 5 services orchestré par le Chef Léon", place: "Grande salle", icon: "food" },
  { id: "s6", time: "23:00", title: "Ouverture du bal", desc: "Première danse", icon: "music", highlight: true },
  { id: "s7", time: "23:30", title: "DJ set & photobooth", desc: "Piste de danse et souvenirs déjantés", icon: "party" },
  { id: "s8", time: "02:00", title: "Soupe à l'oignon", desc: "Le clap de fin gourmand", icon: "food" },
];

function Timeline() {
  const { slug } = useParams({ from: "/events/$slug/timeline" });
  const event = mockEvents.find((e) => e.slug === slug) ?? mockEvents[0];
  const [steps, setSteps] = useState<Step[]>(defaultSteps);

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { id: `s${Date.now()}`, time: "—:—", title: "Nouveau moment", desc: "À personnaliser", icon: "sparkle" },
    ]);
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Programme</p>
        <button onClick={addStep} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Ajouter un moment">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/60 to-background p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Déroulé de la journée</p>
          <h1 className="mt-1 font-serif text-2xl leading-tight">{event.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {event.venue} · {event.city}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1"><Clock className="h-3.5 w-3.5" /> {steps.length} moments</span>
            <span className="text-muted-foreground">Modifiable à tout moment</span>
          </div>
        </div>

        <ol className="relative mt-8 space-y-4 pl-6">
          <span aria-hidden className="absolute left-2 top-2 bottom-2 w-px bg-border" />
          {steps.map((step) => {
            const Icon = iconMap[step.icon];
            return (
              <li key={step.id} className="relative">
                <span
                  className={`absolute -left-[18px] top-4 grid h-6 w-6 place-items-center rounded-full border-2 ${
                    step.highlight ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                </span>
                <div className={`rounded-2xl border p-4 ${step.highlight ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card"}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-mono text-sm font-semibold tracking-wide text-primary">{step.time}</p>
                    <button className="text-xs text-muted-foreground hover:text-foreground">Modifier</button>
                  </div>
                  <h3 className="mt-1 font-serif text-lg">{step.title}</h3>
                  {step.desc && <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>}
                  {step.place && (
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {step.place}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <button onClick={addStep} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary">
          <Plus className="h-4 w-4" /> Ajouter un moment
        </button>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Le programme est visible par tous les invités depuis la page de l'événement.
        </p>
      </div>
    </div>
  );
}
