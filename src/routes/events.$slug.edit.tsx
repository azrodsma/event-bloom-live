import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent } from "@/lib/mock-data";
import { ChevronLeft, Save, Calendar, MapPin, Radio, Gift, Lock, Globe, Trash2, Camera } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/edit")({
  head: ({ params }) => ({
    meta: [
      { title: `Modifier l'événement — Memento Live` },
      { name: "description", content: `Modifier les paramètres de ${params.slug}` },
    ],
  }),
  loader: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) throw notFound();
    return { event: e };
  },
  component: EditEvent,
});

function EditEvent() {
  const { event } = Route.useLoaderData();
  const [visibility, setVisibility] = useState(event.visibility);
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link
          to="/events/$slug"
          params={{ slug: event.slug }}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 font-serif text-xl">Modifier l'événement</h1>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        {/* Cover */}
        <section className="overflow-hidden rounded-3xl bg-surface shadow-card">
          <div className="relative h-40 w-full">
            <img src={event.cover} alt="" className="h-full w-full object-cover" />
            <button className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-card backdrop-blur">
              <Camera className="h-3.5 w-3.5" /> Changer la photo
            </button>
          </div>
        </section>

        {/* Basics */}
        <section className="space-y-3 rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informations</p>
          <Field label="Titre de l'événement" defaultValue={event.title} />
          <Field label="Organisateur·rice·s" defaultValue={event.organizers} />
          <Field label="Description" defaultValue={event.description} multiline />
        </section>

        {/* Date & venue */}
        <section className="space-y-3 rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date & lieu</p>
          </div>
          <Field label="Date" type="date" defaultValue={event.date.slice(0, 10)} />
          <Field label="Lieu" defaultValue={event.venue} icon={<MapPin className="h-3.5 w-3.5" />} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ville" defaultValue={event.city} />
            <Field label="Pays" defaultValue={event.country} />
          </div>
        </section>

        {/* Visibility */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confidentialité</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["private", "public"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-colors ${
                  visibility === v ? "border-primary bg-primary-light" : "border-border bg-background"
                }`}
              >
                {v === "private" ? <Lock className="h-4 w-4 text-primary" /> : <Globe className="h-4 w-4 text-primary" />}
                <span className="font-serif text-base">{v === "private" ? "Privé" : "Public"}</span>
                <span className="text-[11px] text-muted-foreground">
                  {v === "private" ? "Uniquement sur invitation" : "Visible dans l'exploration"}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Live */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diffusion en direct</p>
          </div>
          <Field
            label="URL YouTube ou Twitch"
            defaultValue={event.livestream?.url ?? ""}
            placeholder="https://youtube.com/watch?v=…"
          />
          <p className="mt-2 text-[11px] text-muted-foreground">
            Memento Live encapsule le player externe. Aucune vidéo n'est stockée sur nos serveurs.
          </p>
        </section>

        {/* Money pot */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cagnotte externe</p>
          </div>
          <div className="mt-3 space-y-3">
            <Field label="Plateforme (Leetchi, Lydia…)" defaultValue={event.moneyPot?.platform ?? ""} />
            <Field label="Lien vers la cagnotte" defaultValue={event.moneyPot?.url ?? ""} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Objectif" type="number" defaultValue={String(event.moneyPot?.target ?? "")} />
              <Field label="Devise" defaultValue={event.moneyPot?.currency ?? "EUR"} />
            </div>
          </div>
          <p className="mt-3 rounded-2xl bg-gold-light/60 p-3 text-[11px] text-foreground/80">
            💡 Memento Live ne collecte ni ne conserve les fonds. Toute la gestion financière reste sur la plateforme externe.
          </p>
        </section>

        {/* Danger */}
        <section className="rounded-3xl border border-destructive/20 bg-destructive/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-destructive">Zone sensible</p>
          <button className="mt-3 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-background px-4 py-2 text-xs font-semibold text-destructive">
            <Trash2 className="h-3.5 w-3.5" /> Supprimer cet événement
          </button>
        </section>
      </main>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-16 z-10 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold"
          >
            Annuler
          </Link>
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
          >
            <Save className="h-4 w-4" /> {saved ? "Enregistré ✓" : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
  multiline,
  placeholder,
  icon,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {multiline ? (
        <textarea
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
      ) : (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 focus-within:border-primary">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      )}
    </label>
  );
}
