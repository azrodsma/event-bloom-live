import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Crown, Sparkles, Calendar, MessageCircle, Camera, FileText, Check, ChevronRight, Gift } from "lucide-react";

export const Route = createFileRoute("/events/$slug/vip")({
  component: VipLounge,
  head: () => ({
    meta: [
      { title: "Salon VIP témoins · Memento Live" },
      { name: "description", content: "L'espace privé de vos témoins et proches : brief, rôles, discours et surprises." },
      { property: "og:title", content: "Salon VIP témoins · Memento Live" },
      { property: "og:description", content: "Le cercle intime, coordonné." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const witnesses = [
  { name: "Léa Moreau", role: "Témoin de la mariée", tag: "Chef d'orchestre", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", ready: true },
  { name: "Camille Vidal", role: "Témoin de la mariée", tag: "Discours ouverture", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200", ready: true },
  { name: "Julien Roux", role: "Témoin du marié", tag: "Vidéo surprise", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200", ready: false },
  { name: "Thibault Mercier", role: "Témoin du marié", tag: "Playlist secrète", avatar: "https://images.unsplash.com/photo-1552083375-1447ce886485?w=200", ready: true },
];

const timeline = [
  { time: "10 h 30", label: "Brief témoins", place: "Suite parents", status: "done" },
  { time: "14 h 00", label: "Cérémonie civile", place: "Mairie", status: "done" },
  { time: "16 h 45", label: "Photo d'honneur (VIP only)", place: "Roseraie", status: "next" },
  { time: "20 h 15", label: "Discours des témoins", place: "Chapiteau", status: "upcoming" },
  { time: "22 h 30", label: "Surprise chorégraphie", place: "Piste", status: "upcoming" },
];

const missions = [
  { emoji: "🎤", title: "Discours d'ouverture", owner: "Camille", due: "Prêt à J-1", done: true },
  { emoji: "🎥", title: "Montage vidéo surprise", owner: "Julien", due: "Livrer avant 20 h", done: false },
  { emoji: "🎵", title: "Playlist secrète (32 titres)", owner: "Thibault", due: "Validée", done: true },
  { emoji: "💌", title: "Lettre du matin", owner: "Léa", due: "Ce matin, 8 h", done: true },
  { emoji: "🎁", title: "Cadeau collectif", owner: "Cercle", due: "Remise à 21 h", done: false },
];

const secrets = [
  { title: "Vidéo surprise", desc: "Compilation des amis · 3 min 12", author: "Julien", locked: true },
  { title: "Chorégraphie flash", desc: "6 mouvements simples · vidéo tuto", author: "Léa", locked: false },
  { title: "Lettre des parents", desc: "À lire pendant le dessert", author: "Maman", locked: true },
];

function VipLounge() {
  const { slug } = useParams({ from: "/events/$slug/vip" });
  const readyCount = witnesses.filter((w) => w.ready).length;

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-1.5">
          <Crown className="h-4 w-4 text-amber-500" />
          <p className="font-serif text-lg">Salon VIP</p>
        </div>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/70 via-primary/10 to-transparent" />
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute left-4 top-6 text-6xl opacity-10">👑</div>
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Accès restreint · 4 témoins
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Le cercle intime,<br />
            <span className="italic text-primary">coordonné</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Un espace privé pour orchestrer les surprises, discours et petits gestes qui feront la différence.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold text-emerald-700">
              <Check className="h-3 w-3" /> {readyCount}/{witnesses.length} prêts
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
              <Calendar className="h-3 w-3" /> J-3
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold">
              🔒 Invisible pour les mariés
            </span>
          </div>
        </div>
      </section>

      <section className="mt-4 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">L'équipe</p>
        <ul className="mt-2 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {witnesses.map((w) => (
            <li key={w.name} className="w-36 shrink-0 rounded-2xl border border-border/60 bg-card p-3 text-center">
              <div className="relative mx-auto w-fit">
                <img src={w.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-amber-300" />
                <Crown className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 fill-amber-400 text-amber-500" />
                <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ring-2 ring-card ${w.ready ? "bg-emerald-500" : "bg-amber-400"}`} />
              </div>
              <p className="mt-2 line-clamp-1 text-xs font-bold">{w.name}</p>
              <p className="text-[9px] text-muted-foreground">{w.role}</p>
              <p className="mt-1 truncate rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold">{w.tag}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary" /> Timeline privée
        </div>
        <ul className="relative mt-3 space-y-2 border-l border-dashed border-primary/30 pl-4">
          {timeline.map((t) => {
            const isNext = t.status === "next";
            const isDone = t.status === "done";
            return (
              <li key={t.label} className="relative">
                <span
                  className={`absolute -left-[21px] top-3 h-2.5 w-2.5 rounded-full ring-2 ring-background ${
                    isDone ? "bg-muted" : isNext ? "bg-primary animate-pulse" : "bg-amber-400"
                  }`}
                />
                <div className={`rounded-2xl p-3 ${isNext ? "bg-primary/10 ring-1 ring-primary/30" : "bg-card ring-1 ring-border/60"}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-bold">{t.time}</p>
                    {isNext && <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">Maintenant</span>}
                    {isDone && <span className="text-[9px] text-muted-foreground">✓ terminé</span>}
                  </div>
                  <p className={`mt-1 text-[13px] ${isDone ? "text-muted-foreground line-through" : "font-semibold"}`}>{t.label}</p>
                  <p className="text-[10px] text-muted-foreground">{t.place}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Missions du cercle</p>
        <ul className="mt-2 space-y-1.5">
          {missions.map((m) => (
            <li key={m.title} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  m.done ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"
                }`}
              >
                {m.done ? <Check className="h-4 w-4" /> : <span className="text-base">{m.emoji}</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-[13px] ${m.done ? "line-through text-muted-foreground" : "font-semibold"}`}>{m.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {m.owner} · {m.due}
                </p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <Gift className="h-3.5 w-3.5 text-primary" /> Coffre à surprises
        </div>
        <ul className="mt-3 space-y-2">
          {secrets.map((s) => (
            <li key={s.title} className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                {s.locked ? "🔒" : "🎁"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">{s.title}</p>
                <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                <p className="text-[9px] uppercase tracking-wider text-primary">Par {s.author}</p>
              </div>
              <button className="rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold text-background">
                {s.locked ? "Déverrouiller" : "Voir"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions rapides</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { icon: MessageCircle, label: "Chat privé" },
            { icon: FileText, label: "Notes discours" },
            { icon: Camera, label: "Coulisses" },
          ].map((a) => (
            <button key={a.label} className="rounded-2xl border border-border/60 bg-card p-3 text-center">
              <a.icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1.5 text-[10px] font-semibold">{a.label}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="mx-4 mt-4 flex items-center gap-3 rounded-3xl bg-amber-50 p-4 text-[11px] text-amber-900">
        <Crown className="h-5 w-5 shrink-0 text-amber-500" />
        <p>Tout ce qui se dit ici reste ici. Les mariés n'ont aucune visibilité sur cet espace, jamais.</p>
      </div>
    </div>
  );
}
