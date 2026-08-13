import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Heart, Cake, Baby, Gift, GraduationCap, Sparkles, Camera, Bell, Users, Check } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Bienvenue · MaFeliza" },
      { name: "description", content: "Personnalisez votre expérience MaFeliza en quelques secondes." },
      { property: "og:title", content: "Bienvenue sur MaFeliza" },
      { property: "og:description", content: "Créez votre premier événement inoubliable." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
          { property: "og:url", content: "https://event.bold-lab-agency.com/onboarding" },
],
    links: [{ rel: "canonical", href: "https://event.bold-lab-agency.com/onboarding" }],
  }),
});

const eventTypes = [
  { icon: Heart, label: "Mariage" },
  { icon: Baby, label: "Baptême" },
  { icon: Cake, label: "Anniversaire" },
  { icon: Gift, label: "Baby Shower" },
  { icon: GraduationCap, label: "Diplôme" },
  { icon: Sparkles, label: "Autre" },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [notifs, setNotifs] = useState(true);

  const totalSteps = 4;
  const canNext = step === 0 ? name.trim().length > 1 : step === 1 ? selected.length > 0 : true;

  function toggle(label: string) {
    setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  }

  function next() {
    if (step < totalSteps - 1) setStep(step + 1);
    else navigate({ to: "/app" });
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-warm opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />

      <header className="relative flex items-center justify-between px-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6">
        <Link to="/">
          <Logo />
        </Link>
        <Link
          to="/app"
          className="rounded-full bg-surface/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground ring-1 ring-border/70 transition-colors hover:text-foreground"
        >
          Passer
        </Link>
      </header>

      <div className="relative mx-auto mt-5 w-full max-w-md px-6">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i < step ? "bg-primary/50" : i === step ? "bg-gradient-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Étape {step + 1} / {totalSteps}
        </p>
      </div>

      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="rounded-[32px] border border-border/60 bg-surface/85 p-6 shadow-modal backdrop-blur-xl sm:p-8">
        {step === 0 && (
          <section>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Étape 1 · Vous</p>
            <h1 className="mt-2 font-serif text-3xl leading-tight">Comment devons-nous vous appeler&nbsp;?</h1>
            <p className="mt-2 text-sm text-muted-foreground">Votre prénom sera visible par vos invités uniquement.</p>
            <label className="mt-6 block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Prénom</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Camille"
                autoFocus
                className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-lg outline-none transition-colors focus:border-primary focus:bg-surface"
              />
            </label>
            <div className="mt-4 space-y-2 rounded-2xl border border-border/60 bg-secondary/40 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Espace 100 % privé, sur invitation</p>
              <p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Modifiable à tout moment dans votre profil</p>
            </div>
          </section>
        )}


        {step === 1 && (
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Étape 2 · Vos envies</p>
            <h1 className="mt-2 font-serif text-3xl leading-tight">Quels événements vous inspirent&nbsp;?</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sélectionnez-en autant que vous voulez.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {eventTypes.map((t) => {
                const Icon = t.icon;
                const active = selected.includes(t.label);
                return (
                  <button
                    key={t.label}
                    onClick={() => toggle(t.label)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full ${
                        active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-sm font-medium">{t.label}</span>
                    {active && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Étape 3 · Notifications</p>
            <h1 className="mt-2 font-serif text-3xl leading-tight">Ne manquez plus rien</h1>
            <p className="mt-2 text-sm text-muted-foreground">Recevez les moments clés en direct : lives, nouveaux messages, mises à jour de cagnotte.</p>
            <button
              onClick={() => setNotifs((v) => !v)}
              className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">Notifications push</p>
                <p className="text-xs text-muted-foreground">Nous ne vous spammerons jamais.</p>
              </div>
              <span
                className={`relative h-7 w-12 rounded-full transition-colors ${notifs ? "bg-primary" : "bg-border"}`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                    notifs ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
            <div className="mt-3 space-y-2 rounded-2xl border border-border/60 bg-secondary/40 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Camera className="h-3.5 w-3.5 text-primary" /> Nouvelles photos publiées</p>
              <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary" /> Un proche rejoint votre événement</p>
              <p className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-primary" /> Messages ajoutés au livre d'or</p>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-glow">
              <Sparkles className="h-9 w-9" />
            </div>
            <h1 className="mt-6 font-serif text-3xl leading-tight">
              Enchanté{name ? `, ${name}` : ""}&nbsp;!
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Votre espace MaFeliza est prêt. Créez votre premier événement en quelques secondes ou explorez les inspirations de la communauté.
            </p>
            <div className="mt-8 space-y-2">
              <Link
                to="/app/create"
                className="block w-full rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground"
              >
                Créer mon premier événement
              </Link>
              <Link
                to="/app/explore"
                className="block w-full rounded-full border border-border py-4 text-sm font-semibold"
              >
                Explorer d'abord
              </Link>
            </div>
          </section>
        )}
        </div>
      </main>

      {step < 3 && (
        <footer className="relative sticky bottom-0 border-t border-border/60 bg-background/85 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-md items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-border"
                aria-label="Précédent"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={next}
              disabled={!canNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Continuer <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
