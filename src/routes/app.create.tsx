import { createFileRoute, Link } from "@tanstack/react-router";
import { eventTypes, eventTypeIcons } from "@/lib/mock-data";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Radio, Gift, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/create")({
  head: () => ({
    meta: [
      { title: "Créer un événement — Memento Live" },
      { name: "description", content: "Créez votre événement en quelques étapes." },
    ],
  }),
  component: CreatePage,
});

const steps = [
  "Type",
  "Infos",
  "Confidentialité",
  "Cagnotte",
  "Live",
  "Faire-part",
  "Partage",
  "Confirmation",
];

function CreatePage() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-5 px-4 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Étape {step + 1} / {steps.length}
        </p>
        <h1 className="mt-1 font-serif text-3xl">{steps[step]}</h1>
      </div>
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition ${
              i <= step ? "bg-gradient-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="rounded-3xl bg-surface p-5 shadow-card">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {eventTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelected(t)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected === t
                    ? "border-primary bg-primary-light shadow-glow"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <div className="text-2xl">{eventTypeIcons[t]}</div>
                <div className="mt-2 text-sm font-semibold">{t}</div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Field label="Nom de l'événement" placeholder="Ex. Sarah & Thomas" />
            <Field label="Organisateurs" placeholder="Vos noms" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" type="date" />
              <Field label="Heure" type="time" />
            </div>
            <Field label="Lieu" placeholder="Ex. Château La Rose" />
            <Field label="Ville" placeholder="Bordeaux" />
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <textarea rows={4} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Décrivez votre événement..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <RadioCard title="Public" desc="Visible dans Explorer, accessible à tous." />
            <RadioCard title="Privé par code" desc="Uniquement avec le code d'invitation." checked />
            <RadioCard title="Privé par lien" desc="Uniquement via lien secret." />
            <div className="mt-4 space-y-2 rounded-2xl bg-primary-light p-4">
              <Toggle label="Autoriser les commentaires" defaultChecked />
              <Toggle label="Autoriser photos & vidéos invités" defaultChecked />
              <Toggle label="Activer le livre d'or" defaultChecked />
              <Toggle label="Activer la cagnotte" defaultChecked />
              <Toggle label="Activer le live" defaultChecked />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-gold-light p-4 text-sm text-foreground">
              <Gift className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <p>
                <strong>Cagnotte externe.</strong> Memento Live ne collecte pas et ne conserve pas les fonds. Nous affichons le lien vers votre plateforme.
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Plateforme</label>
              <select className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm">
                <option>Leetchi</option><option>Lydia</option><option>OnParticipe</option>
                <option>Tribee</option><option>CotizUp</option><option>PayPal</option><option>Autre</option>
              </select>
            </div>
            <Field label="Titre de la cagnotte" placeholder="Ex. Voyage de noces" />
            <Field label="Lien de la cagnotte" placeholder="https://leetchi.com/..." />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Objectif" type="number" placeholder="7000" />
              <Field label="Montant actuel" type="number" placeholder="0" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-secondary-light p-4 text-sm">
              <Radio className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>
                Le live est diffusé via <strong>YouTube Live</strong> ou <strong>Twitch</strong> pour une stabilité maximale, même en cas de forte affluence.
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Plateforme</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <button className="rounded-2xl border-2 border-primary bg-primary-light px-3 py-3 text-sm font-semibold">▶ YouTube Live</button>
                <button className="rounded-2xl border border-border bg-background px-3 py-3 text-sm font-medium">◉ Twitch</button>
              </div>
            </div>
            <Field label="URL du live principal" placeholder="https://youtube.com/watch?v=..." />
            <Field label="URL de secours (optionnel)" placeholder="https://..." />
            <div className="rounded-2xl border border-dashed border-border p-3 text-xs text-muted-foreground">
              💡 Vous pourrez ajouter d'autres caméras (salle, drone, DJ) plus tard dans votre tableau de bord.
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Choisissez un modèle de faire-part digital.</p>
            <div className="grid grid-cols-3 gap-3">
              {["Classique", "Moderne", "Élégant"].map((m, i) => (
                <button key={m} className={`rounded-2xl border p-3 text-left ${i === 1 ? "border-primary bg-primary-light" : "border-border bg-background"}`}>
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-primary-light to-gold-light" />
                  <div className="mt-2 text-xs font-semibold">{m}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Vos codes ont été générés. Partagez-les avec vos proches et votre caméraman.</p>
            <CodeRow label="Code invité" value="SARAH-2026" />
            <CodeRow label="Code caméraman" value="CAM-9432" />
            <CodeRow label="Lien privé" value="mementolive.app/e/sarah-thomas" />
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium">📱 Partager WhatsApp</button>
              <button className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium">📧 Envoyer par email</button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-white">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-serif text-3xl">Événement créé !</h2>
            <p className="mt-2 text-sm text-muted-foreground">Votre page événement est prête à être partagée.</p>
            <div className="mt-6 space-y-2">
              <Link
                to="/events/$slug"
                params={{ slug: "sarah-thomas" }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow"
              >
                Voir mon événement <Sparkles className="h-4 w-4" />
              </Link>
              <Link
                to="/app"
                className="inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-medium"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </div>

      {step < 7 && (
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
          )}
          <button
            onClick={() => setStep(step + 1)}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow"
          >
            Continuer <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function RadioCard({ title, desc, checked = false }: { title: string; desc: string; checked?: boolean }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${checked ? "border-primary bg-primary-light" : "border-border bg-background"}`}>
      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-primary bg-primary" : "border-border"}`}>
        {checked && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
    </label>
  );
}

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="flex w-full items-center justify-between py-1.5 text-sm"
    >
      <span>{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-border"}`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-5" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

function CodeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-3">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm font-semibold">{value}</p>
      </div>
      <button className="grid h-9 w-9 place-items-center rounded-full bg-primary-light text-primary" aria-label="Copier">
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}
