import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Send, Mic, User, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/concierge")({
  component: Concierge,
  head: () => ({
    meta: [
      { title: "Concierge IA · MaFeliza" },
      { name: "description", content: "Une intelligence artificielle qui répond à toutes vos questions d'organisation — 24/7." },
      { property: "og:title", content: "Concierge IA · MaFeliza" },
      { property: "og:description", content: "Votre wedding planner de poche." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Msg = { id: number; from: "me" | "ai"; text: string; time: string; chips?: string[] };

const initial: Msg[] = [
  { id: 1, from: "ai", time: "9:12", text: "Bonjour Sarah 🌸 Je suis MaFeliza, votre concierge. Une question sur l'organisation ?", chips: ["Retro-planning J-30", "Idée cadeau témoin", "Modèle SMS J-2", "Discours en 5 min"] },
  { id: 2, from: "me", time: "9:14", text: "Je suis en retard sur les faire-part. Que faire ?" },
  { id: 3, from: "ai", time: "9:14", text: "Aucun stress. À J-45, voici la stratégie :\n\n• Envoyer une invitation digitale ce soir (relance 48h)\n• Lancer l'impression physique demain avec livraison express (7 j)\n• Prévoir un module RSVP en ligne avec date butoir J-30\n\nJe peux ouvrir le tunnel « Invitation digitale » pour vous ?", chips: ["Oui, ouvrir", "Voir imprimeurs express", "Modèle de relance"] },
  { id: 4, from: "me", time: "9:16", text: "Modèle de relance" },
  { id: 5, from: "ai", time: "9:16", text: "Voici un modèle chaleureux, à personnaliser :\n\n« Coucou {{prénom}} 🌷, un petit rappel pour notre grand jour du 12 juin — merci de confirmer ta présence avant vendredi via le lien. On a hâte de partager ça avec toi ! Sarah & Thomas »", chips: ["Envoyer maintenant", "Version plus formelle", "Traduire en anglais"] },
];

const quickPrompts = [
  "Combien de bouteilles pour 120 invités ?",
  "Rédige mon discours en 4 minutes",
  "Idée d'animation cérémonie laïque",
  "Timing repas champêtre",
  "Plan de table : familles séparées",
];

function Concierge() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = (txt?: string) => {
    const text = (txt ?? input).trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMsgs((m) => [...m, { id: Date.now(), from: "me", text, time }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMsgs((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "ai",
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          text: "Bien reçu — je prépare une réponse détaillée avec plusieurs options.",
          chips: ["Développer", "Version courte", "Ajouter à ma to-do"],
        },
      ]);
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col items-center">
          <p className="font-serif text-base leading-none">Concierge MaFeliza</p>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> En ligne
          </p>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {msgs.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.from === "me" ? "flex-row-reverse" : ""}`}>
            {m.from === "ai" ? (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            ) : (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
            <div className={`max-w-[78%] ${m.from === "me" ? "items-end" : ""}`}>
              <div
                className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.from === "me"
                    ? "bg-foreground text-background"
                    : "bg-card border border-border/60"
                }`}
              >
                {m.text}
              </div>
              <p className={`mt-1 flex items-center gap-1 text-[10px] text-muted-foreground ${m.from === "me" ? "justify-end" : ""}`}>
                <Clock className="h-2.5 w-2.5" /> {m.time}
              </p>
              {m.chips && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/10"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl border border-border/60 bg-card px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.15s" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-2">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold text-muted-foreground"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4 pb-4 pt-1">
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary" aria-label="Voix">
            <Mic className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Posez votre question…"
            className="h-11 flex-1 rounded-full border border-border/60 bg-card px-4 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
