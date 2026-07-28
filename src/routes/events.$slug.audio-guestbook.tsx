import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mic2, Play } from "lucide-react";

export const Route = createFileRoute("/events/$slug/audio-guestbook")({
  component: AudioGuestbook,
  head: () => ({
    meta: [
      { title: "Livre d'or vocal · Memento Live" },
      { name: "description", content: "Un téléphone vintage, des voix qui restent pour toujours." },
      { property: "og:title", content: "Livre d'or vocal · Memento Live" },
      { property: "og:description", content: "Combiné bakélite années 60, 214 messages déjà déposés." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const msgs = [
  { a: "Grand-mère Louise", d: "02:14", n: "Bénédiction émue en occitan" },
  { a: "Théo (5 ans)", d: "00:38", n: "Chanson inventée pour tata Léa" },
  { a: "Julien & Marie", d: "01:47", n: "Anecdote du voyage à Kyoto" },
  { a: "Papa Bernard", d: "03:22", n: "Larmes contenues, mots choisis" },
  { a: "Coloc' de fac", d: "02:55", n: "Fou rire sur la nuit du 14 juillet 2018" },
  { a: "Sarah (témoin)", d: "01:12", n: "Message secret réservé à J+1 an" },
];

function AudioGuestbook() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Livre d'or vocal</h1>
            <p className="text-xs text-muted-foreground">Téléphone bakélite · 214 messages</p>
          </div>
          <Mic2 className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <h2 className="font-display text-3xl leading-tight">Décrochez, laissez un message, raccrochez.</h2>
          <p className="mt-3 text-sm opacity-90">Un téléphone bakélite orange installé au bar. Le combiné a été rebranché sur un enregistreur haute fidélité. Chaque appel est masterisé et livré en album vinyle 33 tours.</p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div><p className="font-display text-2xl">214</p><p className="text-[10px] opacity-70">messages</p></div>
            <div><p className="font-display text-2xl">7h12</p><p className="text-[10px] opacity-70">durée totale</p></div>
            <div><p className="font-display text-2xl">1</p><p className="text-[10px] opacity-70">vinyle offert</p></div>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Derniers messages</h3>
          <div className="space-y-2">
            {msgs.map((m) => (
              <div key={m.a} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-3">
                <button className="rounded-full bg-primary/10 p-3">
                  <Play className="h-4 w-4 text-primary fill-primary" />
                </button>
                <div className="flex-1">
                  <p className="font-medium text-sm">{m.a}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.n}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{m.d}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Livraison vinyle</p>
          <p className="text-xs text-muted-foreground mt-1">Pressage 180g à Colmar (Studio Delta) · pochette illustrée par Gaëlle Duplessis · livraison J+90.</p>
        </div>
      </main>
    </div>
  );
}
