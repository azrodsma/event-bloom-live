import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { EventCard } from "@/components/EventCard";
import { mockEvents, eventTypes } from "@/lib/mock-data";
import { eventIcon } from "@/lib/event-icons";
import { listPublicEvents } from "@/lib/events.functions";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Radio,
  Gift,
  BookHeart,
  Camera,
  Sparkles,
  ArrowRight,
  Check,
  QrCode,
  Users,
  MessageCircle,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MaFeliza — Vos événements, en direct, en souvenirs" },
      {
        name: "description",
        content:
          "Le réseau social privé de vos plus beaux événements. Créez, diffusez, collectez et revivez.",
      },
      { property: "og:title", content: "MaFeliza" },
      {
        property: "og:description",
        content: "Vos événements, en direct, en souvenirs.",
      },
          { property: "og:url", content: "https://event.bold-lab-agency.com/" },
      { property: "og:type", content: "website" },
],
    links: [{ rel: "canonical", href: "https://event.bold-lab-agency.com/" }],
  }),
  component: Landing,
});

function Landing() {
  const fetchPublic = useServerFn(listPublicEvents);
  const { data: publicEvents } = useQuery({
    queryKey: ["public-events"],
    queryFn: () => fetchPublic(),
  });
  const realEvents = (publicEvents ?? []).map((e) => adaptEvent(e as unknown as DbEvent));
  const showcase = realEvents.length > 0 ? realEvents : mockEvents;
  const liveEvents = showcase.filter((e) => e.isLive);
  const featured = [...liveEvents, ...showcase.filter((e) => !e.isLive)].slice(0, 3);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#concept" className="hover:text-foreground">Concept</a>
            <a href="#features" className="hover:text-foreground">Fonctionnalités</a>
            <a href="#events" className="hover:text-foreground">Événements</a>
            <a href="#pricing" className="hover:text-foreground">Tarifs</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/join"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted sm:inline-flex"
            >
              J'ai un code
            </Link>
            <Link
              to="/auth"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
            >
              Connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-warm opacity-70" />
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Nouveau · Bêta privée
            </span>
            <h1 className="mt-6 text-balance font-serif text-[2.75rem] leading-[1.03] text-foreground sm:text-6xl md:text-7xl">
              Le réseau social privé de vos plus beaux <span className="italic text-gradient-primary">événements</span>.
            </h1>
            <span className="rule-gold mt-6 block max-w-[10rem]" />
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Créez votre événement, partagez votre live, recevez des messages, centralisez vos souvenirs et laissez vos proches participer, même à distance.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/app/create"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
              >
                Créer un événement gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/join"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                <QrCode className="h-4 w-4" /> J'ai reçu une invitation
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[47, 12, 32, 25].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/80?img=${n}`}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <span><strong className="text-foreground">+ 12 000</strong> proches réunis en live</span>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-primary opacity-20 blur-2xl" />
            <div className="relative rounded-[2.5rem] border border-border bg-dark p-3 shadow-modal">
              <div className="overflow-hidden rounded-[2rem] bg-background">
                <div className="relative">
                  <img
                    src={mockEvents[0].cover}
                    alt="Aperçu"
                    className="h-[380px] w-full object-cover sm:h-[460px] lg:h-[520px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="animate-pulse-live rounded-full bg-live px-3 py-1 text-[11px] font-bold uppercase text-white">● Live</span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-foreground">
                      <Users className="mr-1 inline h-3 w-3" />2 546
                    </span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">Mariage · Bordeaux</p>
                    <h3 className="mt-1 font-serif text-3xl leading-tight">Sarah &amp; Thomas</h3>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/15 py-1.5 text-xs font-medium backdrop-blur">
                        <MessageCircle className="h-3.5 w-3.5" /> Chat en direct
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
                        <Heart className="h-3.5 w-3.5 fill-current" /> 128
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 border-t border-border/60 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Gift className="h-3.5 w-3.5 text-gold" /> Voyage de noces
                  </p>
                  <div className="h-2 overflow-hidden rounded-full bg-primary-light">
                    <div className="h-full w-[60%] rounded-full bg-gradient-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">4 250 €</span> sur 7 000 € · via Leetchi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avant / Pendant / Après */}
      <section id="concept" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Le concept</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Avant. Pendant. Après.</h2>
          <p className="mt-3 text-muted-foreground">Une expérience complète pour chaque événement.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              tag: "Avant",
              title: "Invitation & anticipation",
              desc: "Faire-part digital, compte à rebours, stories, cagnotte, présentation des mariés.",
              icon: <Sparkles className="h-6 w-6" />,
            },
            {
              tag: "Pendant",
              title: "Le live, les émotions",
              desc: "Live YouTube/Twitch intégré, chat, réactions, cadeaux, photos des invités.",
              icon: <Radio className="h-6 w-6" />,
            },
            {
              tag: "Après",
              title: "Souvenirs pour toujours",
              desc: "Livre d'or multimédia, album collaboratif, replay, export des souvenirs.",
              icon: <BookHeart className="h-6 w-6" />,
            },
          ].map((s) => (
            <div key={s.tag} className="group rounded-3xl border border-border bg-surface p-7 shadow-card transition hover:-translate-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-light text-primary">
                {s.icon}
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-primary">{s.tag}</p>
              <h3 className="mt-1 font-serif text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-secondary-light py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Fonctionnalités</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Tout ce dont vous avez besoin</h2>
            <div className="rule-gold mx-auto mt-5 w-24" />
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Radio, title: "Live intégré", desc: "YouTube Live ou Twitch, intégrés à votre page événement." },
              { icon: Gift, title: "Cagnotte externe", desc: "Leetchi, Lydia, OnParticipe, PayPal... Vous choisissez." },
              { icon: BookHeart, title: "Livre d'or multimédia", desc: "Messages texte, photos, vidéos et vocaux." },
              { icon: Camera, title: "Espace caméraman", desc: "Vos prestataires accèdent à leurs missions via un code." },
              { icon: Sparkles, title: "Stories & feed", desc: "Un fil d'actualité inspiré d'Instagram, en privé." },
              { icon: QrCode, title: "Codes & QR", desc: "Accès invités par code ou QR code, en toute simplicité." },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border/70 bg-surface p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-soft"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-light text-primary transition group-hover:bg-gradient-primary group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-xl">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types événements */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Pour tous vos moments</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Mariage, baptême, anniversaire...</h2>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {eventTypes.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground shadow-card"
            >
              {(() => { const I = eventIcon(t); return <I className="h-4 w-4 text-gold" />; })()} {t}
            </span>
          ))}
        </div>
      </section>

      {/* Live events preview */}
      <section id="events" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Découvrir</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Événements en direct</h2>
          </div>
          <Link to="/app/explore" className="text-sm font-semibold text-primary hover:underline">
            Tout explorer →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((e, i) => (
            <div key={e.id} className={i === 3 ? "lg:hidden" : undefined}>
              <EventCard event={e} />
            </div>
          ))}
        </div>

      </section>

      {/* Tarifs */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Tarifs</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Simple et transparent</h2>
          <div className="rule-gold mx-auto mt-5 w-24" />
        </div>
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
          {[
            { name: "Gratuit", price: "0 €", features: ["1 événement", "Live externe", "Livre d'or basique", "50 photos"], primary: false },
            { name: "Essentiel", price: "29 €", note: "par événement", features: ["Événements illimités", "Cagnotte externe", "Album collaboratif", "Photos illimitées", "Espace caméraman"], primary: true },
            { name: "Prestige", price: "89 €", note: "par événement", features: ["Tout Essentiel", "Interactions payantes", "Souvenir vidéo", "Modération premium", "Support dédié"], primary: false },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative flex h-full flex-col rounded-3xl border p-8 transition duration-300 ${
                p.primary
                  ? "border-primary bg-gradient-primary text-white shadow-glow md:scale-[1.03]"
                  : "border-border bg-surface shadow-card hover:-translate-y-1 hover:shadow-soft"
              }`}
            >
              {p.primary && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-gold px-4 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-dark shadow-card">
                  Le plus choisi
                </span>
              )}
              <h3 className="font-serif text-2xl">{p.name}</h3>
              <p className="mt-3 font-serif text-4xl font-bold">{p.price}</p>
              <p className={`min-h-[1.25rem] text-xs ${p.primary ? "text-white/80" : "text-muted-foreground"}`}>
                {p.note ?? "sans engagement"}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.primary ? "text-white" : "text-primary"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  to="/app/create"
                  className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    p.primary ? "bg-white text-primary" : "bg-foreground text-background"
                  }`}
                >
                  Commencer
                </Link>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-10 text-center text-white shadow-glow sm:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            Vos événements, en direct, en souvenirs.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/90">
            Commencez à créer votre page événement en 2 minutes. Aucune carte bancaire requise.
          </p>
          <Link
            to="/app/create"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-primary transition hover:scale-[1.02]"
          >
            Créer mon événement <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} MaFeliza · Vos événements, en direct, en souvenirs.</p>
        </div>
      </footer>
    </div>
  );
}
