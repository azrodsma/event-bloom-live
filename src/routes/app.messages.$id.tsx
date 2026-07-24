import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Phone, Video, Send, Smile, Paperclip, Mic } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/messages/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Conversation — Memento Live` },
      { name: "description", content: `Discussion ${params.id}` },
    ],
  }),
  component: Thread,
});

type Msg = {
  id: string;
  from: "me" | string;
  name?: string;
  avatar?: string;
  text?: string;
  kind?: "text" | "voice" | "photo" | "system";
  duration?: string;
  photo?: string;
  time: string;
};

const conversation: Record<string, { name: string; subtitle: string; avatar: string; messages: Msg[] }> = {
  t1: {
    name: "Témoins Sarah & Thomas",
    subtitle: "5 membres · en ligne",
    avatar: "https://i.pravatar.cc/80?img=47",
    messages: [
      { id: "1", from: "sys", kind: "system", text: "Groupe créé par Sarah · 12 juin", time: "" },
      { id: "2", from: "emma", name: "Emma", avatar: "https://i.pravatar.cc/80?img=12", text: "Coucou les amis 💌 J'ai fini le discours, je vous fais lire ?", time: "20:02" },
      { id: "3", from: "lucas", name: "Lucas", avatar: "https://i.pravatar.cc/80?img=25", text: "Envoie envoie !", time: "20:04" },
      { id: "4", from: "emma", name: "Emma", avatar: "https://i.pravatar.cc/80?img=12", kind: "voice", duration: "0:47", time: "20:06" },
      { id: "5", from: "me", text: "Trop beau Emma, j'en ai les larmes 🥹", time: "20:09" },
      { id: "6", from: "lucas", name: "Lucas", avatar: "https://i.pravatar.cc/80?img=25", kind: "photo", photo: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600", text: "Regardez la déco du jour J 🌸", time: "20:12" },
      { id: "7", from: "emma", name: "Emma", avatar: "https://i.pravatar.cc/80?img=12", text: "Le discours est prêt ! 💌", time: "20:14" },
    ],
  },
  t2: {
    name: "Marie Laurent",
    subtitle: "Active à l'instant",
    avatar: "https://i.pravatar.cc/80?img=47",
    messages: [
      { id: "1", from: "marie", name: "Marie", avatar: "https://i.pravatar.cc/80?img=47", text: "Hello ! Trop hâte pour samedi ✨", time: "19:44" },
      { id: "2", from: "me", text: "Nous aussi, c'est fou 😍", time: "19:47" },
      { id: "3", from: "marie", name: "Marie", avatar: "https://i.pravatar.cc/80?img=47", text: "On se retrouve à 15h à la mairie ?", time: "19:52" },
    ],
  },
};

function Thread() {
  const { id } = Route.useParams();
  const data = conversation[id] ?? conversation.t2;
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>(data.messages);

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { id: String(Date.now()), from: "me", text, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setText("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-3 py-3 backdrop-blur">
        <Link to="/app/messages" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <img src={data.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight">{data.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{data.subtitle}</p>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label="Appeler">
          <Phone className="h-4 w-4" />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label="Vidéo">
          <Video className="h-4 w-4" />
        </button>
      </header>

      <main className="flex-1 space-y-3 px-3 py-4">
        {messages.map((m) => {
          if (m.kind === "system") {
            return (
              <p key={m.id} className="my-3 text-center text-[11px] text-muted-foreground">{m.text}</p>
            );
          }
          const mine = m.from === "me";
          return (
            <div key={m.id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
              {!mine && <img src={m.avatar} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />}
              <div className={`max-w-[75%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                {!mine && m.name && <span className="mb-0.5 px-2 text-[10px] font-semibold text-muted-foreground">{m.name}</span>}
                {m.kind === "photo" && (
                  <img src={m.photo} alt="" className="mb-1 max-w-full rounded-2xl object-cover shadow-card" />
                )}
                {m.kind === "voice" ? (
                  <div className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 ${mine ? "bg-gradient-primary text-white" : "bg-surface"}`}>
                    <div className={`grid h-8 w-8 place-items-center rounded-full ${mine ? "bg-white/25" : "bg-primary-light text-primary"}`}>
                      <Mic className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex items-end gap-0.5">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <span key={i} className={`w-0.5 rounded-full ${mine ? "bg-white/70" : "bg-primary/60"}`} style={{ height: `${6 + ((i * 7) % 14)}px` }} />
                      ))}
                    </div>
                    <span className={`text-[11px] font-semibold ${mine ? "text-white" : "text-muted-foreground"}`}>{m.duration}</span>
                  </div>
                ) : m.text ? (
                  <div className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${mine ? "bg-gradient-primary text-white shadow-glow" : "bg-surface"}`}>
                    {m.text}
                  </div>
                ) : null}
                <span className="mt-0.5 px-2 text-[10px] text-muted-foreground">{m.time}</span>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="sticky bottom-16 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2">
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface" aria-label="Joindre">
            <Paperclip className="h-4 w-4" />
          </button>
          <div className="flex flex-1 items-center gap-1 rounded-full bg-surface px-3 py-1.5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Écrire un message…"
              className="min-w-0 flex-1 bg-transparent py-1 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <button className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground" aria-label="Emoji">
              <Smile className="h-4 w-4" />
            </button>
          </div>
          {text.trim() ? (
            <button onClick={send} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-white shadow-glow" aria-label="Envoyer">
              <Send className="h-4 w-4" />
            </button>
          ) : (
            <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-white shadow-glow" aria-label="Message vocal">
              <Mic className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
