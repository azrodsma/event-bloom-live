import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Check, PartyPopper, HelpCircle, UserX, CalendarDays, MapPin } from "lucide-react";
import { useState } from "react";
import { getEventBySlug } from "@/lib/events.functions";
import { submitRsvp } from "@/lib/rsvp.functions";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";

const routeLoader = async ({ params }: { params: { slug: string } }) => {
    const ev = await getEventBySlug({ data: { slug: params.slug } });
    if (!ev) throw notFound();
    return { event: ev };
  };
type RouteLoaderData = Awaited<ReturnType<typeof routeLoader>>;

export const Route = createFileRoute("/rsvp/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `RSVP — ${params.slug} — MaFeliza` },
      { name: "description", content: "Confirmez votre présence à l'événement." },
      { property: "og:title", content: "Vous êtes invité(e) — MaFeliza" },
      { property: "og:description", content: "Répondez à l'invitation en quelques secondes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
          { name: "robots", content: "noindex" },
],
  }),
  loader: routeLoader,
  errorComponent: ({ error }) => (
    <div className="grid min-h-dvh place-items-center bg-gradient-mesh px-4 py-16">
      <div className="w-full max-w-md rounded-[32px] bg-surface/85 p-8 text-center shadow-modal ring-1 ring-border backdrop-blur-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="mt-5 font-serif text-3xl">Oups</p>
        <div className="rule-gold mx-auto mt-3 w-14" />
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <Link
          to="/events"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Voir les événements
        </Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center bg-gradient-mesh px-4 py-16">
      <div className="w-full max-w-md rounded-[32px] bg-surface/85 p-8 text-center shadow-modal ring-1 ring-border backdrop-blur-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="mt-5 font-serif text-3xl">Événement introuvable</p>
        <div className="rule-gold mx-auto mt-3 w-14" />
        <p className="mt-3 text-sm text-muted-foreground">
          Ce lien d'invitation n'est plus valide. Demandez un nouveau lien aux organisateurs.
        </p>
        <Link
          to="/events"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Voir les événements
        </Link>
      </div>
    </div>
  ),

  component: RsvpPage,
});

function RsvpPage() {
  const { event } = Route.useLoaderData() as RouteLoaderData;
  const submit = useServerFn(submitRsvp);
  const [status, setStatus] = useState<"confirmed" | "declined" | "maybe">("confirmed");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plusOnes, setPlusOnes] = useState(0);
  const [dietary, setDietary] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  const mut = useMutation({
    mutationFn: () => submit({
      data: {
        slug: event.slug,
        full_name: fullName,
        email,
        phone: phone || null,
        rsvp: status,
        plus_ones: plusOnes,
        dietary: dietary || null,
        notes: notes || null,
      },
    }),
    onSuccess: () => { setDone(true); toast.success("Merci ! Votre réponse est enregistrée."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const dateStr = event.event_date
    ? new Date(event.event_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md px-5 py-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-white"><Check className="h-8 w-8" /></div>
          <h1 className="mt-4 font-serif text-3xl">Réponse enregistrée</h1>
          <p className="mt-2 text-sm text-muted-foreground">Merci d'avoir répondu à l'invitation de {event.title}. Les organisateurs sont notifiés.</p>
          <Link to="/events/$slug" params={{ slug: event.slug }} className="mt-6 inline-block rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow">
            Découvrir l'événement
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="module-page bg-gradient-mesh">
      <header className="relative h-64 md:h-80">
        {event.cover_url && <img src={event.cover_url} alt={`Photo de ${event.title}`} className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/80" />
        <Link to="/" className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="absolute inset-x-0 bottom-14 mx-auto md:bottom-16 max-w-3xl px-5 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-light">Vous êtes invité(e)</p>
          <h1 className="mt-1.5 font-serif text-3xl leading-tight drop-shadow md:text-5xl">{event.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-95 md:text-sm">
            {dateStr && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{dateStr}</span>}
            {event.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.location}</span>}
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-6 max-w-3xl px-4 pb-14 sm:px-5">
        <div className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-elegant backdrop-blur-xl sm:p-7">
          <div className="space-y-5">
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Votre réponse</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {([
                  { k: "confirmed", label: "Je viens", Icon: PartyPopper },
                  { k: "maybe", label: "Peut-être", Icon: HelpCircle },
                  { k: "declined", label: "Absent", Icon: UserX },
                ] as const).map((o) => (
                  <button
                    key={o.k}
                    onClick={() => setStatus(o.k)}
                    className={`rounded-2xl border-2 p-3 text-center text-xs font-semibold transition sm:p-4 ${
                      status === o.k
                        ? "border-primary bg-primary-light text-primary shadow-glow"
                        : "border-border bg-background text-foreground hover:border-primary/40"
                    }`}
                  >
                    <o.Icon className="mx-auto h-5 w-5" />
                    <div className="mt-1.5">{o.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rule-gold" />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Nom complet *" value={fullName} onChange={setFullName} placeholder="Prénom et nom" />
              <FormField label="Email *" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" />
              <FormField label="Téléphone" type="tel" value={phone} onChange={setPhone} placeholder="+33..." />
              {status === "confirmed" && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accompagnants</label>
                  <div className="mt-1 flex items-center justify-between rounded-2xl border border-border bg-background px-3 py-2">
                    <button aria-label="Retirer un accompagnant" onClick={() => setPlusOnes(Math.max(0, plusOnes - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-lg leading-none transition hover:bg-primary-light">−</button>
                    <span className="font-serif text-xl">{plusOnes}</span>
                    <button aria-label="Ajouter un accompagnant" onClick={() => setPlusOnes(Math.min(10, plusOnes + 1))} className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-lg leading-none transition hover:bg-primary-light">+</button>
                  </div>
                </div>
              )}
              {status === "confirmed" && (
                <div className="sm:col-span-2">
                  <FormField label="Régime alimentaire" value={dietary} onChange={setDietary} placeholder="Végé, allergies, sans gluten..." />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Un mot pour les mariés / hôtes</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Optionnel" />
              </div>
            </div>

            <button
              disabled={mut.isPending || !fullName || !email}
              onClick={() => mut.mutate()}
              className="w-full rounded-full bg-gradient-primary py-4 text-sm font-bold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
            >
              {mut.isPending ? "Envoi..." : "Envoyer ma réponse"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Votre réponse est transmise uniquement aux organisateurs de l'événement.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          MaFeliza · Le cadre de vos plus beaux événements
        </p>
      </main>
    </div>
  );
}


function FormField({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

