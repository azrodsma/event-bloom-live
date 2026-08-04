import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Share2, Download, Heart, Camera, MessageCircle, Gift, Sparkles, Trophy, Users, Radio } from "lucide-react";

export const Route = createFileRoute("/app/year-in-review")({
  component: YearInReview,
  head: () => ({
    meta: [
      { title: "Votre année MaFeliza · 2026" },
      { name: "description", content: "Rétrospective personnalisée de vos moments partagés cette année : événements, photos, réactions, messages." },
      { property: "og:title", content: "Votre année MaFeliza · 2026" },
      { property: "og:description", content: "L'année à revivre en un clin d'œil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const stats = [
  { icon: Camera, label: "Photos ajoutées", value: 428, hint: "à travers 6 albums" },
  { icon: Heart, label: "Réactions envoyées", value: 1284, hint: "dont 340 cœurs live" },
  { icon: MessageCircle, label: "Messages", value: 96, hint: "5 vocaux enregistrés" },
  { icon: Gift, label: "Cagnottes soutenues", value: 4, hint: "620 € contribués" },
];

const months = [
  { m: "Fév", value: 8 },
  { m: "Mar", value: 22 },
  { m: "Avr", value: 45 },
  { m: "Mai", value: 61 },
  { m: "Juin", value: 78 },
  { m: "Juil", value: 42 },
  { m: "Août", value: 28 },
  { m: "Sept", value: 55 },
  { m: "Oct", value: 34 },
  { m: "Nov", value: 12 },
];

const topEvents = [
  { title: "Mariage Sarah & Thomas", role: "Invitée", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop", stat: "89 photos" },
  { title: "Baptême de Gabriel", role: "Marraine", cover: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&auto=format&fit=crop", stat: "42 photos" },
  { title: "30 ans de Clara", role: "Organisatrice", cover: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&auto=format&fit=crop", stat: "156 photos" },
];

const badges = [
  { emoji: "📸", label: "Reporter" },
  { emoji: "💌", label: "Rassembleuse" },
  { emoji: "🎤", label: "Voix d'or" },
  { emoji: "🌟", label: "Ambassadrice" },
];

function YearInReview() {
  const maxMonth = Math.max(...months.map((m) => m.value));
  const bestMonth = months.reduce((a, b) => (a.value > b.value ? a : b));

  return (
    <div className="min-h-screen pb-24 text-white"
      style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #4a1e3d 40%, #E85D8E 80%, #D9A441 100%)" }}
    >
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">MaFeliza Wrapped</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <section className="px-6 pt-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/60">2026</p>
        <h1 className="mt-4 font-serif text-5xl leading-none">
          Votre année<br /><span className="text-accent">MaFeliza</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm text-white/70">
          Une année riche en émotions partagées. Voici votre rétrospective personnalisée.
        </p>

        <div className="mx-auto mt-8 flex max-w-[280px] items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
          <img src="https://i.pravatar.cc/128?img=48" alt="" className="h-14 w-14 rounded-full ring-2 ring-white/60" />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs text-white/60">Bonjour</p>
            <p className="font-serif text-xl">Isabelle</p>
          </div>
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
      </section>

      <section className="px-4 pt-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/60">Vos chiffres clés</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                <Icon className="h-5 w-5 text-accent" />
                <p className="mt-3 font-serif text-4xl leading-none">{s.value.toLocaleString("fr-FR")}</p>
                <p className="mt-1 text-xs font-semibold">{s.label}</p>
                <p className="mt-0.5 text-[10px] text-white/60">{s.hint}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/60">Le rythme de votre année</p>
        <div className="mt-4 rounded-3xl bg-white/10 p-5 backdrop-blur">
          <div className="flex items-end justify-between gap-1.5" style={{ height: 140 }}>
            {months.map((mo) => {
              const isBest = mo.m === bestMonth.m;
              const h = (mo.value / maxMonth) * 100;
              return (
                <div key={mo.m} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className={`text-[9px] font-bold ${isBest ? "text-accent" : "text-white/50"}`}>{mo.value}</span>
                  <div
                    className={`w-full rounded-t-md ${isBest ? "bg-accent" : "bg-white/40"}`}
                    style={{ height: `${h}%` }}
                  />
                  <span className={`text-[9px] font-semibold ${isBest ? "text-accent" : "text-white/60"}`}>{mo.m}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-white/80">
            Votre mois le plus intense : <span className="font-bold text-accent">{bestMonth.m}</span> avec {bestMonth.value} interactions.
          </p>
        </div>
      </section>

      <section className="px-4 pt-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/60">Vos 3 événements phares</p>
        <ul className="mt-4 space-y-3">
          {topEvents.map((e, i) => (
            <li key={e.title} className="flex items-center gap-3 rounded-3xl bg-white/10 p-3 backdrop-blur">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent font-serif text-lg font-bold text-foreground">
                {i + 1}
              </span>
              <img src={e.cover} alt="" className="h-14 w-14 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg leading-tight">{e.title}</p>
                <p className="text-[11px] text-white/70">{e.role} · {e.stat}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pt-10">
        <div className="rounded-3xl bg-gradient-to-br from-accent/40 to-primary/40 p-6 text-center backdrop-blur">
          <Radio className="mx-auto h-8 w-8 text-white" />
          <p className="mt-3 font-serif text-3xl leading-tight">14 h 32 min<br />de live regardé</p>
          <p className="mt-3 text-xs text-white/80">
            Vous avez suivi 7 lives cette année.<br />
            Le plus long : cérémonie de Sarah & Thomas, 2 h 18.
          </p>
        </div>
      </section>

      <section className="px-4 pt-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/60">Vos badges 2026</p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {badges.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 p-3 backdrop-blur">
              <span className="text-3xl">{b.emoji}</span>
              <p className="text-[10px] font-semibold">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-10">
        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
          <Trophy className="mx-auto h-8 w-8 text-accent" />
          <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-white/60">Votre pouvoir MaFeliza</p>
          <p className="mt-2 text-center font-serif text-3xl leading-tight">La Rassembleuse</p>
          <p className="mt-3 text-center text-xs text-white/80">
            Vous avez présenté MaFeliza à <span className="font-bold text-accent">3 amis</span> qui ont créé leur premier événement.
            Grâce à vous, ces moments existent aujourd'hui.
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-accent" />
            <p className="text-[11px] font-semibold">Top 8 % des utilisateurs</p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-10 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-accent" />
        <h2 className="mt-3 font-serif text-3xl leading-tight">Merci pour cette<br />année à vos côtés.</h2>
        <p className="mt-3 text-sm text-white/80">Que 2027 vous apporte encore plus de moments précieux.</p>
      </section>

      <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-foreground shadow-glow">
          <Share2 className="h-4 w-4" /> Partager
        </button>
        <button className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
          <Download className="h-4 w-4" /> Télécharger
        </button>
      </div>
    </div>
  );
}
