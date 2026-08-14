import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, FileText, Cookie, UserCheck, Scale, Mail, ChevronRight, Download, Lock } from "lucide-react";

export const Route = createFileRoute("/legal")({
  component: Legal,
  head: () => ({
    meta: [
      { title: "Centre légal · MaFeliza" },
      { name: "description", content: "Conditions générales, politique de confidentialité, gestion des cookies et mentions légales de MaFeliza." },
      { property: "og:title", content: "Centre légal · MaFeliza" },
      { property: "og:description", content: "Toutes les informations légales de MaFeliza." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
          { property: "og:url", content: "https://event.bold-lab-agency.com/legal" },
],
    links: [{ rel: "canonical", href: "https://event.bold-lab-agency.com/legal" }],
  }),
});

const docs = [
  { icon: FileText, title: "Conditions générales", desc: "Vos droits et obligations en utilisant MaFeliza", updated: "12 mars 2026", href: "#cgu" },
  { icon: Lock, title: "Politique de confidentialité", desc: "Comment nous traitons vos données personnelles", updated: "12 mars 2026", href: "#privacy" },
  { icon: Cookie, title: "Cookies", desc: "Cookies techniques et analytiques utilisés", updated: "01 février 2026", href: "#cookies" },
  { icon: Scale, title: "Mentions légales", desc: "Éditeur, hébergeur, propriété intellectuelle", updated: "01 janvier 2026", href: "#mentions" },
  { icon: UserCheck, title: "Charte communautaire", desc: "Règles de respect pour un espace bienveillant", updated: "15 novembre 2025", href: "#charte" },
];

const rights = [
  { title: "Accès", desc: "Consultez toutes vos données stockées" },
  { title: "Rectification", desc: "Corrigez vos informations à tout moment" },
  { title: "Effacement", desc: "Supprimez votre compte et vos contenus" },
  { title: "Portabilité", desc: "Exportez vos souvenirs en un clic" },
  { title: "Opposition", desc: "Refusez certains traitements" },
  { title: "Limitation", desc: "Restreignez l'usage de vos données" },
];

function Legal() {
  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app/settings" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Centre légal</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-8 pt-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-serif text-3xl leading-tight">Votre confiance,<br />notre engagement</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          MaFeliza est conçu autour du respect de votre vie privée. Vos souvenirs vous appartiennent.
        </p>
      </section>

      <section className="px-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documents officiels</p>
        <ul className="space-y-2">
          {docs.map((d) => {
            const Icon = d.icon;
            return (
              <li key={d.title}>
                <a
                  href={d.href}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{d.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{d.desc}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      Mise à jour {d.updated}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Nos engagements clés</p>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Vos données ne sont jamais vendues, jamais louées.",
              "L'argent des cagnottes ne transite pas par nos serveurs.",
              "Vos souvenirs sont chiffrés et hébergés en Europe (Paris).",
              "Vous pouvez tout supprimer à tout moment, sans justification.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <ShieldCheck className="h-3 w-3" />
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 px-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vos droits (RGPD)</p>
        <div className="grid grid-cols-2 gap-2.5">
          {rights.map((r) => (
            <div key={r.title} className="rounded-2xl bg-card p-3 ring-1 ring-border/60">
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-semibold text-background">
          <Download className="h-4 w-4" /> Télécharger toutes mes données
        </button>
      </section>

      <section className="mt-8 px-4">
        <div className="rounded-3xl bg-secondary/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Délégué à la protection des données</p>
          <p className="mt-2 font-serif text-lg">Une question sur vos données ?</p>
          <p className="mt-1 text-[12px] text-muted-foreground">Notre DPO vous répond sous 5 jours ouvrés.</p>
          <a
            href="mailto:dpo@memento.live"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-xs font-semibold ring-1 ring-border"
          >
            <Mail className="h-3.5 w-3.5" /> dpo@memento.live
          </a>
        </div>
      </section>

      <p className="mt-10 px-4 text-center text-[11px] text-muted-foreground">
        MaFeliza SAS · RCS Paris 984 621 730 · Siège : 12 rue de la Roquette, 75011 Paris
      </p>
    </div>
  );
}
