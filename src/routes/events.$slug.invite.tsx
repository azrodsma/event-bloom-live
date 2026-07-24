import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Copy, Check, Mail, MessageCircle, Facebook, Download, QrCode } from "lucide-react";
import { findEvent, eventTypeIcons } from "@/lib/mock-data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/invite")({
  head: ({ params }) => ({
    meta: [
      { title: `Invitation — ${params.slug} — Memento Live` },
      { name: "description", content: "Partagez votre événement à vos invités." },
    ],
  }),
  loader: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) throw notFound();
    return { event: e };
  },
  component: Invite,
});

function Invite() {
  const { event } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const url = `https://memento.live/join/${event.slug}`;
  const code = useMemo(
    () => event.slug.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase().padEnd(6, "X"),
    [event.slug]
  );
  // Deterministic decorative QR-like grid
  const cells = useMemo(() => {
    const grid: boolean[] = [];
    let h = 0;
    for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
    for (let i = 0; i < 21 * 21; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      grid.push((h & 3) === 0);
    }
    return grid;
  }, [url]);

  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const dateStr = new Date(event.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Invitations & partage</h1>
            <p className="truncate text-xs text-muted-foreground">{event.title}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-5">
        {/* Faire-part */}
        <section className="overflow-hidden rounded-[32px] border border-gold/40 bg-surface shadow-card">
          <div className="relative aspect-[3/4] max-h-[520px]">
            <img src={event.cover} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center text-white">
              <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur">
                {eventTypeIcons[event.type as keyof typeof eventTypeIcons]} {event.type}
              </span>
              <p className="mt-2 font-serif text-sm italic">Vous êtes cordialement invité(e) à célébrer</p>
              <h2 className="font-serif text-4xl leading-tight">{event.title}</h2>
              <div className="my-2 h-px w-16 bg-gold" />
              <p className="text-sm">{dateStr}</p>
              <p className="text-xs opacity-90">{event.venue} · {event.city}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gold/30 bg-cream p-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Code d'accès</p>
              <p className="font-serif text-2xl tracking-[0.3em] text-primary">{code}</p>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-xs font-semibold text-white shadow-glow">
              <Download className="h-4 w-4" /> Télécharger
            </button>
          </div>
        </section>

        {/* QR + Lien */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground">
            <QrCode className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Accès rapide</p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="grid aspect-square w-40 shrink-0 grid-cols-[repeat(21,1fr)] gap-[1px] rounded-2xl border-4 border-foreground bg-foreground p-1">
              {cells.map((on, i) => (
                <div
                  key={i}
                  className={on ? "bg-foreground" : "bg-background"}
                  style={{ borderRadius: 1 }}
                />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Lien de l'événement</p>
              <div className="mt-1 flex items-center gap-2 rounded-full bg-cream px-3 py-2">
                <span className="truncate text-sm font-medium">{url}</span>
                <button
                  onClick={copy}
                  className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Vos invités peuvent scanner le QR code ou saisir le code <span className="font-semibold text-primary">{code}</span> sur la page « Rejoindre ».
              </p>
            </div>
          </div>
        </section>

        {/* Partage */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Partager par…</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "SMS", icon: MessageCircle, color: "bg-primary" },
              { label: "Email", icon: Mail, color: "bg-gold" },
              { label: "WhatsApp", icon: MessageCircle, color: "bg-success" },
              { label: "Facebook", icon: Facebook, color: "bg-foreground" },
            ].map(({ label, icon: Icon, color }) => (
              <button key={label} className="flex flex-col items-center gap-2">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl text-white shadow-card ${color}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Guests */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-lg">Liste d'invités</p>
              <p className="text-xs text-muted-foreground">124 invités · 87 confirmés · 12 en attente</p>
            </div>
            <button className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold">Gérer</button>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary-light">
            <div className="h-full w-[70%] rounded-full bg-gradient-primary" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">70% des invités ont confirmé leur présence.</p>
        </section>
      </main>
    </div>
  );
}
