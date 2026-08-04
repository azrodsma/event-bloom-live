import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Sparkles, Crown, Camera, MessageCircle, Music, Heart, Share2 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/hall-of-fame")({
  component: HallOfFame,
  head: () => ({
    meta: [
      { title: "Palmarès des invités · MaFeliza" },
      { name: "description", content: "Les vedettes discrètes et bruyantes de la soirée : super-fan, meilleure danse, plus belle tenue…" },
      { property: "og:title", content: "Palmarès des invités · MaFeliza" },
      { property: "og:description", content: "Le palmarès de la soirée." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Award = {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  winner: string;
  handle: string;
  photo: string;
  stat: string;
  icon: typeof Camera;
  color: string;
};

const podium = [
  {
    pos: 2,
    name: "Julien Roux",
    handle: "@ju.roux",
    points: 342,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
    title: "Roi de la piste",
    emoji: "💃",
    height: "h-32",
    ring: "ring-slate-300",
  },
  {
    pos: 1,
    name: "Camille Vidal",
    handle: "@camillev",
    points: 487,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    title: "MVP de la soirée",
    emoji: "👑",
    height: "h-44",
    ring: "ring-amber-400",
  },
  {
    pos: 3,
    name: "Anaïs Dubois",
    handle: "@anais.d",
    points: 298,
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200",
    title: "Cœur de fête",
    emoji: "🌟",
    height: "h-24",
    ring: "ring-orange-400",
  },
];

const awards: Award[] = [
  {
    id: "a1",
    emoji: "📸",
    title: "Reporter du dimanche",
    desc: "A partagé le plus de photos",
    winner: "Léa Moreau",
    handle: "@lea.m",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    stat: "184 photos",
    icon: Camera,
    color: "from-sky-100 to-sky-200",
  },
  {
    id: "a2",
    emoji: "💬",
    title: "Reine du chat live",
    desc: "Message le plus liké de la soirée",
    winner: "Camille Vidal",
    handle: "@camillev",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    stat: "128 ❤️ sur un message",
    icon: MessageCircle,
    color: "from-primary/20 to-primary/10",
  },
  {
    id: "a3",
    emoji: "🎵",
    title: "DJ de l'ombre",
    desc: "Playlist collaborative la plus jouée",
    winner: "Thibault Mercier",
    handle: "@tibo",
    photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200",
    stat: "42 titres retenus",
    icon: Music,
    color: "from-violet-100 to-violet-200",
  },
  {
    id: "a4",
    emoji: "👗",
    title: "Plus belle tenue",
    desc: "Voté par la salle",
    winner: "Marie Gérard",
    handle: "@marieg",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
    stat: "87 votes",
    icon: Sparkles,
    color: "from-rose-100 to-rose-200",
  },
  {
    id: "a5",
    emoji: "🎤",
    title: "Discours de l'année",
    desc: "Le vocal du livre d'or le plus émouvant",
    winner: "Grand-père Louis",
    handle: "invité",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    stat: "3 min 42 s de standing ovation",
    icon: Heart,
    color: "from-amber-100 to-amber-200",
  },
  {
    id: "a6",
    emoji: "⏰",
    title: "Dernier·e sur la piste",
    desc: "A tenu jusqu'au petit matin",
    winner: "Karim Bensaïd",
    handle: "@karim.b",
    photo: "https://images.unsplash.com/photo-1552083375-1447ce886485?w=200",
    stat: "Départ à 4 h 12",
    icon: Trophy,
    color: "from-emerald-100 to-emerald-200",
  },
];

const points = [
  { label: "Photo publiée", pts: "+5" },
  { label: "Message ❤️ reçu", pts: "+1" },
  { label: "Cagnotte", pts: "+15" },
  { label: "Vocal livre d'or", pts: "+20" },
];

function HallOfFame() {
  const { slug } = useParams({ from: "/events/$slug/hall-of-fame" });

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Palmarès</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 via-primary/5 to-transparent" />
        <div className="absolute -left-8 top-16 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute right-4 top-10 text-6xl opacity-10">🏆</div>
        <div className="relative px-4 pb-4 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-amber-500" /> Sarah & Thomas · 187 invités
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Le palmarès<br />
            <span className="italic text-primary">de la soirée</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Un clin d'œil à celles et ceux qui ont fait vibrer la fête.
          </p>
        </div>

        <div className="relative mx-4 mt-2 grid grid-cols-3 items-end gap-2">
          {[podium[0], podium[1], podium[2]].map((p) => (
            <div key={p.pos} className="flex flex-col items-center">
              <div className="text-2xl mb-1">{p.emoji}</div>
              <div className="relative">
                <img
                  src={p.avatar}
                  alt=""
                  className={`h-16 w-16 rounded-full object-cover ring-4 ${p.ring}`}
                />
                {p.pos === 1 && (
                  <Crown className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 fill-amber-400 text-amber-500" />
                )}
                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background ring-2 ring-background">
                  {p.pos}
                </span>
              </div>
              <p className="mt-2 line-clamp-1 text-center text-xs font-bold">{p.name}</p>
              <p className="text-[9px] text-muted-foreground">{p.handle}</p>
              <div className={`mt-2 w-full ${p.height} rounded-t-2xl bg-gradient-to-t from-primary/10 to-primary/30 shadow-inner`}>
                <div className="pt-2 text-center">
                  <p className="font-serif text-lg leading-none">{p.points}</p>
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground">points</p>
                </div>
              </div>
              <p className="mt-1 text-center text-[10px] font-semibold text-primary">{p.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 px-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Prix spéciaux · attribués par l'IA
        </div>
        <ul className="mt-3 space-y-3">
          {awards.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className={`relative h-24 bg-gradient-to-br ${a.color}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
                  <span className="absolute left-4 top-4 text-4xl">{a.emoji}</span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10px] font-bold backdrop-blur">
                    <Icon className="h-3 w-3" /> {a.stat}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <img src={a.photo} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white" />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-base leading-tight">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                    <p className="mt-1 text-xs">
                      <span className="font-bold">{a.winner}</span>{" "}
                      <span className="text-[10px] text-muted-foreground">{a.handle}</span>
                    </p>
                  </div>
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Féliciter">
                    <Heart className="h-4 w-4 text-primary" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Système de points
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Comment on compte</p>
        <ul className="mt-3 space-y-1.5">
          {points.map((p) => (
            <li key={p.label} className="flex items-center justify-between rounded-xl bg-background px-3 py-2 ring-1 ring-border/60">
              <span className="text-[12px]">{p.label}</span>
              <span className="font-mono text-xs font-bold text-primary">{p.pts}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] text-muted-foreground">
          Anonyme et opt-in. Les invités peuvent se retirer du classement à tout moment.
        </p>
      </section>
    </div>
  );
}
