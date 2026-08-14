import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Gift, Heart, ExternalLink, RefreshCw, Bookmark, Star, TrendingUp, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/gift-ideas")({
  component: GiftIdeas,
  head: () => ({
    meta: [
      { title: "Idées cadeaux personnalisées · MaFeliza" },
      { name: "description", content: "Suggestions cadeaux uniques générées selon l'événement, le lien avec la personne et votre budget." },
      { property: "og:title", content: "Idées cadeaux personnalisées · MaFeliza" },
      { property: "og:description", content: "Trouvez le cadeau parfait." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const eventOptions = [
  { id: "mariage", label: "Mariage", emoji: "💍" },
  { id: "bapteme", label: "Baptême", emoji: "🕊️" },
  { id: "anniv", label: "Anniversaire", emoji: "🎂" },
  { id: "cremaillere", label: "Crémaillère", emoji: "🏡" },
  { id: "retraite", label: "Retraite", emoji: "🌴" },
];

const linkOptions = [
  { id: "famille", label: "Famille proche" },
  { id: "amis", label: "Amis intimes" },
  { id: "collegues", label: "Collègues" },
  { id: "connaissance", label: "Connaissance" },
];

interface Idea {
  title: string;
  desc: string;
  price: number;
  category: string;
  tags: string[];
  match: number;
  emoji: string;
}

const ideas: Idea[] = [
  { title: "Coffret dégustation grands crus", desc: "Sélection de 3 vins d'exception avec cave d'accueil", price: 89, category: "Gourmet", tags: ["Duo", "Élégant"], match: 96, emoji: "🍷" },
  { title: "Week-end en cabane perchée", desc: "Nuit en pleine nature avec petit-déjeuner artisanal", price: 240, category: "Expérience", tags: ["Romantique", "Nature"], match: 94, emoji: "🌲" },
  { title: "Photobook MaFeliza personnalisé", desc: "Livre relié en cuir avec les meilleures photos", price: 65, category: "Souvenir", tags: ["Sentimental"], match: 92, emoji: "📖" },
  { title: "Machine à espresso Bellezza", desc: "Design italien, 15 bars, mousseur intégré", price: 320, category: "Maison", tags: ["Duo", "Pratique"], match: 88, emoji: "☕" },
  { title: "Séance photo de couple", desc: "2 h avec un photographe local, 30 photos retouchées", price: 190, category: "Expérience", tags: ["Romantique", "Souvenir"], match: 86, emoji: "📸" },
  { title: "Panier bio du terroir", desc: "12 produits artisanaux, livrés dans un panier osier", price: 55, category: "Gourmet", tags: ["Éthique"], match: 82, emoji: "🧺" },
];

function GiftIdeas() {
  const [eventType, setEventType] = useState("mariage");
  const [link, setLink] = useState("amis");
  const [budget, setBudget] = useState(150);
  const [saved, setSaved] = useState<Set<string>>(new Set(["Photobook MaFeliza personnalisé"]));

  const filtered = ideas.filter((i) => i.price <= budget * 2);

  function toggle(title: string) {
    setSaved((s) => {
      const next = new Set(s);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Boîte à idées</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Filtres">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Assistant cadeau IA
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Trouvez le cadeau<br />parfait</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Répondez à 3 questions, on vous propose des idées uniques adaptées à l'occasion.
        </p>
      </section>

      <section className="px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Occasion</p>
        <div className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {eventOptions.map((e) => {
            const active = eventType === e.id;
            return (
              <button
                key={e.id}
                onClick={() => setEventType(e.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium ${
                  active ? "border-foreground bg-foreground text-background" : "border-border bg-card"
                }`}
              >
                <span>{e.emoji}</span> {e.label}
              </button>
            );
          })}
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lien avec la personne</p>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {linkOptions.map((l) => {
            const active = link === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLink(l.id)}
                className={`rounded-2xl border px-3 py-2.5 text-xs font-medium ${
                  active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Budget</span>
          <span className="text-foreground">≈ {budget} €</span>
        </div>
        <input
          type="range"
          min={20}
          max={500}
          step={10}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Budget"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>20 €</span>
          <span>500 €</span>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> {filtered.length} idées pour vous
          </p>
          <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
            <RefreshCw className="h-3 w-3" /> Régénérer
          </button>
        </div>

        <ul className="space-y-2.5">
          {filtered.map((idea) => {
            const isSaved = saved.has(idea.title);
            return (
              <li key={idea.title} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary text-3xl">
                      {idea.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          {idea.category}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> {idea.match}%
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm font-semibold leading-tight">{idea.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{idea.desc}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {idea.tags.map((t) => (
                          <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(idea.title)}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                        isSaved ? "bg-primary text-primary-foreground" : "bg-secondary"
                      }`}
                      aria-label="Sauver l'idée"
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 bg-secondary/30 px-4 py-2.5">
                  <p className="font-serif text-lg">
                    {idea.price}<span className="text-xs text-muted-foreground"> €</span>
                  </p>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1.5 text-[11px] font-semibold ring-1 ring-border">
                      <Gift className="h-3 w-3" /> Offrir
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background">
                      Voir <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/30 p-5">
          <Heart className="h-6 w-6 text-primary" />
          <p className="mt-2 font-serif text-xl leading-tight">Offrir à plusieurs ?</p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Créez une cagnotte partagée avec Leetchi ou Lydia directement depuis l'événement.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background">
            Lancer une cagnotte groupée
          </button>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Vos idées sauvées · {saved.size}
        </p>
        {saved.size === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-6 text-center text-[11px] text-muted-foreground">
            Sauvez vos coups de cœur pour les retrouver ici.
          </div>
        ) : (
          <ul className="space-y-1.5">
            {Array.from(saved).map((title) => (
              <li key={title} className="flex items-center gap-2 rounded-2xl bg-secondary/60 px-3 py-2 text-xs">
                <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="truncate">{title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
