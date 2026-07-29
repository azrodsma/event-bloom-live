import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getConversation, sendMessage } from "@/lib/messages.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/messages/$id")({
  head: () => ({
    meta: [
      { title: "Conversation — Memento Live" },
      { name: "description", content: "Discussion privée sur Memento Live." },
    ],
  }),
  component: Thread,
});

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function Thread() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const getConv = useServerFn(getConversation);
  const send = useServerFn(sendMessage);
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => getConv({ data: { id } }),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`dm-${id}`).on("postgres_changes", {
      event: "INSERT", schema: "public", table: "direct_messages", filter: `conversation_id=eq.${id}`,
    }, () => qc.invalidateQueries({ queryKey: ["conversation", id] })).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, user, qc]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [data?.messages.length]);

  if (!loading && !user) {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="font-serif text-2xl">Connexion requise</h1>
        <Link to="/auth" className="mt-4 inline-block rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow">Se connecter</Link>
      </div>
    );
  }

  const submit = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    try {
      await send({ data: { conversationId: id, content: t } });
      qc.invalidateQueries({ queryKey: ["conversation", id] });
      qc.invalidateQueries({ queryKey: ["my-conversations"] });
    } catch (e: any) { alert(e?.message ?? "Envoi impossible"); }
  };

  const title = data?.conv.title || (data?.conv.is_group ? "Groupe" : data?.others[0]?.display_name || "Conversation");
  const avatar = data?.others[0]?.avatar_url;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-3 py-3 backdrop-blur">
        <Link to="/app/messages" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label="Retour">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        {avatar ? (
          <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-light font-semibold text-primary">{(title || "?").slice(0,1).toUpperCase()}</div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight">{title}</p>
          <p className="truncate text-[11px] text-muted-foreground">{data?.conv.is_group ? `${(data?.others.length ?? 0) + 1} membres` : "Conversation privée"}</p>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {isLoading && <p className="py-8 text-center text-xs text-muted-foreground">Chargement…</p>}
        {!isLoading && data && data.messages.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">Envoyez le premier message ✨</p>
        )}
        {data?.messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
              {!mine && (m.sender_avatar ? (
                <img src={m.sender_avatar} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-light text-[10px] font-semibold text-primary">{(m.sender_name || "?").slice(0,1).toUpperCase()}</div>
              ))}
              <div className={`max-w-[75%] flex flex-col ${mine ? "items-end" : "items-start"}`}>
                {!mine && data.conv.is_group && m.sender_name && (
                  <span className="mb-0.5 px-2 text-[10px] font-semibold text-muted-foreground">{m.sender_name}</span>
                )}
                <div className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${mine ? "bg-gradient-primary text-white shadow-glow" : "bg-surface"}`}>
                  {m.content}
                </div>
                <span className="mt-0.5 px-2 text-[10px] text-muted-foreground">{fmt(m.created_at)}</span>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="sticky bottom-16 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1 rounded-full bg-surface px-3 py-1.5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Écrire un message…"
              className="min-w-0 flex-1 bg-transparent py-1 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button onClick={submit} disabled={!text.trim()} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-white shadow-glow disabled:opacity-40" aria-label="Envoyer">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
