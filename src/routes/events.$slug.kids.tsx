import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Baby, Sparkles, Clock, MapPin, Phone, Heart, Play, Palette, Music, Puzzle } from "lucide-react";

export const Route = createFileRoute("/events/$slug/kids")({
  component: KidsCorner,
  head: () => ({
    meta: [
      { title: "Espace enfants · MaFeliza" },
      { name: "description", content: "Un coin dédié aux petits invités : activités, garderie, coloriages et chasse au trésor." },
      { property: "og:title", content: "Espace enfants · MaFeliza" },
      { property: "og:description", content: "Les petits aussi ont leur fête." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const registered = [
  { name: "Léo", age: 6, allergies: "Arachide", avatar: "https://images.unsplash.com/photo-1503457574462-bd27054394c1?w=200", diet: "Standard" },
  { name: "Alice", age: 4, allergies: "—", avatar: "https://images.unsplash.com/photo-1519340333755-56e9c1d8b8dd?w=200", diet: "Végé" },
  { name: "Noé", age: 2, allergies: "Œuf", avatar: "https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=200", diet: "Sans œuf" },
  { name: "Zoé", age: 8, allergies: "—", avatar: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200", diet: "Standard" },
];

const timeline = [
  { time: "14:00", label: "Accueil parents", place: "Tente rose", color: "bg-rose-100 text-rose-700" },
  { time: "15:30", label: "Maquillage & tatoos", place: "Studio glitter", color: "bg-amber-100 text-amber-700" },
  { time: "17:00", label: "Chasse au trésor", place: "Jardin nord", color: "bg-emerald-100 text-emerald-700" },
  { time: "18:30", label: "Goûter magique", place: "Chapiteau kids", color: "bg-primary/15 text-primary" },
  { time: "20:00", label: "Cinéma sous couette", place: "Salon", color: "bg-violet-100 text-violet-700" },
  { time: "21:30", label: "Récupération dodo", place: "Chambres", color: "bg-slate-100 text-slate-700" },
];

const activities = [
  { icon: Palette, emoji: "🎨", title: "Coloriage magique", desc: "10 planches à imprimer", cta: "Télécharger", tint: "from-rose-100 to-primary/10" },
  { icon: Puzzle, emoji: "🧩", title: "Chasse au trésor", desc: "7 énigmes autour du domaine", cta: "Lancer", tint: "from-amber-100 to-amber-200" },
  { icon: Music, emoji: "🎤", title: "Karaoké enfants", desc: "20 titres Disney & Pixar", cta: "Ouvrir", tint: "from-violet-100 to-violet-200" },
  { icon: Play, emoji: "🎬", title: "Ciné sous les étoiles", desc: "3 films au choix", cta: "Voter", tint: "from-sky-100 to-sky-200" },
];

const staff = [
  { name: "Marion Bel", role: "Animatrice BAFA", exp: "8 ans", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200" },
  { name: "Camille D.", role: "Assistante puér.", exp: "5 ans", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200" },
];

const menu = [
  { label: "🍝 Mini-lasagnes maison", time: "18 h" },
  { label: "🥕 Bâtonnets de légumes & houmous", time: "17 h" },
  { label: "🧁 Cupcakes licorne", time: "19 h" },
];

const sectionTitle = "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground";

function KidsCorner() {
  const { slug } = useParams({ from: "/events/$slug/kids" });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-xl safe-top">
        <div className="mx-auto grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 md:px-6 lg:px-8">
          <Link
            to="/events/$slug"
            params={{ slug }}
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-muted active:scale-95"
            aria-label="Retour à l'événement"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="truncate text-center font-serif text-lg md:text-xl">Espace enfants</p>
          <span className="w-10" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-100/60 via-primary/10 to-transparent" />
        <div className="pointer-events-none absolute -left-6 top-16 -rotate-12 text-7xl opacity-15 lg:text-8xl">🎈</div>
        <div className="pointer-events-none absolute right-2 top-4 text-6xl opacity-15 lg:text-7xl">🦄</div>
        <div className="pointer-events-none absolute bottom-4 right-16 text-4xl opacity-15 lg:text-6xl">🎠</div>
        <div className="relative grid gap-6 px-4 pb-8 pt-6 md:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:px-8 lg:pb-10 lg:pt-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Baby className="h-3.5 w-3.5 shrink-0 text-primary" /> 12 enfants · 2 encadrants
            </div>
            <h1 className="mt-3 text-balance font-serif text-[clamp(2rem,7vw,3.25rem)] leading-[1.05]">
              Les petits aussi<br />
              <span className="italic text-primary">ont leur fête</span>
            </h1>
            <p className="mt-3 max-w-[46ch] text-sm text-muted-foreground md:text-base">
              Un cocon dédié pour que les enfants s'amusent en toute sécurité pendant que vous célébrez.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                ✅ Encadrement diplômé
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary">
                <MapPin className="h-3 w-3 shrink-0" /> Tente rose · aile ouest
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-bold">
                14 h → 22 h
              </span>
            </div>
          </div>

          {/* Petits invités */}
          <div className="min-w-0 rounded-3xl bg-card/80 p-4 shadow-card ring-1 ring-border/60 backdrop-blur md:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className={sectionTitle}>Petits invités inscrits</p>
              <button className="shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10">
                + Inscrire
              </button>
            </div>
            <ul className="scrollbar-hide -mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
              {registered.map((k) => (
                <li key={k.name} className="w-24 shrink-0 rounded-2xl border border-border/60 bg-background p-2 text-center sm:w-auto">
                  <img src={k.avatar} alt="" loading="lazy" className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-primary/25" />
                  <p className="mt-1.5 line-clamp-1 text-xs font-bold">{k.name}</p>
                  <p className="text-[11px] text-muted-foreground">{k.age} ans</p>
                  <p className="mt-1 truncate rounded-full bg-secondary/60 px-1.5 py-0.5 text-[11px]">{k.diet}</p>
                  {k.allergies !== "—" && <p className="mt-0.5 text-[11px] text-rose-600">⚠ {k.allergies}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Corps : 2 colonnes dès lg */}
      <div className="grid gap-6 px-4 pt-6 md:px-6 md:pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <div className="min-w-0 space-y-8">
          {/* Programme */}
          <section>
            <div className={`flex items-center gap-2 ${sectionTitle}`}>
              <Clock className="h-3.5 w-3.5 text-primary" /> Programme
            </div>
            <ul className="relative mt-4 space-y-2.5 border-l border-dashed border-primary/30 pl-4 md:pl-6">
              {timeline.map((t) => (
                <li key={t.label} className="relative">
                  <span className="absolute -left-[21px] top-4 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background md:-left-[29px]" />
                  <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60 transition hover:shadow-card md:p-4">
                    <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold ${t.color}`}>{t.time}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{t.label}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{t.place}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Activités */}
          <section>
            <p className={sectionTitle}>Activités à télécharger</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {activities.map((a) => (
                <article
                  key={a.title}
                  className={`flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${a.tint} p-4 transition hover:-translate-y-1 hover:shadow-glow md:p-5`}
                >
                  <div className="text-4xl">{a.emoji}</div>
                  <p className="mt-2 font-serif text-base leading-tight md:text-lg">{a.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{a.desc}</p>
                  <button className="mt-4 w-full rounded-full bg-foreground py-2 text-[11px] font-bold text-background transition active:scale-[0.97]">
                    {a.cta}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Rail latéral */}
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section>
            <p className={sectionTitle}>L'équipe qui veille</p>
            <ul className="mt-3 space-y-2">
              {staff.map((s) => (
                <li key={s.name} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
                  <img src={s.avatar} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-emerald-300" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{s.role} · {s.exp} d'expérience</p>
                  </div>
                  <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground active:scale-95" aria-label={`Appeler ${s.name}`}>
                    <Phone className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-primary/25 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Menu enfants
            </div>
            <p className="mt-2 font-serif text-lg leading-tight md:text-xl">Un festin pensé pour les petits palais</p>
            <ul className="mt-3 space-y-1.5 text-[13px]">
              {menu.map((m) => (
                <li key={m.label} className="flex items-center justify-between gap-3 rounded-xl bg-background px-3 py-2.5 ring-1 ring-border/60">
                  <span className="min-w-0 truncate">{m.label}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{m.time}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex items-center gap-3 rounded-3xl bg-rose-50 p-4 text-[12px] leading-relaxed text-rose-900">
            <Heart className="h-5 w-5 shrink-0 fill-rose-500 text-rose-500" />
            <p>En cas de pépin, un SMS automatique est envoyé au parent référent. Bouton rouge sur la carte du domaine.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
