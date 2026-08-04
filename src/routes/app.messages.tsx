import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Edit3, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listMyConversations, searchUsers, startConversationWith } from "@/lib/messages.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/messages")({
  head: () => ({
    meta: [
      { title: "Messages — MaFeliza" },
      { name: "description", content: "Vos conversations privées et de groupe." },
    ],
  }),
  component: Messages,
});

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const diff = (now.getTime() - d.getTime()) / 86400000;
  if (diff < 7) return d.toLocaleDateString("fr-FR", { weekday: "short" });
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function Messages() {
  const { user, loading } = useAuth();
  const list = useServerFn(listMyConversations);
  const search = useServerFn(searchUsers);
  const start = useServerFn(startConversationWith);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [newQuery, setNewQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-conversations"],
    queryFn: () => list(),
    enabled: !!user,
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (!openNew || !newQuery.trim()) { setResults([]); return; }
    let cancel = false;
    const t = setTimeout(async () => {
      try {
        const r = await search({ data: { q: newQuery.trim() } });
        if (!cancel) setResults(r.users);
      } catch { /* ignore */ }
    }, 250);
    return () => { cancel = true; clearTimeout(t); };
  }, [newQuery, openNew, search]);

  const threads = (data?.threads ?? []).filter((t) => !query || t.title.toLowerCase().includes(query.toLowerCase()));

  if (!loading && !user) {
    return (
      <div className="px-4 py-16 text-center">
        <MessageCircle className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h1 className="font-serif text-2xl">Messagerie privée</h1>
        <p className="mt-2 text-sm text-muted-foreground">Connectez-vous pour discuter avec vos proches et vos co-organisateurs.</p>
        <Link to="/auth" className="mt-4 inline-block rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="font-serif text-3xl">Messages</h1>
        <button onClick={() => setOpenNew(true)} className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-white shadow-glow" aria-label="Nouveau message">
          <Edit3 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 shadow-card">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une conversation…"
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Chargement…</p>
      ) : threads.length === 0 ? (
        <div className="rounded-2xl bg-surface p-8 text-center shadow-card">
          <MessageCircle className="mx-auto mb-2 h-8 w-8 text-primary" />
          <p className="font-serif text-lg">Aucune conversation</p>
          <p className="mt-1 text-xs text-muted-foreground">Démarrez une discussion avec vos invités ou co-organisateurs.</p>
          <button onClick={() => setOpenNew(true)} className="mt-3 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow">Nouvelle conversation</button>
        </div>
      ) : (
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversations</p>
          <div className="space-y-1">
            {threads.map((t) => (
              <Link
                key={t.id}
                to="/app/messages/$id"
                params={{ id: t.id }}
                className="flex cursor-pointer items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-surface"
              >
                <div className="relative shrink-0">
                  {t.avatars.length === 0 ? (
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-light text-primary font-semibold">{t.title.slice(0,1).toUpperCase()}</div>
                  ) : t.avatars.length === 1 ? (
                    <img src={t.avatars[0]} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="relative h-12 w-12">
                      <img src={t.avatars[0]} alt="" className="absolute left-0 top-0 h-8 w-8 rounded-full border-2 border-background object-cover" />
                      <img src={t.avatars[1]} alt="" className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-background object-cover" />
                    </div>
                  )}
                  {t.unread && (
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{t.title}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{formatTime(t.lastAt)}</span>
                  </div>
                  <p className={`truncate text-xs ${t.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>{t.lastMessage}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {openNew && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" onClick={() => setOpenNew(false)}>
          <div className="w-full rounded-t-3xl bg-background p-5 shadow-glow sm:max-w-md sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-serif text-xl">Nouvelle conversation</p>
              <button onClick={() => setOpenNew(false)} aria-label="Fermer" className="grid h-8 w-8 place-items-center rounded-full bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <div className="mb-3 flex items-center gap-2 rounded-full bg-surface px-4 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input autoFocus value={newQuery} onChange={(e) => setNewQuery(e.target.value)} placeholder="Rechercher un profil…" className="flex-1 bg-transparent text-sm focus:outline-none" />
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {results.length === 0 && newQuery && <p className="py-6 text-center text-xs text-muted-foreground">Aucun profil trouvé</p>}
              {results.map((u) => (
                <button
                  key={u.id}
                  onClick={async () => {
                    try {
                      const r = await start({ data: { otherUserId: u.id } });
                      setOpenNew(false);
                      navigate({ to: "/app/messages/$id", params: { id: r.id } });
                    } catch (e: any) { alert(e?.message ?? "Erreur"); }
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left hover:bg-surface"
                >
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-light font-semibold text-primary">{(u.display_name || "?").slice(0,1).toUpperCase()}</div>
                  )}
                  <span className="text-sm font-medium">{u.display_name || "Invité"}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
