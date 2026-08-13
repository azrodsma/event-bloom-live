import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
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
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <p className="font-serif text-2xl">Oups</p>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <p className="font-serif text-2xl">Événement introuvable</p>
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
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-white text-3xl">✓</div>
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
    <div className="module-page">
      <header className="relative h-56">
        {event.cover_url && <img src={event.cover_url} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
        <Link to="/" className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="absolute inset-x-0 bottom-4 px-5 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-90">Vous êtes invité(e)</p>
          <h1 className="mt-1 font-serif text-3xl leading-tight">{event.title}</h1>
          <p className="text-xs opacity-90">{dateStr}{event.location ? ` · ${event.location}` : ""}</p>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Votre réponse</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { k: "confirmed", label: "Je viens", emoji: "🎉" },
              { k: "maybe", label: "Peut-être", emoji: "🤔" },
              { k: "declined", label: "Absent", emoji: "😔" },
            ] as const).map((o) => (
              <button
                key={o.k}
                onClick={() => setStatus(o.k)}
                className={`rounded-2xl border-2 p-3 text-center text-xs font-semibold transition ${
                  status === o.k ? "border-primary bg-primary-light" : "border-border bg-background"
                }`}
              >
                <div className="text-xl">{o.emoji}</div>
                <div className="mt-1">{o.label}</div>
              </button>
            ))}
          </div>
        </div>

        <FormField label="Nom complet *" value={fullName} onChange={setFullName} placeholder="Prénom et nom" />
        <FormField label="Email *" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" />
        <FormField label="Téléphone" type="tel" value={phone} onChange={setPhone} placeholder="+33..." />

        {status === "confirmed" && (
          <>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accompagnants</label>
              <div className="mt-2 flex items-center gap-3">
                <button onClick={() => setPlusOnes(Math.max(0, plusOnes - 1))} className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-lg">−</button>
                <span className="min-w-[3ch] text-center font-serif text-xl">{plusOnes}</span>
                <button onClick={() => setPlusOnes(Math.min(10, plusOnes + 1))} className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-lg">+</button>
              </div>
            </div>
            <FormField label="Régime alimentaire" value={dietary} onChange={setDietary} placeholder="Végé, allergies, sans gluten..." />
          </>
        )}

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Un mot pour les mariés / hôtes</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Optionnel" />
        </div>

        <button
          disabled={mut.isPending || !fullName || !email}
          onClick={() => mut.mutate()}
          className="w-full rounded-full bg-gradient-primary py-4 text-sm font-bold text-white shadow-glow disabled:opacity-50"
        >
          {mut.isPending ? "Envoi..." : "Envoyer ma réponse"}
        </button>
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

