import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Puzzle, Check, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/app/integrations")({
  component: Integrations,
  head: () => ({
    meta: [
      { title: "Intégrations · Memento Live" },
      { name: "description", content: "Connectez Memento Live à vos outils : Google, Spotify, Notion et plus." },
      { property: "og:title", content: "Intégrations · Memento Live" },
      { property: "og:description", content: "Un événement branché à votre vie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cats = [
  {
    l: "Photos & médias",
    items: [
      { l: "Google Photos", d: "Import automatique des albums partagés", connected: true },
      { l: "iCloud photos", d: "Sync bibliothèque du couple", connected: true },
      { l: "Dropbox", d: "Backup RAW photographe", connected: false },
    ],
  },
  {
    l: "Musique",
    items: [
      { l: "Spotify", d: "Playlists collaboratives synchronisées", connected: true },
      { l: "Apple Music", d: "Import bibliothèque et créations", connected: false },
      { l: "Deezer", d: "Alternative française", connected: false },
    ],
  },
  {
    l: "Productivité",
    items: [
      { l: "Google Calendar", d: "Timeline exportée automatiquement", connected: true },
      { l: "Notion", d: "Sync checklist & fournisseurs", connected: false },
      { l: "Trello", d: "Board de suivi organisationnel", connected: false },
    ],
  },
  {
    l: "Live & streaming",
    items: [
      { l: "YouTube Live", d: "Diffusion cérémonie & discours", connected: true },
      { l: "Twitch", d: "Alternative streaming", connected: false },
      { l: "Zoom", d: "Invités distants en visio", connected: false },
    ],
  },
];

function Integrations() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Intégrations</h1>
            <p className="text-xs text-muted-foreground">12 outils · 5 connectés</p>
          </div>
          <Puzzle className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/15 to-cream p-6">
          <p className="text-xs uppercase tracking-widest text-primary">API ouverte</p>
          <h2 className="mt-2 font-display text-2xl">Votre événement parle à vos outils</h2>
          <p className="mt-2 text-sm text-muted-foreground">Webhooks, Zapier, Make · documentation développeur complète.</p>
          <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-sm text-white flex items-center gap-2">
            Docs API <ExternalLink className="h-3 w-3" />
          </button>
        </section>

        {cats.map((cat) => (
          <section key={cat.l}>
            <h3 className="font-display text-lg mb-3">{cat.l}</h3>
            <div className="space-y-2">
              {cat.items.map((it) => (
                <div key={it.l} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{it.l}</p>
                    <p className="text-xs text-muted-foreground">{it.d}</p>
                  </div>
                  {it.connected ? (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"><Check className="h-3 w-3" />Connecté</span>
                  ) : (
                    <button className="rounded-full border border-border px-3 py-1 text-xs">Connecter</button>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
