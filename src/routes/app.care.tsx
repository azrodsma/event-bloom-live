import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, HeartHandshake, Flower2, Phone, MessageCircle, Sparkles, Users, BookOpen, ChevronRight, Sun } from "lucide-react";

export const Route = createFileRoute("/app/care")({
  component: Care,
  head: () => ({
    meta: [
      { title: "Bien-être & entraide · Memento Live" },
      { name: "description", content: "Un espace bienveillant pour les moments difficiles : hommages, deuil, soutien et ressources d'accompagnement." },
      { property: "og:title", content: "Bien-être & entraide · Memento Live" },
      { property: "og:description", content: "Vous n'êtes pas seul·e." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const rituals = [
  { emoji: "🕯️", title: "Allumer une bougie", desc: "Un geste symbolique partagé avec vos proches" },
  { emoji: "📝", title: "Écrire une lettre", desc: "Adressée à la personne, jamais publiée" },
  { emoji: "🎶", title: "Créer une playlist", desc: "Une bande-son des souvenirs partagés" },
  { emoji: "📷", title: "Album souvenir", desc: "Un espace privé pour rassembler les photos" },
];

const resources = [
  { title: "Traverser un deuil", author: "Association Empreintes", duration: "12 min", tag: "Guide" },
  { title: "Parler du décès aux enfants", author: "Dr. Marie Rondeau", duration: "8 min", tag: "Article" },
  { title: "Rituels d'hommage laïcs", author: "Fondation Œuvre de la Croix", duration: "15 min", tag: "Podcast" },
  { title: "Après les obsèques : et maintenant ?", author: "Vivre son deuil", duration: "10 min", tag: "Article" },
];

const helplines = [
  { name: "SOS Amitié", desc: "Écoute anonyme, 24 h / 24, 7 j / 7", phone: "09 72 39 40 50" },
  { name: "Vivre son deuil", desc: "Association nationale d'accompagnement", phone: "01 42 38 07 08" },
  { name: "Empreintes", desc: "Deuil périnatal et infantile", phone: "01 42 38 08 08" },
];

function Care() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Espace entraide</p>
        <span className="w-9" />
      </div>

      <section
        className="px-4 pb-10 pt-8 text-center"
        style={{ background: "linear-gradient(180deg, hsl(var(--accent)/0.5) 0%, transparent 100%)" }}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
          <HeartHandshake className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-serif text-3xl leading-tight">Vous n'êtes<br />pas seul·e</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          Un espace doux pour honorer, se souvenir et être accompagné·e dans les moments difficiles.
        </p>
      </section>

      <section className="px-4">
        <div className="rounded-3xl border border-primary/25 bg-primary/5 p-5">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Créer un hommage
          </p>
          <p className="mt-2 font-serif text-xl leading-tight">Un lieu privé pour se souvenir ensemble.</p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Rassemblez photos, messages vocaux et souvenirs en un espace sécurisé, accessible uniquement aux proches invités.
          </p>
          <Link
            to="/app/create"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"
          >
            <Flower2 className="h-3.5 w-3.5" /> Ouvrir un espace d'hommage
          </Link>
        </div>
      </section>

      <section className="mt-8 px-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Sun className="h-3.5 w-3.5" /> Petits rituels
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {rituals.map((r) => (
            <button key={r.title} className="rounded-2xl bg-card p-3.5 text-left ring-1 ring-border/60">
              <span className="text-3xl">{r.emoji}</span>
              <p className="mt-2 text-sm font-semibold">{r.title}</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">{r.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 px-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" /> Ressources choisies
        </p>
        <ul className="space-y-2">
          {resources.map((r) => (
            <li key={r.title}>
              <button className="flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left ring-1 ring-border/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                      {r.tag}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{r.duration}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold">{r.title}</p>
                  <p className="truncate text-[10px] text-muted-foreground">Par {r.author}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> Cercle de parole
        </p>
        <div className="rounded-3xl border border-accent/40 bg-accent/20 p-5">
          <p className="font-serif text-xl leading-tight">Groupes d'écoute anonymes</p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Rejoignez un cercle animé par un accompagnant certifié. 6 personnes maximum, ambiance douce et confidentielle.
          </p>
          <div className="mt-4 space-y-2">
            {[
              { day: "Lundi", time: "20 h – 21 h 30", host: "Marie L.", topic: "Après la perte" },
              { day: "Jeudi", time: "19 h – 20 h 30", host: "Antoine P.", topic: "Deuil périnatal" },
            ].map((s) => (
              <div key={s.day} className="flex items-center justify-between rounded-2xl bg-background/70 p-3">
                <div>
                  <p className="text-xs font-semibold">{s.day} · {s.time}</p>
                  <p className="text-[10px] text-muted-foreground">Animé par {s.host} · {s.topic}</p>
                </div>
                <button className="rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold text-background">
                  Rejoindre
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 px-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Phone className="h-3.5 w-3.5" /> Lignes d'écoute
        </p>
        <ul className="space-y-2">
          {helplines.map((h) => (
            <li key={h.name} className="flex items-center gap-3 rounded-2xl bg-card p-3.5 ring-1 ring-border/60">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{h.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{h.desc}</p>
              </div>
              <a
                href={`tel:${h.phone.replace(/\s/g, "")}`}
                className="rounded-full bg-primary px-3 py-2 text-[10px] font-bold text-primary-foreground"
              >
                Appeler
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <div className="rounded-3xl bg-secondary/60 p-5 text-center">
          <MessageCircle className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-3 font-serif text-xl leading-tight">Une question, un besoin ?</p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Notre équipe bien-être répond avec attention sous 24 h.
          </p>
          <a
            href="mailto:care@memento.live"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-background px-4 py-2.5 text-xs font-semibold ring-1 ring-border"
          >
            care@memento.live
          </a>
        </div>
      </section>

      <p className="mt-8 px-6 text-center text-[11px] leading-relaxed text-muted-foreground">
        Si vous ressentez une détresse immédiate, contactez le 3114 — numéro national de prévention du suicide, gratuit et anonyme, 24 h / 24.
      </p>
    </div>
  );
}
