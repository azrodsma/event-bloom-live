import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Fingerprint, Key, Smartphone, Eye, EyeOff, Bell, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/security")({
  component: Security,
  head: () => ({
    meta: [
      { title: "Sécurité du compte · Memento Live" },
      { name: "description", content: "Protégez vos souvenirs : mot de passe, biométrie, appareils connectés, sessions actives." },
      { property: "og:title", content: "Sécurité · Memento Live" },
      { property: "og:description", content: "Vos souvenirs, sous double protection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Security() {
  const [twofa, setTwofa] = useState(true);
  const [bio, setBio] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Sécurité</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-accent/30 to-background px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-emerald-700" /> Score de protection
        </div>
        <div className="mt-3 flex items-end gap-3">
          <p className="font-serif text-5xl leading-none text-emerald-700">92</p>
          <p className="pb-1 text-xs text-muted-foreground">/100 · Excellent</p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: "92%" }} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Reste : activer les codes de secours pour atteindre 100.
        </p>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Authentification</h2>
        <ul className="space-y-2">
          {[
            { icon: Key, label: "Mot de passe", value: "Modifié il y a 2 mois", action: "Modifier" },
            { icon: Fingerprint, label: "Biométrie · Face ID", value: bio ? "Actif" : "Désactivé", toggle: bio, set: setBio },
            { icon: Smartphone, label: "Double authentification", value: twofa ? "SMS + App" : "Désactivé", toggle: twofa, set: setTwofa },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.label} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[14px] leading-tight">{r.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{r.value}</p>
                </div>
                {"toggle" in r ? (
                  <button
                    onClick={() => r.set!(!r.toggle)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${r.toggle ? "bg-primary" : "bg-border"}`}
                    aria-label={r.label}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${r.toggle ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                ) : (
                  <button className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold">
                    {r.action}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confidentialité</h2>
        <ul className="space-y-2">
          {[
            { icon: EyeOff, label: "Mode privé global", value: "Masque profils publics, désactive les liens de partage.", toggle: privateMode, set: setPrivateMode },
            { icon: Bell, label: "Alertes de connexion", value: "Notification lors d'une connexion inhabituelle.", toggle: alerts, set: setAlerts },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.label} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[14px] leading-tight">{r.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{r.value}</p>
                </div>
                <button
                  onClick={() => r.set(!r.toggle)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${r.toggle ? "bg-primary" : "bg-border"}`}
                  aria-label={r.label}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${r.toggle ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Appareils connectés · 3</h2>
        <ul className="space-y-2">
          {[
            { name: "iPhone 15 · Sarah", city: "Paris · maintenant", current: true },
            { name: "MacBook Pro", city: "Paris · il y a 2h" },
            { name: "iPad · Salon", city: "Paris · il y a 3j" },
          ].map((d) => (
            <li key={d.name} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
                <Smartphone className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-serif text-[14px] leading-tight">
                  {d.name}
                  {d.current && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                      Actuel
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{d.city}</p>
              </div>
              {!d.current && (
                <button className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary">
                  Déconnecter
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-6 rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Codes de secours</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          En cas de perte d'appareil, ces 8 codes vous permettent de récupérer votre compte. À imprimer.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {["A4F9-2K7L", "M2N7-4X8P", "R9T3-6L2Q", "B5V1-8W3E", "C7H4-9J6D", "S3P8-2A5U", "N6M9-4B7C", "K1L5-3F9G"].map((c) => (
            <span
              key={c}
              className={`rounded-lg border border-border/60 bg-background py-2 text-center font-mono text-[11px] tracking-wider ${
                showKey ? "" : "blur-sm select-none"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
        <button
          onClick={() => setShowKey((v) => !v)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground py-2 text-xs font-bold text-background"
        >
          {showKey ? <><EyeOff className="h-3.5 w-3.5" /> Masquer</> : <><Eye className="h-3.5 w-3.5" /> Révéler & imprimer</>}
        </button>
      </section>

      <button className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-full border border-rose-200 bg-rose-50 py-3 text-xs font-bold text-rose-700">
        Déconnecter toutes les sessions
      </button>
    </div>
  );
}
