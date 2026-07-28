import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Heart, Utensils, Users, Sparkles, Baby, Wheat, Wine } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getEventBySlug } from "@/lib/events.functions";
import { submitRsvp } from "@/lib/rsvp.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/events/$slug/rsvp")({
  component: Rsvp,
  head: ({ params }) => ({
    meta: [
      { title: `Confirmer ma présence · ${params.slug} — Memento Live` },
      { name: "description", content: "Confirmez votre présence et vos préférences." },
      { property: "og:title", content: "Confirmer ma présence · Memento Live" },
      { property: "og:description", content: "Répondez à l'invitation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params }) => {
    const ev = await getEventBySlug({ data: { slug: params.slug } });
    if (!ev) throw notFound();
    return { event: ev };
  },
});

type Attend = "yes" | "no" | "maybe";
type Diet = "std" | "veg" | "vegan" | "sansGluten" | "enfant";

const attendMeta: Record<Attend, { label: string; color: string; value: "confirmed" | "declined" | "maybe" }> = {
  yes: { label: "Avec joie ✨", color: "border-primary bg-primary/10 text-primary", value: "confirmed" },
  maybe: { label: "Peut-être", color: "border-accent bg-accent/20 text-foreground", value: "maybe" },
  no: { label: "Impossible", color: "border-border bg-muted text-muted-foreground", value: "declined" },
};

const dietOptions: Array<{ id: Diet; label: string; icon: typeof Utensils }> = [
  { id: "std", label: "Standard", icon: Utensils },
  { id: "veg", label: "Végétarien", icon: Wheat },
  { id: "vegan", label: "Vegan", icon: Sparkles },
  { id: "sansGluten", label: "Sans gluten", icon: Wine },
  { id: "enfant", label: "Enfant", icon: Baby },
];

function Rsvp() {
  const { event } = Route.useLoaderData();
  const { slug } = useParams({ from: "/events/$slug/rsvp" });
  const submit = useServerFn(submitRsvp);

  const [step, setStep] = useState(0);
  const [attend, setAttend] = useState<Attend | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plusOnes, setPlusOnes] = useState(0);
  const [diet, setDiet] = useState<Diet>("std");
  const [dietNote, setDietNote] = useState("");
  const [note, setNote] = useState("");
  const [songs, setSongs] = useState("");
  const [sending, setSending] = useState(false);

  const totalSteps = 5;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const canNext =
    (step === 0 && attend !== null) ||
    (step === 1 && name.trim().length > 1 && /.+@.+\..+/.test(email)) ||
    step === 2 ||
    step === 3 ||
    step === 4;

  async function next() {
    if (step === totalSteps - 2) {
      if (!attend) return;
      setSending(true);
      try {
        await submit({
          data: {
            slug,
            full_name: name.trim(),
            email: email.trim(),
            rsvp: attendMeta[attend].value,
            plus_ones: plusOnes,
            dietary: [dietOptions.find((d) => d.id === diet)?.label, dietNote.trim()].filter(Boolean).join(" · ") || null,
            notes: [note.trim(), songs.trim() ? `Morceau : ${songs.trim()}` : null].filter(Boolean).join("\n") || null,
          },
        });
        toast.success("Réponse enregistrée ✨");
        setStep(totalSteps - 1);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erreur");
      } finally {
        setSending(false);
      }
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/60 via-background to-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">RSVP</p>
        <span className="text-xs font-medium text-muted-foreground">{step + 1}/{totalSteps}</span>
      </div>

      <div className="h-1 bg-secondary">
        <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      <section className="px-6 pt-8 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Vous êtes invité·e à</p>
        <h1 className="mt-2 font-serif text-3xl leading-tight">{event.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {event.event_date ? new Date(event.event_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""}
        </p>
      </section>

      <div className="mx-auto mt-8 max-w-md px-4">
        {step === 0 && (
          <div>
            <h2 className="font-serif text-2xl">Serez-vous des nôtres ?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Votre présence nous ferait un immense plaisir.</p>
            <div className="mt-6 space-y-3">
              {(Object.keys(attendMeta) as Attend[]).map((k) => {
                const meta = attendMeta[k];
                const active = attend === k;
                return (
                  <button
                    key={k}
                    onClick={() => setAttend(k)}
                    className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                      active ? meta.color + " shadow-glow" : "border-border bg-card"
                    }`}
                  >
                    <span className="font-serif text-lg">{meta.label}</span>
                    {active && (
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-serif text-2xl">Qui répond ?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Nom et email pour vous envoyer les infos pratiques.</p>
            <label className="mt-6 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Nom complet</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Prénom NOM"
              autoFocus
              className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary"
            />
            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.fr"
              className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary"
            />

            {attend !== "no" && (
              <>
                <label className="mt-6 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Accompagnants</label>
                <div className="mt-1.5 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Vous + {plusOnes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPlusOnes(Math.max(0, plusOnes - 1))}
                      className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background"
                      aria-label="Retirer"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{plusOnes}</span>
                    <button
                      onClick={() => setPlusOnes(Math.min(5, plusOnes + 1))}
                      className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background"
                      aria-label="Ajouter"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-serif text-2xl">Régime alimentaire</h2>
            <p className="mt-1 text-sm text-muted-foreground">Précisions bienvenues pour le traiteur.</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {dietOptions.map((d) => {
                const Icon = d.icon;
                const active = diet === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDiet(d.id)}
                    className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left ${
                      active ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{d.label}</span>
                  </button>
                );
              })}
            </div>
            <textarea
              value={dietNote}
              onChange={(e) => setDietNote(e.target.value)}
              placeholder="Allergie, intolérance particulière…"
              className="mt-4 min-h-[80px] w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-serif text-2xl">Un mot pour nous ?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Message doux, blague, souvenir… tout est bienvenu.</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Vos mots pour la journée…"
              className="mt-4 min-h-[140px] w-full resize-none rounded-2xl border border-border bg-card px-4 py-4 text-sm outline-none focus:border-primary"
            />
            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Un morceau à absolument entendre ?
            </label>
            <input
              value={songs}
              onChange={(e) => setSongs(e.target.value)}
              placeholder="Ex. September – Earth, Wind & Fire"
              className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-glow">
              <Heart className="h-10 w-10 fill-current" />
            </div>
            <h2 className="mt-6 font-serif text-3xl leading-tight">Merci {name || "à vous"} 💌</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Votre réponse a bien été enregistrée. Vous recevrez tous les détails pratiques par email.
            </p>
            <div className="mt-6 rounded-3xl border border-border/60 bg-card p-5 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Récapitulatif</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-muted-foreground">Présence</span><span className="font-medium">{attend ? attendMeta[attend].label : "—"}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Personnes</span><span className="font-medium">{1 + plusOnes}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Régime</span><span className="font-medium">{dietOptions.find((d) => d.id === diet)?.label}</span></li>
              </ul>
            </div>
            <Link
              to="/events/$slug"
              params={{ slug }}
              className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
            >
              Revenir à l'événement
            </Link>
          </div>
        )}
      </div>

      {step < totalSteps - 1 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-md gap-2">
            {step > 0 && (
              <button onClick={back} className="rounded-full border border-border px-5 py-3 text-sm font-medium">
                Retour
              </button>
            )}
            <button
              onClick={next}
              disabled={!canNext || sending}
              className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              {sending ? "Envoi…" : step === totalSteps - 2 ? "Envoyer ma réponse" : "Continuer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
