import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { eventTypes } from "@/lib/mock-data";
import { eventIcon } from "@/lib/event-icons";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Gift, Radio, Sparkles } from "lucide-react";
import { createEvent } from "@/lib/events.functions";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/create")({
  head: () => ({
    meta: [
      { title: "Créer un événement — Memento Live" },
      { name: "description", content: "Créez votre événement en quelques étapes." },
    ],
  }),
  component: CreatePage,
});

const steps = ["Type", "Infos", "Confidentialité", "Cagnotte", "Live", "Récap"] as const;

const typeMap: Record<string, "wedding" | "baptism" | "birthday" | "anniversary" | "engagement" | "babyshower" | "other"> = {
  "Mariage": "wedding",
  "Baptême": "baptism",
  "Anniversaire": "birthday",
  "Fiançailles": "engagement",
  "Baby Shower": "babyshower",
};

function CreatePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const createFn = useServerFn(createEvent);
  const [step, setStep] = useState(0);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"private" | "unlisted" | "public">("unlisted");
  const [cagnotteUrl, setCagnotteUrl] = useState("");
  const [cagnotteGoal, setCagnotteGoal] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const mut = useMutation({
    mutationFn: () => {
      const iso = date ? new Date(`${date}T${time || "18:00"}:00`).toISOString() : null;
      return createFn({
        data: {
          title: title.trim(),
          type: typeMap[selectedType ?? ""] ?? "other",
          event_date: iso,
          location: location || null,
          description: description || null,
          cover_url: null,
          visibility,
          cagnotte_url: cagnotteUrl || null,
          cagnotte_goal: cagnotteGoal ? Number(cagnotteGoal) : null,
          live_url: liveUrl || null,
        },
      });
    },
    onSuccess: (ev) => {
      toast.success("Événement créé !");
      navigate({ to: "/events/$slug", params: { slug: ev.slug } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!loading && !user) {
    return (
      <div className="p-6 text-center">
        <p className="font-serif text-xl">Connectez-vous pour créer un événement</p>
        <Link to="/auth" className="mt-4 inline-block rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white">Se connecter</Link>
      </div>
    );
  }

  const canNext = step === 0 ? !!selectedType : step === 1 ? title.trim().length >= 2 : true;

  return (
    <div className="space-y-5 px-4 py-4 pb-24">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Étape {step + 1} / {steps.length}</p>
        <h1 className="mt-1 font-serif text-3xl">{steps[step]}</h1>
      </div>
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-gradient-primary" : "bg-border"}`} />
        ))}
      </div>

      <div className="rounded-3xl bg-surface p-5 shadow-card">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {eventTypes.map((t) => (
              <button key={t} onClick={() => setSelectedType(t)}
                className={`rounded-2xl border p-4 text-left transition ${selectedType === t ? "border-primary bg-primary-light shadow-glow" : "border-border bg-background hover:border-primary/40"}`}>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-primary">{(() => { const I = eventIcon(t); return <I className="h-5 w-5" />; })()}</div>
                <div className="mt-2 text-sm font-semibold">{t}</div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Field label="Nom de l'événement *" value={title} onChange={setTitle} placeholder="Ex. Sarah & Thomas" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" type="date" value={date} onChange={setDate} />
              <Field label="Heure" type="time" value={time} onChange={setTime} />
            </div>
            <Field label="Lieu" value={location} onChange={setLocation} placeholder="Ex. Château La Rose, Bordeaux" />
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="Décrivez votre événement..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {(["public", "unlisted", "private"] as const).map((v) => (
              <button key={v} onClick={() => setVisibility(v)}
                className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left ${visibility === v ? "border-primary bg-primary-light" : "border-border bg-background"}`}>
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${visibility === v ? "border-primary bg-primary" : "border-border"}`}>
                  {visibility === v && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{v === "public" ? "Public" : v === "unlisted" ? "Privé par lien" : "Privé strict"}</span>
                  <span className="block text-xs text-muted-foreground">
                    {v === "public" ? "Visible dans Explorer, RSVP ouverts." : v === "unlisted" ? "Accessible uniquement via lien secret ou QR." : "Seuls les invités connectés voient l'événement."}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-gold-light p-4 text-sm">
              <Gift className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <p><strong>Cagnotte externe.</strong> Memento Live ne collecte pas les fonds. Collez le lien Leetchi, Lydia, PayPal Pool…</p>
            </div>
            <Field label="Lien de la cagnotte" value={cagnotteUrl} onChange={setCagnotteUrl} placeholder="https://leetchi.com/..." />
            <Field label="Objectif (€)" type="number" value={cagnotteGoal} onChange={setCagnotteGoal} placeholder="7000" />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-secondary-light p-4 text-sm">
              <Radio className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>Le live est diffusé via <strong>YouTube Live</strong> ou <strong>Twitch</strong>. Collez l'URL de diffusion (optionnel, modifiable plus tard).</p>
            </div>
            <Field label="URL du live" value={liveUrl} onChange={setLiveUrl} placeholder="https://youtube.com/watch?v=..." />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Vérifiez les informations avant de créer votre événement.</p>
            <Row k="Type" v={selectedType ?? "—"} />
            <Row k="Titre" v={title || "—"} />
            <Row k="Date" v={date ? `${date} ${time}` : "—"} />
            <Row k="Lieu" v={location || "—"} />
            <Row k="Visibilité" v={visibility === "public" ? "Public" : visibility === "unlisted" ? "Privé par lien" : "Privé strict"} />
            {cagnotteUrl && <Row k="Cagnotte" v={cagnotteUrl} />}
            {liveUrl && <Row k="Live" v={liveUrl} />}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
        )}
        {step < steps.length - 1 ? (
          <button disabled={!canNext} onClick={() => setStep(step + 1)}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
            Continuer <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button disabled={mut.isPending} onClick={() => mut.mutate()}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
            {mut.isPending ? "Création..." : (<>Créer l'événement <Sparkles className="h-4 w-4" /></>)}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-background px-3 py-2 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="truncate font-medium">{v}</span>
    </div>
  );
}



