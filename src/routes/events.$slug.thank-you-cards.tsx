import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Send, Wand2, Heart, Image as ImageIcon, Check, Clock, Mail } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/thank-you-cards")({
  component: ThankYouCards,
  head: () => ({
    meta: [
      { title: "Cartes de remerciements · MaFeliza" },
      { name: "description", content: "Des remerciements personnalisés, imprimés ou envoyés en un tap." },
      { property: "og:title", content: "Cartes de remerciements · MaFeliza" },
      { property: "og:description", content: "Merci, avec vos mots." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const templates = [
  { id: "t1", label: "Fleur & or", bg: "from-amber-100 via-primary/20 to-rose-100", emoji: "🌸", price: "0,80 €" },
  { id: "t2", label: "Minimaliste", bg: "from-stone-100 to-stone-200", emoji: "✒️", price: "0,60 €" },
  { id: "t3", label: "Photo souvenir", bg: "from-sky-100 to-primary/15", emoji: "📸", price: "1,20 €" },
  { id: "t4", label: "Aquarelle", bg: "from-rose-100 via-primary/15 to-violet-100", emoji: "🎨", price: "0,90 €" },
];

const recipients = [
  { name: "Léa Moreau", gift: "Voyage Kyoto (participation)", channel: "Email", status: "sent", date: "hier", note: "Merci pour cette folie japonaise…" },
  { name: "Grand-père Louis", gift: "Vaisselle en porcelaine", channel: "Postal", status: "sent", date: "il y a 2 j", note: "Chacun de vos gestes résonne…" },
  { name: "Julien & Marie", gift: "Machine à café", channel: "Email", status: "draft", date: "brouillon", note: null },
  { name: "Table 7", gift: "Cadeau collectif", channel: "Postal", status: "queued", date: "à envoyer", note: null },
  { name: "Camille Vidal", gift: "Discours (moment)", channel: "Email", status: "queued", date: "à envoyer", note: null },
  { name: "Anaïs Dubois", gift: "150 € (cagnotte)", channel: "Postal", status: "sent", date: "il y a 3 j", note: "Nos plus tendres pensées…" },
];

const statusBadge = {
  sent: { label: "Envoyé", tone: "bg-emerald-500/15 text-emerald-700", icon: Check },
  draft: { label: "Brouillon", tone: "bg-amber-500/15 text-amber-700", icon: Wand2 },
  queued: { label: "En attente", tone: "bg-secondary text-muted-foreground", icon: Clock },
} as const;

function ThankYouCards() {
  const { slug } = useParams({ from: "/events/$slug/thank-you-cards" });
  const [tpl, setTpl] = useState("t1");
  const [filter, setFilter] = useState<"all" | "sent" | "draft" | "queued">("all");
  const sent = recipients.filter((r) => r.status === "sent").length;
  const filtered = recipients.filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Remerciements</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-accent/40 to-transparent" />
        <div className="absolute right-4 top-6 text-6xl opacity-10 -rotate-12">💌</div>
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-primary" /> 187 invités · 142 cadeaux
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Merci,<br />
            <span className="italic text-primary">avec vos mots</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            L'IA rédige un premier jet à partir du cadeau, du moment partagé, de la personne. Vous relisez, vous signez.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-card/80 p-2.5 backdrop-blur ring-1 ring-border/60">
              <p className="font-serif text-xl leading-none">{sent}</p>
              <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">envoyés</p>
            </div>
            <div className="rounded-xl bg-card/80 p-2.5 backdrop-blur ring-1 ring-border/60">
              <p className="font-serif text-xl leading-none">1</p>
              <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">brouillon</p>
            </div>
            <div className="rounded-xl bg-card/80 p-2.5 backdrop-blur ring-1 ring-border/60">
              <p className="font-serif text-xl leading-none">{recipients.length - sent - 1}</p>
              <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">à écrire</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-2 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Modèle</p>
        <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
          {templates.map((t) => {
            const active = tpl === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTpl(t.id)}
                className={`w-28 shrink-0 overflow-hidden rounded-2xl border transition ${
                  active ? "border-primary shadow-md ring-2 ring-primary/30" : "border-border/60"
                }`}
              >
                <div className={`h-24 bg-gradient-to-br ${t.bg} grid place-items-center text-3xl`}>{t.emoji}</div>
                <div className="p-2 text-left">
                  <p className="text-[11px] font-semibold">{t.label}</p>
                  <p className="text-[9px] text-muted-foreground">dès {t.price}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 to-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Wand2 className="h-3.5 w-3.5" /> Aperçu IA · Léa Moreau
        </div>
        <div className="mt-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
          <p className="text-center font-serif text-xl">Chère Léa,</p>
          <p className="mt-3 font-serif text-[13px] leading-relaxed text-muted-foreground">
            Merci pour cette folie japonaise que vous nous offrez. Kyoto, entre les érables et les cerisiers,
            portera à jamais votre empreinte dans nos souvenirs. Vos mots dans le livre d'or nous ont fait fondre,
            et votre fou rire pendant l'ouverture de bal reste gravé.
          </p>
          <p className="mt-3 text-right font-serif italic">— Sarah & Thomas</p>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-full bg-foreground py-2 text-[11px] font-bold text-background">
            <Wand2 className="mr-1 inline h-3 w-3" /> Regénérer
          </button>
          <button className="rounded-full border border-border bg-background px-3 py-2 text-[11px] font-semibold">Ton ▾</button>
        </div>
      </section>

      <section className="mt-8 px-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Destinataires</p>
          <button className="text-[10px] font-semibold text-primary">+ Ajouter</button>
        </div>
        <div className="mt-2 flex gap-1.5">
          {(["all", "queued", "draft", "sent"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                filter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f === "all" ? "Tous" : f === "queued" ? "À écrire" : f === "draft" ? "Brouillons" : "Envoyés"}
            </button>
          ))}
        </div>

        <ul className="mt-3 space-y-2">
          {filtered.map((r) => {
            const s = statusBadge[r.status as keyof typeof statusBadge];
            const Icon = s.icon;
            return (
              <li key={r.name} className="rounded-2xl border border-border/60 bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold">
                    {r.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">🎁 {r.gift}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${s.tone}`}>
                      <Icon className="h-2.5 w-2.5" /> {s.label}
                    </span>
                    <p className="mt-1 text-[9px] text-muted-foreground">
                      {r.channel === "Email" ? <Mail className="mr-0.5 inline h-2.5 w-2.5" /> : "✉ "}
                      {r.date}
                    </p>
                  </div>
                </div>
                {r.note && (
                  <p className="mt-2 line-clamp-1 rounded-xl bg-secondary/40 px-2.5 py-1.5 font-serif text-[11px] italic text-muted-foreground">
                    « {r.note} »
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="fixed inset-x-0 bottom-16 z-10 mx-auto max-w-md px-4">
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur">
          <button className="rounded-full bg-secondary px-3 py-2 text-[11px] font-semibold">
            <ImageIcon className="mr-1 inline h-3 w-3" /> Photo
          </button>
          <button className="flex-1 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground">
            <Sparkles className="mr-1 inline h-3.5 w-3.5" /> Générer tous les brouillons
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background" aria-label="Envoyer la sélection">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
