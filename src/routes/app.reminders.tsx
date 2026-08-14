import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, Sparkles, Heart, Camera, Users, Cake, Rocket } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/reminders")({
  component: Reminders,
  head: () => ({
    meta: [
      { title: "Rappels doux · MaFeliza" },
      { name: "description", content: "Des notifications bienveillantes qui vous rappellent les gestes importants au bon moment." },
      { property: "og:title", content: "Rappels doux · MaFeliza" },
      { property: "og:description", content: "Ne rien oublier, sans stress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Reminder = {
  id: string;
  title: string;
  hint: string;
  when: string;
  category: "souvenir" | "logistique" | "cœur" | "social";
  icon: typeof Bell;
  active: boolean;
  channel: "push" | "email" | "sms";
};

const initial: Reminder[] = [
  { id: "r1", title: "Prendre une photo du matin", hint: "Un cliché rituel — pyjama, café, sourire.", when: "Chaque matin · 8h30", category: "souvenir", icon: Camera, active: true, channel: "push" },
  { id: "r2", title: "Un mot doux à votre moitié", hint: "Envoyez une pensée ou un souvenir partagé.", when: "Mardi & Vendredi · 20h", category: "cœur", icon: Heart, active: true, channel: "push" },
  { id: "r3", title: "Relancer les invités sans réponse", hint: "12 invitations en attente depuis 10 jours.", when: "J-45 · dimanche 18h", category: "social", icon: Users, active: true, channel: "email" },
  { id: "r4", title: "Confirmer le gâteau final", hint: "Après la dégustation du 1 mars.", when: "J-30 · 10h", category: "logistique", icon: Cake, active: false, channel: "push" },
  { id: "r5", title: "Préparer le sac du jour J", hint: "Alliances, discours, chargeur, mouchoirs.", when: "J-2 · 20h", category: "logistique", icon: Rocket, active: true, channel: "sms" },
  { id: "r6", title: "Écrire 3 gratitudes du soir", hint: "Un rituel pour ancrer les belles choses.", when: "Chaque soir · 22h", category: "cœur", icon: Sparkles, active: true, channel: "push" },
];

const catTint = {
  souvenir: "bg-primary/10 text-primary",
  logistique: "bg-amber-50 text-amber-700",
  cœur: "bg-rose-50 text-rose-700",
  social: "bg-sky-50 text-sky-700",
} as const;

const catLabel = { souvenir: "Souvenir", logistique: "Logistique", cœur: "Cœur", social: "Social" } as const;

function Reminders() {
  const [items, setItems] = useState(initial);
  const activeCount = items.filter((i) => i.active).length;

  const toggle = (id: string) =>
    setItems((p) => p.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Rappels doux</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Bell className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/30 to-background px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Bienveillance active
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Ne rien oublier,<br />sans stress</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Chaque rappel a été pensé pour renforcer les liens et alléger la charge mentale de l'organisation.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none text-primary">{activeCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Actifs</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">7j</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Prochaine vague</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">Douce</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tonalité</p>
          </div>
        </div>
      </section>

      <ul className="space-y-2 px-4 pt-4">
        {items.map((r) => {
          const Icon = r.icon;
          return (
            <li key={r.id} className={`rounded-2xl border p-3 transition ${r.active ? "border-border/60 bg-card" : "border-border/40 bg-secondary/40 opacity-70"}`}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/40">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif text-[15px] leading-tight">{r.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${catTint[r.category]}`}>
                      {catLabel[r.category]}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted-foreground">{r.hint}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">{r.when}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold uppercase">{r.channel}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggle(r.id)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${r.active ? "bg-primary" : "bg-border"}`}
                  aria-label={r.active ? "Désactiver" : "Activer"}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${r.active ? "left-[22px]" : "left-0.5"}`}
                  />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Tonalité IA</p>
        <p className="mt-2 font-serif text-lg leading-tight">Comment devons-nous vous parler ?</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Sélectionnez le ton — MaFeliza adaptera chaque message.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["Douce", "Complice", "Poétique"].map((t, i) => (
            <button
              key={t}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${i === 0 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
