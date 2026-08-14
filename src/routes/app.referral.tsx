import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gift, Copy, Share2, Check, Sparkles, Users, Crown, Star, TrendingUp, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/referral")({
  component: Referral,
  head: () => ({
    meta: [
      { title: "Parrainez MaFeliza · Un mois offert" },
      { name: "description", content: "Invitez vos proches à découvrir MaFeliza et recevez un mois Premium offert à chaque inscription." },
      { property: "og:title", content: "Parrainez MaFeliza · Un mois offert" },
      { property: "og:description", content: "Un mois Premium offert par filleul." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const tiers = [
  { min: 0, label: "Ami·e", color: "from-secondary to-secondary", perk: "1 mois Premium par filleul" },
  { min: 3, label: "Ambassadeur", color: "from-primary/40 to-primary/20", perk: "+ Badge exclusif profil" },
  { min: 5, label: "Étoile", color: "from-amber-400/60 to-amber-300/40", perk: "+ Livre photo offert" },
  { min: 10, label: "Légende", color: "from-fuchsia-500/50 to-primary/40", perk: "+ Abonnement à vie" },
];

const invited = [
  { name: "Léa Duval", avatar: "https://i.pravatar.cc/64?img=44", status: "active", reward: "1 mois +" },
  { name: "Antoine Karim", avatar: "https://i.pravatar.cc/64?img=13", status: "active", reward: "1 mois +" },
  { name: "Camille Roux", avatar: "https://i.pravatar.cc/64?img=32", status: "active", reward: "1 mois +" },
  { name: "Julien Meunier", avatar: "https://i.pravatar.cc/64?img=12", status: "pending", reward: "En attente" },
  { name: "Nadia Ozil", avatar: "https://i.pravatar.cc/64?img=45", status: "pending", reward: "En attente" },
];

function Referral() {
  const code = "SARAH-2026";
  const link = `memento.live/r/${code}`;
  const [copied, setCopied] = useState(false);
  const active = invited.filter((i) => i.status === "active").length;
  const total = invited.length;
  const currentTier = [...tiers].reverse().find((t) => active >= t.min) || tiers[0];
  const nextTier = tiers.find((t) => t.min > active);
  const progressPct = nextTier ? Math.min(100, (active / nextTier.min) * 100) : 100;

  function copy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app/settings" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Parrainage</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden px-6 pb-8 pt-10 text-center"
        style={{ background: "linear-gradient(160deg, #FFF8F4 0%, #FFE4EE 55%, #FFD9C4 100%)" }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-accent/50 blur-3xl" />
        <div className="relative">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-glow">
            <Gift className="h-8 w-8" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-primary">Programme fidélité</p>
          <h1 className="mt-1 font-serif text-4xl leading-tight">Offrez MaFeliza,<br />recevez Premium</h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-foreground/70">
            Un mois Premium offert dès que votre filleul crée son premier événement.
          </p>
        </div>
      </section>

      <section className="mx-4 -mt-6 rounded-3xl border border-border/60 bg-card p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Votre code personnel</p>
        <button
          onClick={copy}
          className="mt-2 flex w-full items-center justify-between rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-4 text-left"
        >
          <div>
            <p className="font-mono text-2xl font-bold tracking-widest text-primary">{code}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{link}</p>
          </div>
          <span className={`grid h-10 w-10 place-items-center rounded-full ${copied ? "bg-primary text-primary-foreground" : "bg-background text-primary"}`}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </span>
        </button>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { icon: MessageCircle, label: "SMS" },
            { icon: Mail, label: "Email" },
            { icon: Share2, label: "Partager" },
            { icon: Copy, label: copied ? "Copié" : "Copier" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.label} onClick={s.label === "Copier" || s.label === "Copié" ? copy : undefined} className="flex flex-col items-center gap-1 rounded-2xl bg-secondary/60 py-2.5 text-[10px] font-semibold">
                <Icon className="h-4 w-4 text-primary" />
                {s.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className={`mx-4 mt-6 overflow-hidden rounded-3xl bg-gradient-to-br ${currentTier.color} p-5`}>
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70 backdrop-blur">
            <Crown className="h-6 w-6 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Niveau actuel</p>
            <p className="font-serif text-2xl leading-tight">{currentTier.label}</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl leading-none">{active}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Filleuls actifs</p>
          </div>
        </div>
        {nextTier && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold">
              <span>{currentTier.label}</span>
              <span className="opacity-70">Prochain : {nextTier.label}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/60">
              <div className="h-full rounded-full bg-foreground/80 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-2 text-[11px] font-medium">
              Plus que {nextTier.min - active} filleul{nextTier.min - active > 1 ? "s" : ""} pour débloquer <span className="font-bold">{nextTier.perk}</span>
            </p>
          </div>
        )}
      </section>

      <section className="px-4 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paliers de récompenses</p>
        <ul className="mt-3 space-y-2">
          {tiers.map((t, i) => {
            const unlocked = active >= t.min;
            const current = t.label === currentTier.label;
            return (
              <li
                key={t.label}
                className={`flex items-center gap-3 rounded-2xl p-3.5 ring-1 ${
                  current ? "bg-primary/5 ring-primary/40" : unlocked ? "bg-card ring-border/60" : "bg-background ring-border/40 opacity-60"
                }`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${t.color}`}>
                  {unlocked ? <Star className="h-5 w-5" /> : <span className="font-serif text-sm">{i + 1}</span>}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{t.label}</p>
                    {current && (
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">Actuel</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t.perk}</p>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{t.min}+</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 pt-6">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vos filleuls</p>
          <span className="text-[11px] font-medium text-muted-foreground">{active}/{total} actifs</span>
        </div>
        <ul className="mt-3 space-y-2">
          {invited.map((i) => (
            <li key={i.name} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <img src={i.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{i.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {i.status === "active" ? "Compte activé · récompense créditée" : "Invitation envoyée"}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  i.status === "active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                {i.status === "active" ? <TrendingUp className="h-2.5 w-2.5" /> : null}
                {i.reward}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-secondary/60 p-5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-wider">Comment ça marche</p>
        </div>
        <ol className="mt-3 space-y-3">
          {[
            "Partagez votre code personnel avec vos proches",
            "Ils créent leur compte et leur premier événement",
            "Vous recevez 1 mois Premium (eux aussi)",
          ].map((step, idx) => (
            <li key={step} className="flex items-start gap-3 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-6 flex items-center justify-center gap-1.5 px-6 text-center text-[10px] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary" />
        Programme sans limite · récompenses cumulables jusqu'à Premium à vie
      </p>
    </div>
  );
}
