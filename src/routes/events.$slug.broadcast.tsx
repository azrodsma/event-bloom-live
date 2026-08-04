import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, Mail, MessageSquare, Bell } from "lucide-react";

export const Route = createFileRoute("/events/$slug/broadcast")({
  component: Broadcast,
  head: () => ({
    meta: [
      { title: "Messages groupés · MaFeliza" },
      { name: "description", content: "Communications ciblées à vos invités : email, SMS, push." },
      { property: "og:title", content: "Broadcast · MaFeliza" },
      { property: "og:description", content: "Le bon message, au bon moment, au bon groupe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const campaigns = [
  { l: "Rappel J-30", channel: "Email + Push", audience: "Tous confirmés (166)", status: "Envoyé", open: "92%" },
  { l: "Infos parking & navettes", channel: "SMS", audience: "Invités hors région (78)", status: "Programmé J-7", open: "—" },
  { l: "Playlist collaborative", channel: "Push", audience: "Invités app installée (124)", status: "Envoyé", open: "78%" },
  { l: "Météo & tenue", channel: "Email", audience: "Tous confirmés (166)", status: "Brouillon", open: "—" },
  { l: "Remerciements post-fête", channel: "Email", audience: "Tous présents", status: "Programmé J+3", open: "—" },
];

const channels = [
  { icon: Mail, l: "Email", n: "166 adresses" },
  { icon: MessageSquare, l: "SMS", n: "158 numéros" },
  { icon: Bell, l: "Push app", n: "124 installations" },
];

function Broadcast() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Messages groupés</h1>
            <p className="text-xs text-muted-foreground">5 campagnes · segmentation avancée</p>
          </div>
          <Send className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="grid grid-cols-3 gap-3">
          {channels.map((c) => (
            <div key={c.l} className="rounded-2xl border border-border/50 bg-card p-4 text-center">
              <c.icon className="h-5 w-5 text-primary mx-auto" />
              <p className="mt-2 font-medium text-sm">{c.l}</p>
              <p className="text-xs text-muted-foreground">{c.n}</p>
            </div>
          ))}
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Campagnes</h3>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.l} className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{c.l}</p>
                    <p className="text-xs text-muted-foreground">{c.channel} · {c.audience}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${c.status === "Envoyé" ? "bg-primary/10 text-primary" : c.status.startsWith("Programmé") ? "bg-gold/20 text-foreground" : "bg-cream text-muted-foreground"}`}>{c.status}</span>
                </div>
                {c.open !== "—" && (
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Taux d'ouverture</span>
                    <span className="font-medium text-primary">{c.open}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <button className="w-full rounded-full bg-foreground py-3 text-sm text-white">+ Nouvelle campagne</button>
      </main>
    </div>
  );
}
