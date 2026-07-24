import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Lock,
  Globe,
  CreditCard,
  HelpCircle,
  Palette,
  LogOut,
  Trash2,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Paramètres — Memento Live" },
      { name: "description", content: "Gérez votre compte, notifications et confidentialité." },
    ],
  }),
  component: Settings,
});

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-primary" : "bg-muted"
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Settings() {
  const [prefs, setPrefs] = useState({
    notifLive: true,
    notifGuestbook: true,
    notifPot: false,
    darkMode: false,
    publicProfile: true,
    marketing: false,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link to="/app/profile" className="grid h-10 w-10 place-items-center rounded-full bg-surface" aria-label="Retour">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-xl leading-tight">Paramètres</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-4">
        {/* Profil */}
        <section className="flex items-center gap-4 rounded-3xl bg-surface p-4 shadow-card">
          <img src="https://i.pravatar.cc/150?img=32" alt="" className="h-14 w-14 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg">Sarah Laurent</p>
            <p className="truncate text-xs text-muted-foreground">sarah.laurent@example.com</p>
          </div>
          <button className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold">Modifier</button>
        </section>

        {/* Abonnement */}
        <section className="overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-cream to-primary-light p-5 shadow-card">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="h-4 w-4" fill="currentColor" />
            <p className="text-xs font-semibold uppercase tracking-wider">Formule Souvenir</p>
          </div>
          <p className="mt-2 font-serif text-2xl">Passez à Premium</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Livre d'or illimité, live 4K, albums haute définition et export souvenir.
          </p>
          <Link
            to="/app/premium"
            className="mt-4 block w-full rounded-full bg-gradient-primary py-3 text-center text-sm font-semibold text-white shadow-glow"
          >
            Découvrir Premium
          </Link>
        </section>

        {/* Notifications */}
        <Group title="Notifications" icon={Bell}>
          <Row label="Alerte live" desc="Recevez une notif quand un événement passe en direct">
            <Toggle on={prefs.notifLive} onToggle={() => toggle("notifLive")} />
          </Row>
          <Row label="Livre d'or" desc="Nouveaux messages, réactions et vocaux">
            <Toggle on={prefs.notifGuestbook} onToggle={() => toggle("notifGuestbook")} />
          </Row>
          <Row label="Cagnotte" desc="Jalons atteints (50%, 75%, objectif)">
            <Toggle on={prefs.notifPot} onToggle={() => toggle("notifPot")} />
          </Row>
        </Group>

        {/* Confidentialité */}
        <Group title="Confidentialité" icon={Lock}>
          <Row label="Profil public" desc="Visible par les autres invités">
            <Toggle on={prefs.publicProfile} onToggle={() => toggle("publicProfile")} />
          </Row>
          <NavRow icon={Shield} label="Sécurité & 2FA" hint="Activé" />
          <NavRow icon={Globe} label="Langue" hint="Français" />
        </Group>

        {/* Apparence */}
        <Group title="Apparence" icon={Palette}>
          <Row label="Mode sombre" desc="Réduit la luminosité pour les soirées">
            <Toggle on={prefs.darkMode} onToggle={() => toggle("darkMode")} />
          </Row>
          <Row label="Newsletter souvenirs" desc="Chaque mois, les plus beaux moments">
            <Toggle on={prefs.marketing} onToggle={() => toggle("marketing")} />
          </Row>
        </Group>

        {/* Facturation */}
        <Group title="Facturation" icon={CreditCard}>
          <NavRow icon={CreditCard} label="Moyens de paiement" hint="•••• 4242" />
          <NavRow icon={HelpCircle} label="Historique de facturation" />
        </Group>

        {/* Support */}
        <Group title="Aide" icon={HelpCircle}>
          <NavRow icon={HelpCircle} label="Centre d'aide" to="/app/help" />
          <NavRow icon={HelpCircle} label="Récompenses & badges" to="/app/achievements" />
          <NavRow icon={HelpCircle} label="Nous contacter" />
        </Group>


        {/* Danger zone */}
        <section className="space-y-2">
          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-danger">
            <LogOut className="h-4 w-4" /> Se déconnecter
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-danger/20 bg-danger/5 px-5 py-3 text-sm font-medium text-danger">
            <Trash2 className="h-4 w-4" /> Supprimer mon compte
          </button>
          <p className="pt-2 text-center text-[10px] text-muted-foreground">
            Memento Live · v1.0.0 · Réalisé avec ❤️ en France
          </p>
        </section>
      </main>
    </div>
  );
}

function Group({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Bell;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2 px-1">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      </div>
      <div className="divide-y divide-border/60 overflow-hidden rounded-3xl bg-surface shadow-card">
        {children}
      </div>
    </section>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-[11px] text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function NavRow({ icon: Icon, label, hint, to }: { icon: typeof Bell; label: string; hint?: string; to?: string }) {
  const content = (
    <>
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </>
  );
  const className = "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-cream";
  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }
  return <button className={className}>{content}</button>;
}
