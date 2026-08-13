import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, Lock, Eye, Server } from "lucide-react";

export const Route = createFileRoute("/app/security")({
  component: Security,
  head: () => ({
    meta: [
      { title: "Sécurité · MaFeliza" },
      { name: "description", content: "Chiffrement, souveraineté et transparence de la plateforme." },
      { property: "og:title", content: "Sécurité · MaFeliza" },
      { property: "og:description", content: "Vos souvenirs sont sacrés. Notre stack aussi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const pillars = [
  { icon: Lock, l: "Chiffrement bout en bout", d: "AES-256 au repos, TLS 1.3 en transit. Clés rotatives 90 jours." },
  { icon: Server, l: "Hébergement UE souverain", d: "OVHcloud Gravelines (France) & Frankfurt. Aucun transfert extra-UE." },
  { icon: Eye, l: "Zéro traçage tiers", d: "Pas de Google Analytics, pas de Meta Pixel. Analytics maison anonyme." },
  { icon: Shield, l: "Bug bounty permanent", d: "YesWeHack · récompenses jusqu'à 8 000 € pour les vulnérabilités critiques." },
];

const audits = [
  { l: "ISO 27001", date: "Certifié · Mars 2026", by: "Bureau Veritas" },
  { l: "SecNumCloud (en cours)", date: "Audit ANSSI Q4 2026", by: "ANSSI" },
  { l: "Pentest annuel", date: "Rapport Nov 2026", by: "Synacktiv" },
  { l: "HDS santé (option)", date: "Certifié · Juin 2026", by: "AFNOR" },
];

function Security() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Sécurité</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Transparence continue</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Shield className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <p className="text-xs uppercase tracking-widest opacity-70">Notre engagement</p>
          <h2 className="mt-2 font-display text-2xl">Vos souvenirs sont sacrés. Notre stack aussi.</h2>
          <p className="mt-2 text-sm opacity-90">Souveraineté française · chiffrement systématique · audits indépendants publiés chaque année.</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.l} className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30">
              <div className="rounded-full bg-primary/10 p-2 w-fit"><p.icon className="h-4 w-4 text-primary" /></div>
              <p className="mt-2 font-display text-lg">{p.l}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Certifications & audits</h3>
          <div className="space-y-3">
            {audits.map((a) => (
              <div key={a.l} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{a.l}</p>
                  <p className="text-xs text-muted-foreground">{a.by}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary whitespace-nowrap">{a.date}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[26px] bg-gradient-mesh p-6 shadow-card ring-1 ring-border/60">
          <p className="font-display text-lg">Trust Center</p>
          <p className="text-xs text-muted-foreground mt-1">Rapports d'incidents, uptime temps réel, sous-traitants, PIA RGPD.</p>
          <button className="mt-3 rounded-full bg-foreground px-5 py-2.5 text-sm text-white">Consulter</button>
        </section>
      </main>
    </div>
  );
}
