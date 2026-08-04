import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mail, Check, Send, Heart, Users, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/thanks")({
  component: Thanks,
  head: () => ({
    meta: [
      { title: "Cartes de remerciement · MaFeliza" },
      { name: "description", content: "Personnalisez et envoyez une carte de remerciement à chacun de vos invités en quelques clics." },
      { property: "og:title", content: "Cartes de remerciement · MaFeliza" },
      { property: "og:description", content: "Envoyez vos remerciements post-événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Template {
  id: string;
  name: string;
  cover: string;
  bg: string;
}

const templates: Template[] = [
  { id: "t1", name: "Élégance dorée", cover: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop", bg: "linear-gradient(135deg, #FFF8F4, #D9A441)" },
  { id: "t2", name: "Rose poudré", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop", bg: "linear-gradient(135deg, #FFF8F4, #E85D8E)" },
  { id: "t3", name: "Champêtre", cover: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600&auto=format&fit=crop", bg: "linear-gradient(135deg, #F3E7D3, #B6C48A)" },
  { id: "t4", name: "Photo souvenir", cover: "https://images.unsplash.com/photo-1519690889869-e705e59f72e1?w=600&auto=format&fit=crop", bg: "linear-gradient(135deg, #0F0F10, #D9A441)" },
];

interface Recipient {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gift?: string;
  sent: boolean;
  selected: boolean;
}

const initialRecipients: Recipient[] = [
  { id: "r1", name: "Isabelle Bernard", email: "isabelle.b@icloud.com", avatar: "https://i.pravatar.cc/64?img=47", gift: "Service de vaisselle", sent: false, selected: true },
  { id: "r2", name: "Marc Bernard", email: "marc.b@icloud.com", avatar: "https://i.pravatar.cc/64?img=15", gift: "Cagnotte 200 €", sent: false, selected: true },
  { id: "r3", name: "Camille Rousseau", email: "camille.r@gmail.com", avatar: "https://i.pravatar.cc/64?img=32", gift: "Machine à café", sent: true, selected: false },
  { id: "r4", name: "Julien Mercier", email: "julien.m@gmail.com", avatar: "https://i.pravatar.cc/64?img=12", sent: false, selected: true },
  { id: "r5", name: "Nadia Ouali", email: "nadia.o@outlook.fr", avatar: "https://i.pravatar.cc/64?img=45", gift: "Cagnotte 80 €", sent: false, selected: true },
  { id: "r6", name: "Antoine Kessler", email: "antoine.k@gmail.com", avatar: "https://i.pravatar.cc/64?img=13", sent: false, selected: false },
  { id: "r7", name: "Léa Durand", email: "lea.d@icloud.com", avatar: "https://i.pravatar.cc/64?img=44", sent: true, selected: false },
  { id: "r8", name: "Paul Vasseur", email: "paul.v@gmail.com", avatar: "https://i.pravatar.cc/64?img=14", gift: "Voyage · 300 €", sent: false, selected: true },
];

const defaultMessage = `Chers proches,\n\nMerci d'avoir été à nos côtés le jour de notre mariage. Votre présence, vos mots, vos rires resteront gravés à jamais. \n\nAvec toute notre reconnaissance,\nSarah & Thomas 💕`;

function Thanks() {
  const { slug } = useParams({ from: "/events/$slug/thanks" });
  const [template, setTemplate] = useState(templates[0]);
  const [message, setMessage] = useState(defaultMessage);
  const [recipients, setRecipients] = useState(initialRecipients);
  const [signature, setSignature] = useState("Sarah & Thomas");

  const sentCount = recipients.filter((r) => r.sent).length;
  const selectedCount = recipients.filter((r) => r.selected && !r.sent).length;

  const stats = useMemo(
    () => ({
      total: recipients.length,
      sent: sentCount,
      pending: recipients.length - sentCount,
      percent: Math.round((sentCount / recipients.length) * 100),
    }),
    [recipients, sentCount],
  );

  function toggleAll(v: boolean) {
    setRecipients((prev) => prev.map((r) => (r.sent ? r : { ...r, selected: v })));
  }

  function toggleOne(id: string) {
    setRecipients((prev) => prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  }

  function sendAll() {
    setRecipients((prev) => prev.map((r) => (r.selected && !r.sent ? { ...r, sent: true, selected: false } : r)));
  }

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug/souvenir" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Remerciements</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-secondary/60 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-primary" /> Après l'événement
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Un dernier mot doux à envoyer</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choisissez un modèle, personnalisez le message, sélectionnez vos invités — nous envoyons pour vous.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none">{stats.total}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Invités</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none text-primary">{stats.sent}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Envoyés</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none">{stats.pending}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Restants</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/70">
          <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${stats.percent}%` }} />
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Aperçu</h2>
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl shadow-xl">
          <div className="aspect-[4/3] relative" style={{ background: template.bg }}>
            <img src={template.cover} alt="" className="h-full w-full object-cover mix-blend-multiply opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
              <p className="text-xs uppercase tracking-[0.3em] opacity-80">Merci</p>
              <p className="mt-1 font-serif text-3xl leading-tight">{signature}</p>
            </div>
          </div>
          <div className="whitespace-pre-line bg-background p-6 font-serif text-sm leading-relaxed text-foreground/90">
            {message}
          </div>
        </div>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Modèle</h2>
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t)}
              className={`flex flex-col items-center gap-2 ${template.id === t.id ? "opacity-100" : "opacity-70"}`}
            >
              <span
                className={`block h-24 w-20 overflow-hidden rounded-2xl ${
                  template.id === t.id ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                style={{ background: t.bg }}
              >
                <img src={t.cover} alt={t.name} className="h-full w-full object-cover mix-blend-multiply opacity-90" />
              </span>
              <span className="text-[11px] font-medium">{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Personnaliser</h2>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Signature</label>
        <input
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 min-h-[140px] w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 font-serif text-sm leading-relaxed outline-none focus:border-primary"
        />
        <button className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline">
          <Sparkles className="h-3.5 w-3.5" /> Suggestions MaFeliza
        </button>
      </section>

      <section className="px-4 pt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Destinataires · {selectedCount} sélectionnés</h2>
          <div className="flex gap-2 text-[11px]">
            <button onClick={() => toggleAll(true)} className="text-primary hover:underline">Tout sélectionner</button>
            <span className="text-muted-foreground">·</span>
            <button onClick={() => toggleAll(false)} className="text-muted-foreground hover:underline">Aucun</button>
          </div>
        </div>
        <ul className="space-y-2">
          {recipients.map((r) => (
            <li
              key={r.id}
              onClick={() => !r.sent && toggleOne(r.id)}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors ${
                r.sent
                  ? "border-transparent bg-primary/5"
                  : r.selected
                    ? "border-primary bg-primary/5"
                    : "border-border/60 bg-card"
              }`}
            >
              <img src={r.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{r.email}</p>
                {r.gift && (
                  <p className="mt-0.5 text-[10px] text-primary">🎁 {r.gift}</p>
                )}
              </div>
              {r.sent ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                  <Check className="h-3 w-3" /> Envoyé
                </span>
              ) : (
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full border-2 ${
                    r.selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                  }`}
                  aria-hidden
                >
                  {r.selected && <Check className="h-3.5 w-3.5" />}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex-1 text-xs">
            <p className="font-medium">{selectedCount} carte{selectedCount > 1 ? "s" : ""} prête{selectedCount > 1 ? "s" : ""}</p>
            <p className="text-muted-foreground">
              <Users className="mr-1 inline h-3 w-3" /> Envoi par email · aperçu inclus
            </p>
          </div>
          <button
            onClick={sendAll}
            disabled={selectedCount === 0}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
