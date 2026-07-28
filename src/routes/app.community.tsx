import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, MessageCircle, Heart } from "lucide-react";

export const Route = createFileRoute("/app/community")({
  component: Community,
  head: () => ({
    meta: [
      { title: "Communauté · Memento Live" },
      { name: "description", content: "Échangez avec d'autres organisateurs passionnés." },
      { property: "og:title", content: "Communauté · Memento Live" },
      { property: "og:description", content: "Le cercle bienveillant de ceux qui préparent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const circles = [
  { l: "Mariages 2026", members: 3241, active: 128, color: "from-primary to-primary-dark" },
  { l: "Cérémonies laïques", members: 892, active: 41, color: "from-gold to-primary" },
  { l: "Baptêmes et naissances", members: 1156, active: 62, color: "from-primary-dark to-foreground" },
  { l: "DIY et écoresponsable", members: 2078, active: 94, color: "from-foreground to-primary-dark" },
];

const posts = [
  { author: "Camille · mariée juin 26", msg: "Quel photographe pour un mariage intime en Bretagne ? Budget 2 000€.", likes: 24, replies: 18, tag: "Prestataires" },
  { author: "Adèle · organisatrice", msg: "Astuce plan de table : j'ai codé chaque nappe par couleur, plus jamais de casse-tête !", likes: 87, replies: 32, tag: "Astuces" },
  { author: "Théo · marié en 3 mois", msg: "Retour d'expérience : préparer un mariage express en 90j, c'est possible.", likes: 156, replies: 41, tag: "Témoignage" },
];

function Community() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Communauté</p>
          <p className="text-xs text-muted-foreground">Cercles bienveillants d'organisateurs</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary/25 via-cream to-gold/25 p-6 shadow-card">
          <Users className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">On prépare mieux à plusieurs</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Rejoignez des cercles thématiques modérés. Charte anti-jugement, entraide vraie, pas de démarchage prestataires.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vos cercles</p>
          <div className="grid grid-cols-2 gap-2">
            {circles.map((c) => (
              <article key={c.l} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${c.color} p-4 text-white shadow-soft`}>
                <p className="font-serif text-lg leading-tight">{c.l}</p>
                <p className="mt-2 text-[11px] opacity-90">{c.members.toLocaleString("fr")} membres</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  {c.active} en ligne
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MessageCircle className="h-3.5 w-3.5" /> Discussions du jour
          </p>
          <div className="space-y-2">
            {posts.map((p) => (
              <article key={p.msg} className="rounded-2xl bg-surface p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold">{p.author}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-dark">{p.tag}</span>
                </div>
                <p className="mt-2 text-sm text-foreground">{p.msg}</p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {p.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {p.replies}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <button className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background">Ouvrir une discussion</button>
      </main>
    </div>
  );
}
