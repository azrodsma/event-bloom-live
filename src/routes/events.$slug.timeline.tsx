import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Clock, MapPin, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getEventBySlug } from "@/lib/events.functions";
import { listTimeline, createTimelineItem, deleteTimelineItem } from "@/lib/logistics.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/events/$slug/timeline")({
  component: Timeline,
  head: () => ({
    meta: [
      { title: "Programme · Memento Live" },
      { name: "description", content: "Suivez le déroulé complet de l'événement, minute par minute." },
      { property: "og:title", content: "Programme · Memento Live" },
      { property: "og:description", content: "Le déroulé de la journée en un coup d'œil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Timeline() {
  const { slug } = useParams({ from: "/events/$slug/timeline" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchEvent = useServerFn(getEventBySlug);
  const fetchList = useServerFn(listTimeline);
  const addItem = useServerFn(createTimelineItem);
  const removeItem = useServerFn(deleteTimelineItem);

  const { data: event } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent({ data: { slug } }),
  });
  const eventId = event?.id;

  const { data: steps = [], isLoading } = useQuery({
    enabled: !!eventId,
    queryKey: ["timeline", eventId],
    queryFn: () => fetchList({ data: { eventId: eventId! } }),
  });

  const [showAdd, setShowAdd] = useState(false);
  const [timeLabel, setTimeLabel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["timeline", eventId] });

  const addMut = useMutation({
    mutationFn: () =>
      addItem({
        data: {
          eventId: eventId!,
          timeLabel: timeLabel.trim(),
          title: title.trim(),
          description: description.trim() || undefined,
          location: location.trim() || undefined,
        },
      }),
    onSuccess: () => {
      setTimeLabel(""); setTitle(""); setDescription(""); setLocation("");
      setShowAdd(false);
      invalidate();
      toast.success("Moment ajouté");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => removeItem({ data: { id } }),
    onSuccess: invalidate,
  });

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Programme</p>
        <button
          onClick={() => user ? setShowAdd(true) : toast.error("Connecte-toi pour éditer")}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"
          aria-label="Ajouter un moment">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/60 to-background p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Déroulé de la journée</p>
          <h1 className="mt-1 font-serif text-2xl leading-tight">{event?.title ?? "Événement"}</h1>
          {event?.location && (
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {event.location}
            </p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1"><Clock className="h-3.5 w-3.5" /> {steps.length} moments</span>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        <ol className="relative mt-8 space-y-4 pl-6">
          <span aria-hidden className="absolute left-2 top-2 bottom-2 w-px bg-border" />
          {steps.map((step) => (
            <li key={step.id} className="relative">
              <span className="absolute -left-[18px] top-4 grid h-6 w-6 place-items-center rounded-full border-2 border-primary bg-primary text-primary-foreground text-[10px] font-semibold">
                ●
              </span>
              <div className="group rounded-2xl border border-border/60 bg-card p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-sm font-semibold tracking-wide text-primary">{step.time_label}</p>
                  {user && (
                    <button onClick={() => delMut.mutate(step.id)}
                      className="opacity-0 transition-opacity group-hover:opacity-100" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </div>
                <h3 className="mt-1 font-serif text-lg">{step.title}</h3>
                {step.description && <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>}
                {step.location && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {step.location}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {!isLoading && steps.length === 0 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">Aucun moment planifié.</p>
        )}

        {user && (
          <button onClick={() => setShowAdd(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary">
            <Plus className="h-4 w-4" /> Ajouter un moment
          </button>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-background p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl">Nouveau moment</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Heure</label>
                <input value={timeLabel} onChange={(e) => setTimeLabel(e.target.value)} placeholder="15:00" autoFocus
                  className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-3 py-3 text-sm outline-none focus:border-primary" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Titre</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Cérémonie"
                  className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-3 py-3 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Facultatif"
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary" />
            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Lieu</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Facultatif"
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary" />
            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-full border border-border py-3 text-sm font-medium">Annuler</button>
              <button
                onClick={() => timeLabel.trim() && title.trim() && addMut.mutate()}
                disabled={!timeLabel.trim() || !title.trim() || addMut.isPending}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
