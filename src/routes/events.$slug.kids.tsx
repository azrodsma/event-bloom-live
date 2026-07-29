import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Baby, Sparkles, Clock, MapPin, Phone, Heart, Play, Palette, Music, Puzzle } from "lucide-react";

export const Route = createFileRoute("/events/$slug/kids")({
  component: KidsCorner,
  head: () => ({
    meta: [
      { title: "Espace enfants · Memento Live" },
      { name: "description", content: "Un coin dédié aux petits invités : activités, garderie, coloriages et chasse au trésor." },
      { property: "og:title", content: "Espace enfants · Memento Live" },
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

function KidsCorner() {
  const { slug } = useParams({ from: "/events/$slug/kids" });

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Espace enfants</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-100/60 via-primary/10 to-transparent" />
        <div className="absolute -left-6 top-16 text-7xl opacity-15 -rotate-12">🎈</div>
        <div className="absolute right-2 top-4 text-6xl opacity-15">🦄</div>
        <div className="absolute right-16 bottom-4 text-4xl opacity-15">🎠</div>
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Baby className="h-3.5 w-3.5 text-primary" /> 12 enfants · 2 encadrants
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Les petits aussi<br />
            <span className="italic text-primary">ont leur fête</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Un cocon dédié pour que les enfants s'amusent en toute sécurité pendant que vous célébrez.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold text-emerald-700">
              ✅ Encadrement diplômé
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
              <MapPin className="h-3 w-3" /> Tente rose · aile ouest
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold">
              14 h → 22 h
            </span>
          </div>
        </div>
      </section>

      <section className="mt-2 px-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Petits invités inscrits</p>
          <button className="text-[10px] font-semibold text-primary">+ Inscrire</button>
        </div>
        <div className="-mx-1 mt-2 flex gap-3 overflow-x-auto px-1 pb-1">
          {registered.map((k) => (
            <div key={k.name} className="w-24 shrink-0 rounded-2xl border border-border/60 bg-card p-2 text-center">
              <img src={k.avatar} alt="" className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-primary/25" />
              <p className="mt-1.5 line-clamp-1 text-xs font-bold">{k.name}</p>
              <p className="text-[9px] text-muted-foreground">{k.age} ans</p>
              <p className="mt-1 truncate rounded-full bg-secondary/60 px-1.5 py-0.5 text-[9px]">{k.diet}</p>
              {k.allergies !== "—" && (
                <p className="mt-0.5 text-[9px] text-rose-600">⚠ {k.allergies}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" /> Programme
        </div>
        <ul className="relative mt-3 space-y-2 border-l border-dashed border-primary/30 pl-4">
          {timeline.map((t) => (
            <li key={t.label} className="relative">
              <span className="absolute -left-[21px] top-3 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
              <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
                <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${t.color}`}>
                  {t.time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">{t.label}</p>
                  <p className="text-[10px] text-muted-foreground">{t.place}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Activités à télécharger</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {activities.map((a) => (
            <div key={a.title} className={`overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${a.tint} p-4`}>
              <div className="text-4xl">{a.emoji}</div>
              <p className="mt-2 font-serif text-base leading-tight">{a.title}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{a.desc}</p>
              <button className="mt-3 w-full rounded-full bg-foreground py-1.5 text-[10px] font-bold text-background">
                {a.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">L'équipe qui veille</p>
        <ul className="mt-2 space-y-2">
          {staff.map((s) => (
            <li key={s.name} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
              <img src={s.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-emerald-300" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">{s.role} · {s.exp} d'expérience</p>
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Appeler">
                <Phone className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-primary/25 bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Menu enfants
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Un festin pensé pour les petits palais</p>
        <ul className="mt-3 space-y-1.5 text-[12px]">
          <li className="flex justify-between rounded-xl bg-background px-3 py-2 ring-1 ring-border/60">
            <span>🍝 Mini-lasagnes maison</span>
            <span className="text-[10px] text-muted-foreground">18 h</span>
          </li>
          <li className="flex justify-between rounded-xl bg-background px-3 py-2 ring-1 ring-border/60">
            <span>🥕 Bâtonnets de légumes & houmous</span>
            <span className="text-[10px] text-muted-foreground">17 h</span>
          </li>
          <li className="flex justify-between rounded-xl bg-background px-3 py-2 ring-1 ring-border/60">
            <span>🧁 Cupcakes licorne</span>
            <span className="text-[10px] text-muted-foreground">19 h</span>
          </li>
        </ul>
      </section>

      <div className="mx-4 mt-6 flex items-center gap-3 rounded-3xl bg-rose-50 p-4 text-[11px] text-rose-900">
        <Heart className="h-5 w-5 shrink-0 fill-rose-500 text-rose-500" />
        <p>En cas de pépin, un SMS automatique est envoyé au parent référent. Bouton rouge sur la carte du domaine.</p>
      </div>
    </div>
  );
}
