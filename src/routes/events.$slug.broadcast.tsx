import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageSquare, Bell, Send, Users, Clock, CheckCircle2, ChevronRight, Sparkles, Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/broadcast")({
  component: Broadcast,
  head: () => ({
    meta: [
      { title: "Diffusion invités · Memento Live" },
      { name: "description", content: "Envoyez un message à tous vos invités par SMS, email ou notification push, en un clin d'œil." },
      { property: "og:title", content: "Diffusion aux invités · Memento Live" },
      { property: "og:description", content: "Parler à tout le monde, en une fois." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Channel = "push" | "sms" | "email";

const channels: { id: Channel; label: string; icon: typeof Bell; desc: string; cost: string; reach: number; tint: string }[] = [
  { id: "push", label: "Notification", icon: Bell, desc: "Instantané dans l'app", cost: "Gratuit", reach: 87, tint: "from-primary/20 to-primary/5" },
  { id: "sms", label: "SMS", icon: MessageSquare, desc: "0,05 € par invité", cost: "6,20 €", reach: 124, tint: "from-emerald-100 to-emerald-50" },
  { id: "email", label: "Email", icon: Mail, desc: "Mise en page soignée", cost: "Gratuit", reach: 118, tint: "from-sky-100 to-sky-50" },
];

const audiences = [
  { id: "all", label: "Tous les invités", count: 124 },
  { id: "confirmed", label: "Confirmés uniquement", count: 87 },
  { id: "pending", label: "Sans réponse", count: 21 },
  { id: "family", label: "Famille proche", count: 34 },
  { id: "vendors", label: "Prestataires", count: 8 },
];

const templates = [
  { emoji: "⏰", title: "Rappel J–7", text: "Coucou ! Plus qu'une semaine avant le grand jour. N'oubliez pas votre tenue en {couleur} 🎉" },
  { emoji: "🌦️", title: "Changement météo", text: "Météo capricieuse en vue : la cérémonie reste maintenue, prévoyez des vestes légères." },
  { emoji: "🚌", title: "Info navette", text: "Départ des navettes à 15 h précises depuis l'hôtel Mercure. Ne les manquez pas !" },
  { emoji: "💌", title: "Merci d'être venus", text: "Sarah & Thomas — merci d'avoir partagé ce moment avec nous. On vous aime fort ❤️" },
];

const history = [
  { id: "h1", channel: "push" as Channel, title: "Rappel des tenues", sent: "hier · 18 h 30", audience: "Tous", stats: { delivered: 122, opened: 108, replied: 14 }, status: "sent" as const },
  { id: "h2", channel: "sms" as Channel, title: "Navette 15 h", sent: "il y a 3 jours", audience: "Confirmés", stats: { delivered: 87, opened: 87, replied: 3 }, status: "sent" as const },
  { id: "h3", channel: "email" as Channel, title: "Faire-part définitif", sent: "il y a 2 sem.", audience: "Tous", stats: { delivered: 118, opened: 97, replied: 42 }, status: "sent" as const },
];

const chanMeta: Record<Channel, { icon: typeof Bell; label: string; color: string }> = {
  push: { icon: Bell, label: "Push", color: "bg-primary/10 text-primary" },
  sms: { icon: MessageSquare, label: "SMS", color: "bg-emerald-50 text-emerald-700" },
  email: { icon: Mail, label: "Email", color: "bg-sky-50 text-sky-700" },
};

function Broadcast() {
  const { slug } = useParams({ from: "/events/$slug/broadcast" });
  const [tab, setTab] = useState<"compose" | "history">("compose");
  const [selectedChannels, setSelectedChannels] = useState<Set<Channel>>(new Set(["push"]));
  const [audience, setAudience] = useState("all");
  const [msg, setMsg] = useState("");
  const [schedule, setSchedule] = useState<"now" | "later">("now");

  const toggle = (c: Channel) =>
    setSelectedChannels((s) => {
      const n = new Set(s);
      n.has(c) ? n.delete(c) : n.add(c);
      return n;
    });

  const audienceCount = audiences.find((a) => a.id === audience)?.count ?? 0;
  const smsCost = selectedChannels.has("sms") ? (audienceCount * 0.05).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Diffusion</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-primary/10 to-transparent px-4 pb-5 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> 124 invités joignables
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Parler à tout le monde,<br />en une fois</h1>
      </section>

      <div className="sticky top-14 z-10 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-secondary p-1">
          {(["compose", "history"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                tab === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {v === "compose" ? "Composer" : "Historique"}
            </button>
          ))}
        </div>
      </div>

      {tab === "compose" && (
        <>
          <section className="px-4 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">1. Canaux</p>
            <div className="mt-2 space-y-2">
              {channels.map((c) => {
                const Icon = c.icon;
                const active = selectedChannels.has(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggle(c.id)}
                    className={`flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all ${
                      active ? "border-primary bg-gradient-to-r " + c.tint : "border-border bg-card"
                    }`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{c.label}</p>
                      <p className="text-[11px] text-muted-foreground">{c.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-primary">{c.cost}</p>
                      <p className="text-[10px] text-muted-foreground">{c.reach} joignables</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-6 px-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">2. Destinataires</p>
            <div className="mt-2 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {audiences.map((a) => {
                const active = audience === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAudience(a.id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                      active ? "border-transparent bg-foreground text-background" : "border-border bg-card"
                    }`}
                  >
                    {a.label} · {a.count}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-6 px-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">3. Message</p>
              <button className="text-[10px] font-bold text-primary">Modèles ↓</button>
            </div>
            <div className="mt-2 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {templates.map((t) => (
                <button
                  key={t.title}
                  onClick={() => setMsg(t.text)}
                  className="w-40 shrink-0 rounded-2xl border border-border bg-card p-3 text-left"
                >
                  <p className="text-xl">{t.emoji}</p>
                  <p className="mt-1 text-[11px] font-bold">{t.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">{t.text}</p>
                </button>
              ))}
            </div>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={5}
              placeholder="Écrivez votre message… Utilisez {prenom} pour personnaliser."
              className="mt-3 w-full resize-none rounded-2xl border border-border bg-background p-3.5 text-[13px] placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{msg.length}/160 · {selectedChannels.has("sms") ? Math.ceil(msg.length / 160) || 1 : 1} SMS</span>
              <button className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-semibold">
                <Eye className="h-3 w-3" /> Aperçu
              </button>
            </div>
          </section>

          <section className="mt-6 px-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">4. Envoi</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["now", "later"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setSchedule(v)}
                  className={`rounded-2xl border p-3 text-left ${
                    schedule === v ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <p className="text-xs font-bold">{v === "now" ? "Immédiat" : "Programmé"}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {v === "now" ? "Envoyé maintenant" : "Choisir une date"}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <div className="mx-4 mt-6 rounded-3xl bg-secondary/50 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Portée estimée
              </span>
              <span className="font-bold">{audienceCount} personnes</span>
            </div>
            {selectedChannels.has("sms") && (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Coût SMS</span>
                <span className="font-bold text-primary">{smsCost} €</span>
              </div>
            )}
          </div>

          <div className="fixed bottom-20 inset-x-0 z-30 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
            <button
              disabled={!msg.length || !selectedChannels.size}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-40"
            >
              <Send className="h-4 w-4" /> {schedule === "now" ? "Envoyer maintenant" : "Programmer l'envoi"}
            </button>
          </div>
        </>
      )}

      {tab === "history" && (
        <ul className="space-y-2 px-4 pt-4">
          {history.map((h) => {
            const cm = chanMeta[h.channel];
            const Icon = cm.icon;
            const openRate = Math.round((h.stats.opened / h.stats.delivered) * 100);
            return (
              <li key={h.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="flex items-start gap-3 p-4">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${cm.color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="line-clamp-1 text-sm font-semibold">{h.title}</p>
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    </div>
                    <p className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {h.sent} · {h.audience}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-3 gap-1 border-t border-border/50 bg-secondary/30 p-3 text-center">
                  <div>
                    <p className="font-serif text-lg leading-none">{h.stats.delivered}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">Reçus</p>
                  </div>
                  <div>
                    <p className="font-serif text-lg leading-none">{openRate}%</p>
                    <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">Ouverts</p>
                  </div>
                  <div>
                    <p className="font-serif text-lg leading-none">{h.stats.replied}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">Réponses</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
