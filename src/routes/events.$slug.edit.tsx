import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Save, Calendar, MapPin, Radio, Lock, Globe } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getEventBySlug, updateEvent } from "@/lib/events.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/events/$slug/edit")({
  head: ({ params }) => ({
    meta: [
      { title: `Modifier l'événement — MaFeliza` },
      { name: "description", content: `Modifier les paramètres de ${params.slug}` },
    ],
  }),
  loader: async ({ params }) => {
    const e = await getEventBySlug({ data: { slug: params.slug } });
    if (!e) throw notFound();
    return { event: e };
  },
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Événement introuvable</div>,
  component: EditEvent,
});

const types = [
  ["wedding", "Mariage"],
  ["baptism", "Baptême"],
  ["birthday", "Anniversaire"],
  ["anniversary", "Anniversaire de couple"],
  ["engagement", "Fiançailles"],
  ["babyshower", "Baby shower"],
  ["other", "Autre"],
] as const;

function EditEvent() {
  const { event } = Route.useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const update = useServerFn(updateEvent);

  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState<(typeof types)[number][0]>(event.type as (typeof types)[number][0]);
  const [description, setDescription] = useState(event.description ?? "");
  const [location, setLocation] = useState(event.location ?? "");
  const [eventDate, setEventDate] = useState(event.event_date ? event.event_date.slice(0, 16) : "");
  const [coverUrl, setCoverUrl] = useState(event.cover_url ?? "");
  const [liveUrl, setLiveUrl] = useState(event.live_url ?? "");
  const [visibility, setVisibility] = useState<"private" | "unlisted" | "public">(
    (event.visibility as "private" | "unlisted" | "public") ?? "unlisted",
  );

  const canEdit = user?.id === event.owner_id;

  const mut = useMutation({
    mutationFn: () =>
      update({
        data: {
          eventId: event.id,
          title: title.trim(),
          type,
          description: description.trim() || null,
          location: location.trim() || null,
          event_date: eventDate ? new Date(eventDate).toISOString() : null,
          cover_url: coverUrl.trim() || null,
          live_url: liveUrl.trim() || null,
          visibility,
        },
      }),
    onSuccess: () => {
      toast.success("Événement mis à jour");
      navigate({ to: "/events/$slug", params: { slug: event.slug } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  return (
    <div className="module-page">
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
        {!canEdit && (
          <p className="rounded-2xl bg-live/10 p-3 text-center text-sm text-live">
            Seul l'organisateur peut modifier cet événement.
          </p>
        )}

        <section className="space-y-3 rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informations</p>
          <Field label="Titre" value={title} onChange={setTitle} disabled={!canEdit} />
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Type</p>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              disabled={!canEdit}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
            >
              {types.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <Field label="Description" value={description} onChange={setDescription} multiline disabled={!canEdit} />
          <Field label="URL de la photo de couverture" value={coverUrl} onChange={setCoverUrl} disabled={!canEdit} />
        </section>

        <section className="space-y-3 rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date & lieu</p>
          </div>
          <Field label="Date" type="datetime-local" value={eventDate} onChange={setEventDate} disabled={!canEdit} />
          <Field label="Lieu" value={location} onChange={setLocation} icon={<MapPin className="h-3.5 w-3.5" />} disabled={!canEdit} />
        </section>

        <section className="space-y-3 rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-live" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diffusion en direct</p>
          </div>
          <Field
            label="URL YouTube ou Twitch"
            placeholder="https://youtube.com/watch?v=… ou https://twitch.tv/chaîne"
            value={liveUrl}
            onChange={setLiveUrl}
            disabled={!canEdit}
          />
          <p className="text-[11px] text-muted-foreground">
            MaFeliza encapsule votre live externe — aucun coût d'hébergement vidéo côté plateforme.
          </p>
        </section>

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confidentialité</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {([
              ["private", "Privé", Lock],
              ["unlisted", "Non répertorié", Globe],
              ["public", "Public", Globe],
            ] as const).map(([v, label, Icon]) => (
              <button
                key={v}
                onClick={() => canEdit && setVisibility(v)}
                disabled={!canEdit}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-colors ${
                  visibility === v ? "border-primary bg-primary-light" : "border-border bg-background"
                } disabled:opacity-60`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-16 z-10 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => mut.mutate()}
          disabled={!canEdit || mut.isPending}
          className="mx-auto flex w-full max-w-2xl items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {mut.isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  icon,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon} {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
        />
      )}
    </label>
  );
}
