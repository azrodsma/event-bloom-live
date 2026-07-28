import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Search, Heart, Plus, Music2, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getEventBySlug } from "@/lib/events.functions";
import { listPlaylist, suggestSong, voteSong } from "@/lib/logistics.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/events/$slug/playlist")({
  component: Playlist,
  head: () => ({
    meta: [
      { title: "Playlist · Memento Live" },
      { name: "description", content: "Composez ensemble la bande-son de votre événement." },
      { property: "og:title", content: "Playlist collaborative · Memento Live" },
      { property: "og:description", content: "Chaque invité peut suggérer ses morceaux favoris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const moments = ["Tous", "ceremony", "cocktail", "dinner", "first_dance", "party"] as const;
const momentLabels: Record<string, string> = {
  ceremony: "Cérémonie", cocktail: "Cocktail", dinner: "Dîner",
  first_dance: "Ouverture bal", party: "Soirée",
};

function Playlist() {
  const { slug } = useParams({ from: "/events/$slug/playlist" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchEvent = useServerFn(getEventBySlug);
  const fetchList = useServerFn(listPlaylist);
  const suggest = useServerFn(suggestSong);
  const vote = useServerFn(voteSong);

  const { data: event } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent({ data: { slug } }),
  });
  const eventId = event?.id;

  const { data: tracks = [], isLoading } = useQuery({
    enabled: !!eventId,
    queryKey: ["playlist", eventId],
    queryFn: () => fetchList({ data: { eventId: eventId! } }),
  });

  const [moment, setMoment] = useState<(typeof moments)[number]>("Tous");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [newMoment, setNewMoment] = useState<string>("party");

  const filtered = useMemo(() => {
    return tracks
      .filter((t) => (moment === "Tous" ? true : t.moment === moment))
      .filter((t) => (search ? ((t.title ?? "") + " " + (t.artist ?? "")).toLowerCase().includes(search.toLowerCase()) : true));
  }, [tracks, moment, search]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["playlist", eventId] });

  const addMut = useMutation({
    mutationFn: () => suggest({ data: { eventId: eventId!, title: title.trim(), artist: artist.trim() || undefined, moment: newMoment } }),
    onSuccess: () => {
      setTitle(""); setArtist(""); setShowAdd(false);
      invalidate();
      toast.success("Morceau suggéré 🎵");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });
  const voteMut = useMutation({
    mutationFn: (id: string) => vote({ data: { id, delta: 1 } }),
    onSuccess: invalidate,
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Playlist</p>
        <button
          onClick={() => user ? setShowAdd(true) : toast.error("Connecte-toi pour suggérer")}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"
          aria-label="Ajouter un morceau">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-transparent px-4 pb-8 pt-6">
        <div className="flex items-center gap-4">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-primary to-accent text-white">
            <Music2 className="h-10 w-10" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Playlist collaborative</p>
            <h1 className="mt-1 font-serif text-2xl leading-tight">Bande-son de l'événement</h1>
            <p className="mt-1 text-xs text-muted-foreground">{tracks.length} titres</p>
          </div>
        </div>
      </section>

      <div className="px-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un titre ou artiste…"
            className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto px-4 pb-4">
        {moments.map((m) => (
          <button key={m} onClick={() => setMoment(m)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              m === moment ? "bg-foreground text-background" : "border border-border bg-background"
            }`}>
            {m === "Tous" ? "Tous" : momentLabels[m] ?? m}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      <ul className="space-y-1 px-2">
        {filtered.map((t, idx) => (
          <li key={t.id} className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-secondary/50">
            <span className="w-5 text-center text-xs font-mono text-muted-foreground">{idx + 1}</span>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Music2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {t.artist ?? "—"}{t.suggested_by_name ? ` · Suggéré par ${t.suggested_by_name}` : ""}
              </p>
            </div>
            {t.moment && (
              <span className="hidden shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium sm:inline">
                {momentLabels[t.moment] ?? t.moment}
              </span>
            )}
            <button
              onClick={() => user ? voteMut.mutate(t.id) : toast.error("Connecte-toi pour voter")}
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 hover:bg-primary/10"
              aria-label="Voter">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">{t.votes ?? 0}</span>
            </button>
          </li>
        ))}
        {!isLoading && filtered.length === 0 && (
          <li className="py-16 text-center text-sm text-muted-foreground">Aucun morceau ne correspond.</li>
        )}
      </ul>

      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-background p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl">Suggérer un morceau</h3>
            <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Titre</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. La Vie en Rose" autoFocus
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary" />
            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Artiste</label>
            <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Ex. Édith Piaf"
              className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary" />
            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Moment</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {Object.entries(momentLabels).map(([key, lab]) => (
                <button key={key} onClick={() => setNewMoment(key)}
                  className={`rounded-2xl border px-3 py-2 text-xs font-medium ${
                    newMoment === key ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"
                  }`}>
                  {lab}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-full border border-border py-3 text-sm font-medium">Annuler</button>
              <button onClick={() => title.trim() && addMut.mutate()} disabled={!title.trim() || addMut.isPending}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40">
                Suggérer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
