import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Copy, Check, Mail, MessageCircle, Share2, QrCode, UserPlus, Sparkles } from "lucide-react";
import { getEventBySlug } from "@/lib/events.functions";
import { createGuestInvite } from "@/lib/rsvp.functions";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { QrCodeSvg } from "@/components/QrCodeSvg";

export const Route = createFileRoute("/events/$slug/invite")({
  head: ({ params }) => ({
    meta: [
      { title: `Invitation — ${params.slug} — MaFeliza` },
      { name: "description", content: "Partagez votre événement à vos invités." },
    ],
  }),
  loader: async ({ params }) => {
    const ev = await getEventBySlug({ data: { slug: params.slug } });
    if (!ev) throw notFound();
    return { event: ev };
  },
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Événement introuvable</div>,
  component: Invite,
});

function Invite() {
  const { event } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const [personalName, setPersonalName] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalLink, setPersonalLink] = useState<string | null>(null);
  const [personalCopied, setPersonalCopied] = useState(false);
  const createInvite = useServerFn(createGuestInvite);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://memento.live";
  const rsvpUrl = `${origin}/rsvp/${event.slug}`;
  const eventUrl = `${origin}/events/${event.slug}`;
  const code = useMemo(
    () => event.slug.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase().padEnd(6, "X"),
    [event.slug],
  );

  const copy = () => {
    navigator.clipboard?.writeText(rsvpUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const genMut = useMutation({
    mutationFn: () => createInvite({ data: { eventId: event.id, full_name: personalName.trim(), email: personalEmail.trim() || null } }),
    onSuccess: (row) => {
      const link = `${origin}/i/${row.invite_token}`;
      setPersonalLink(link);
      toast.success("Lien personnel créé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const copyPersonal = () => {
    if (!personalLink) return;
    navigator.clipboard?.writeText(personalLink);
    setPersonalCopied(true);
    setTimeout(() => setPersonalCopied(false), 1600);
  };

  const shareText = `Vous êtes invité(e) à ${event.title}. RSVP : ${rsvpUrl}`;
  const shares = [
    { label: "SMS", href: `sms:?body=${encodeURIComponent(shareText)}`, icon: MessageCircle, color: "bg-primary" },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(`Invitation — ${event.title}`)}&body=${encodeURIComponent(shareText)}`, icon: Mail, color: "bg-gold" },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareText)}`, icon: MessageCircle, color: "bg-success" },
    { label: "Autre", href: eventUrl, icon: Share2, color: "bg-foreground" },
  ];

  const dateStr = event.event_date
    ? new Date(event.event_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="module-page">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link to="/events/$slug" params={{ slug: event.slug }} className="grid h-10 w-10 place-items-center rounded-full bg-surface">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Invitations & partage</h1>
            <p className="truncate text-xs text-muted-foreground">{event.title}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-5">
        {event.cover_url && (
          <section className="overflow-hidden rounded-[32px] border border-gold/40 bg-surface shadow-card">
            <div className="relative aspect-[3/4] max-h-[520px]">
              <img src={event.cover_url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center text-white">
                <p className="font-serif text-sm italic">Vous êtes cordialement invité(e) à célébrer</p>
                <h2 className="font-serif text-4xl leading-tight">{event.title}</h2>
                <div className="my-2 h-px w-16 bg-gold" />
                {dateStr && <p className="text-sm">{dateStr}</p>}
                {event.location && <p className="text-xs opacity-90">{event.location}</p>}
              </div>
            </div>
          </section>
        )}

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground">
            <QrCode className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">QR code · lien RSVP</p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <QrCodeSvg value={rsvpUrl} size={180} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Lien RSVP</p>
              <div className="mt-1 flex items-center gap-2 rounded-full bg-cream px-3 py-2">
                <span className="truncate text-sm font-medium">{rsvpUrl}</span>
                <button onClick={copy} className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Vos invités scannent le QR ou saisissent le code <span className="font-semibold text-primary">{code}</span> pour confirmer leur présence.
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Partager par…</p>
          <div className="grid grid-cols-4 gap-3">
            {shares.map(({ label, icon: Icon, color, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl text-white shadow-card ${color}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Invitation personnelle</p>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Générez un lien unique par invité : le nom est pré-rempli, la réponse peut être modifiée à tout moment, et vous retrouvez chaque personne dans la liste des invités.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={personalName}
              onChange={(e) => setPersonalName(e.target.value)}
              placeholder="Nom de l'invité *"
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
              placeholder="Email (facultatif)"
              type="email"
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            disabled={genMut.isPending || !personalName.trim()}
            onClick={() => genMut.mutate()}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" /> {genMut.isPending ? "Création..." : "Créer un lien personnel"}
          </button>
          {personalLink && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 rounded-full bg-cream px-3 py-2">
                <span className="truncate text-xs font-medium">{personalLink}</span>
                <button onClick={copyPersonal} className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
                  {personalCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="flex gap-2">
                <a href={`sms:?body=${encodeURIComponent(`Vous êtes invité(e) à ${event.title}. Votre lien : ${personalLink}`)}`} className="flex-1 rounded-full border border-border bg-background py-2 text-center text-xs font-semibold">SMS</a>
                <a href={`mailto:${personalEmail}?subject=${encodeURIComponent(`Invitation — ${event.title}`)}&body=${encodeURIComponent(`Bonjour ${personalName},\n\nVous êtes cordialement invité(e) à ${event.title}. Merci de confirmer votre présence via ce lien personnel : ${personalLink}`)}`} className="flex-1 rounded-full border border-border bg-background py-2 text-center text-xs font-semibold">Email</a>
                <a href={`https://wa.me/?text=${encodeURIComponent(`Vous êtes invité(e) à ${event.title}. Votre lien : ${personalLink}`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full border border-border bg-background py-2 text-center text-xs font-semibold">WhatsApp</a>
              </div>
              <p className="text-[11px] text-muted-foreground">Astuce : créez un lien par personne pour suivre les réponses nominativement.</p>
            </div>
          )}
        </section>


        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-lg">Suivi des réponses</p>
              <p className="text-xs text-muted-foreground">Consultez la liste des invités et leurs statuts.</p>
            </div>
            <Link to="/events/$slug/guests" params={{ slug: event.slug }} className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold">
              Ouvrir
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
