import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, Sparkles, Star, MapPin, MessageSquare, Award } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/officiants")({
  component: Officiants,
  head: () => ({
    meta: [
      { title: "Officiants de cérémonie · Memento Live" },
      { name: "description", content: "Trouvez l'officiant idéal pour votre cérémonie laïque : profils, styles, disponibilités." },
      { property: "og:title", content: "Officiants · Memento Live" },
      { property: "og:description", content: "L'orateur qui portera vos vœux." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Officiant = {
  id: string;
  name: string;
  headline: string;
  city: string;
  travel: string;
  rate: string;
  ceremonies: number;
  score: number;
  reviews: number;
  photo: string;
  styles: string[];
  languages: string[];
  quote: string;
  available: boolean;
};

const officiants: Officiant[] = [
  { id: "o1", name: "Camille Verdier", headline: "Écrivaine de vie · voix chaude", city: "Lyon", travel: "France entière", rate: "1 200 €", ceremonies: 84, score: 4.9, reviews: 62, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400", styles: ["Poétique", "Émotion douce", "Musical"], languages: ["FR", "EN"], quote: "Chaque cérémonie est un tissage d'histoires, jamais un modèle recopié.", available: true },
  { id: "o2", name: "Ismaël Ngo", headline: "Ancien acteur · rythme théâtral", city: "Paris", travel: "IDF + Europe", rate: "1 500 €", ceremonies: 61, score: 4.8, reviews: 44, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", styles: ["Théâtral", "Humoristique", "Anecdotes"], languages: ["FR", "EN", "ES"], quote: "Une cérémonie doit faire rire, pleurer, applaudir — parfois dans la même minute.", available: true },
  { id: "o3", name: "Sophie Alaoui", headline: "Approche interculturelle & rituels", city: "Marseille", travel: "PACA + Corse", rate: "980 €", ceremonies: 47, score: 5.0, reviews: 38, photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400", styles: ["Rituels", "Bilingue", "Spirituel"], languages: ["FR", "AR", "EN"], quote: "Je conçois des cérémonies qui honorent chaque tradition et invitent à en créer une nouvelle.", available: false },
  { id: "o4", name: "Julien Berard", headline: "Ex-journaliste · plume précise", city: "Bordeaux", travel: "Sud-Ouest", rate: "1 100 €", ceremonies: 52, score: 4.7, reviews: 41, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", styles: ["Élégant", "Concis", "Musical"], languages: ["FR", "EN"], quote: "Le mot juste, prononcé au bon moment, vaut mille effets.", available: true },
];

function Officiants() {
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set(["o1"]));
  const list = officiants.filter((o) =>
    !q.trim() ? true : (o.name + o.headline + o.city + o.styles.join(",")).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Officiants</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Award className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Cérémonies laïques
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">L'orateur<br />qui portera vos vœux</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Chaque profil est certifié Memento — écriture, style de voix, éthique.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ville, style, langue…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      <ul className="space-y-4 px-4 pt-6">
        {list.map((o) => {
          const on = saved.has(o.id);
          return (
            <li key={o.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="flex gap-3 p-4">
                <div className="relative shrink-0">
                  <img src={o.photo} alt={o.name} className="h-24 w-24 rounded-2xl object-cover" />
                  {!o.available && (
                    <span className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-black/60 py-0.5 text-center text-[9px] font-bold uppercase text-white">
                      Complet 2026
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-serif text-[16px] leading-tight">{o.name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{o.headline}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                      <Star className="h-3 w-3 fill-primary" /> {o.score.toFixed(1)}
                    </div>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {o.city} · {o.travel}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {o.styles.map((s) => (
                      <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                        {s}
                      </span>
                    ))}
                    {o.languages.map((l) => (
                      <span key={l} className="rounded-full border border-border/60 px-1.5 py-0.5 text-[9px] font-bold">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-border/60 bg-secondary/30 p-4">
                <p className="border-l-2 border-primary pl-3 font-serif text-[13px] italic leading-relaxed text-muted-foreground">
                  « {o.quote} »
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{o.ceremonies} cérémonies · {o.reviews} avis</span>
                  <span className="font-serif text-base text-foreground">{o.rate}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    disabled={!o.available}
                    className="flex-1 rounded-full bg-foreground py-2.5 text-xs font-bold text-background disabled:opacity-40"
                  >
                    Réserver un appel
                  </button>
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-secondary" aria-label="Message">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSaved((s) => { const n = new Set(s); n.has(o.id) ? n.delete(o.id) : n.add(o.id); return n; })}
                    className={`grid h-10 w-10 place-items-center rounded-full ${on ? "bg-primary/10 text-primary" : "bg-secondary"}`}
                    aria-label="Favori"
                  >
                    <Star className={`h-4 w-4 ${on ? "fill-primary" : ""}`} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Vous hésitez ?</p>
        <p className="mt-2 font-serif text-lg leading-tight">Casting personnalisé en 48h</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Décrivez votre couple et votre attente — nous vous présentons 3 officiants qui correspondent parfaitement.</p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Lancer un casting
        </button>
      </section>
    </div>
  );
}
