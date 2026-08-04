import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

export const Route = createFileRoute("/app/notifications-settings")({
  component: NotificationsSettings,
  head: () => ({
    meta: [
      { title: "Notifications · MaFeliza" },
      { name: "description", content: "Choisissez exactement ce qui mérite votre attention." },
      { property: "og:title", content: "Notifications · MaFeliza" },
      { property: "og:description", content: "Le silence quand vous voulez." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const groups = [
  {
    title: "Événement",
    items: [
      { l: "Nouveaux RSVP", push: true, email: true, sms: false },
      { l: "Messages invités", push: true, email: false, sms: false },
      { l: "Souvenirs ajoutés", push: true, email: true, sms: false },
      { l: "Alertes prestataires", push: true, email: true, sms: true },
    ],
  },
  {
    title: "Communauté",
    items: [
      { l: "Mentions et tags", push: true, email: false, sms: false },
      { l: "Nouveaux abonnés", push: false, email: false, sms: false },
      { l: "Suggestions inspirations", push: false, email: true, sms: false },
    ],
  },
  {
    title: "Compte",
    items: [
      { l: "Connexions suspectes", push: true, email: true, sms: true },
      { l: "Facturation", push: false, email: true, sms: false },
      { l: "Mises à jour produit", push: false, email: true, sms: false },
    ],
  },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`inline-flex h-5 w-9 items-center rounded-full transition ${on ? "bg-primary" : "bg-border"}`}>
      <span className={`h-4 w-4 rounded-full bg-white shadow transition ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </span>
  );
}

function NotificationsSettings() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Notifications</p>
          <p className="text-xs text-muted-foreground">Ne manquez rien · sans être submergé</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <Bell className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le silence quand vous voulez</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Programmez un mode « Ne pas déranger » de 22h à 8h — les alertes critiques passent toujours.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Activer heures calmes</button>
        </section>

        {groups.map((g) => (
          <section key={g.title}>
            <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.title}</p>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-soft">
              <div className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-4 border-b border-border/60 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Type</span>
                <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" />Push</span>
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />Email</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />SMS</span>
              </div>
              {g.items.map((it) => (
                <div key={it.l} className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-4 border-b border-border/40 px-4 py-3 last:border-b-0">
                  <p className="text-sm">{it.l}</p>
                  <Toggle on={it.push} />
                  <Toggle on={it.email} />
                  <Toggle on={it.sms} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
