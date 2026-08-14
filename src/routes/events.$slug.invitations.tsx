import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Palette, Mail, Send, Download, Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/invitations")({
  component: Invitations,
  head: () => ({
    meta: [
      { title: "Faire-part personnalisés · MaFeliza" },
      { name: "description", content: "Créez vos faire-part digitaux et papier assortis, envoyés en 3 clics." },
      { property: "og:title", content: "Faire-part · MaFeliza" },
      { property: "og:description", content: "L'invitation qui donne le ton." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Template = {
  id: string;
  name: string;
  vibe: string;
  paper: string;
  digital: string;
  palette: string[];
  price: string;
};

const templates: Template[] = [
  { id: "bloom", name: "Éclosion", vibe: "Aquarelle florale", paper: "0,90 €/pièce", digital: "Illimité", palette: ["#E85D8E", "#FFF8F4", "#D9A441", "#8FA97A"], price: "à partir de 88 €" },
  { id: "gilded", name: "Doré nocturne", vibe: "Élégance sombre", paper: "1,20 €/pièce", digital: "Illimité", palette: ["#0F0F10", "#D9A441", "#8B6F3F", "#FFF8F4"], price: "à partir de 120 €" },
  { id: "coastal", name: "Bord d'eau", vibe: "Aquatic minimal", paper: "0,80 €/pièce", digital: "Illimité", palette: ["#A9C7D6", "#FFF8F4", "#E85D8E", "#3D5C6E"], price: "à partir de 76 €" },
  { id: "botanic", name: "Jardin secret", vibe: "Herbier vintage", paper: "1,00 €/pièce", digital: "Illimité", palette: ["#8FA97A", "#F0EBE0", "#D9A441", "#5B7C4A"], price: "à partir de 96 €" },
];

const steps = [
  { id: 1, title: "Modèle choisi", done: true },
  { id: 2, title: "Texte personnalisé", done: true },
  { id: 3, title: "Photo & signatures", done: false },
  { id: 4, title: "Liste d'envoi", done: false },
  { id: 5, title: "Validation & impression", done: false },
];

function Invitations() {
  const { slug } = useParams({ from: "/events/$slug/invitations" });
  const [selected, setSelected] = useState(templates[0]);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Faire-part</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Aperçu">
          <Eye className="h-4 w-4" />
        </button>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Mail className="h-3.5 w-3.5 text-primary" /> Papier & digital
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">L'invitation<br />qui donne le ton</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Un modèle, deux formats — imprimé sur papier vergé et diffusé en digital avec RSVP intégré.
        </p>
      </section>

      <section className="px-4 pt-6">
        <div
          className="relative overflow-hidden rounded-3xl border p-1 shadow-2xl transition"
          style={{ borderColor: selected.palette[0], background: selected.palette[1] }}
        >
          <div
            className="rounded-[22px] p-8 text-center"
            style={{ background: selected.palette[1], color: selected.palette[0] }}
          >
            <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: selected.palette[2] }}>
              12 juin 2026 · Château de Roubines
            </p>
            <p className="mt-6 font-serif text-4xl leading-tight">Sarah</p>
            <p className="my-1 font-serif text-2xl italic" style={{ color: selected.palette[2] }}>&</p>
            <p className="font-serif text-4xl leading-tight">Thomas</p>
            <div className="my-6 flex justify-center gap-1.5">
              {selected.palette.map((c) => (
                <span key={c} className="h-1 w-8 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <p className="font-serif text-[13px] italic leading-relaxed" style={{ color: selected.palette[0] }}>
              « Nous serions honorés<br />de partager avec vous<br />ce jour important. »
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-widest" style={{ color: selected.palette[2] }}>
              RSVP avant le 1ᵉʳ mai
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 flex items-center gap-1.5 font-serif text-lg">
          <Palette className="h-4 w-4 text-primary" /> Modèles
        </h2>
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
          {templates.map((t) => {
            const on = selected.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-40 shrink-0 overflow-hidden rounded-2xl border-2 text-left transition ${
                  on ? "border-primary ring-2 ring-primary/30" : "border-transparent"
                }`}
              >
                <div className="grid h-24 place-items-center" style={{ background: t.palette[1], color: t.palette[0] }}>
                  <p className="font-serif text-lg">S & T</p>
                </div>
                <div className="bg-card p-2.5">
                  <p className="font-serif text-sm leading-tight">{t.name}</p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{t.vibe}</p>
                  <div className="mt-2 flex gap-0.5">
                    {t.palette.map((c) => (
                      <span key={c} className="h-2 flex-1 rounded-sm" style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Étapes</h2>
        <ol className="space-y-2">
          {steps.map((s) => (
            <li key={s.id} className={`flex items-center gap-3 rounded-2xl border p-3 ${
              s.done ? "border-border/60 bg-card opacity-70" : "border-primary/40 bg-primary/5"
            }`}>
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                s.done ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
              }`}>
                {s.done ? "✓" : s.id}
              </span>
              <p className={`flex-1 font-serif text-[14px] ${s.done ? "line-through" : ""}`}>{s.title}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-4 mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary">Papier</p>
          <p className="mt-1 font-serif text-lg leading-none">{selected.paper}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Vergé 350g · impression 48h</p>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary">Digital</p>
          <p className="mt-1 font-serif text-lg leading-none">{selected.digital}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">RSVP + rappels automatiques</p>
        </div>
      </section>

      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Estimation</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">120 invités · {selected.price}</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Enveloppes calligraphiées et affranchissement inclus dans les formules Prestige.</p>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground py-3 text-xs font-bold text-background">
            <Send className="h-3.5 w-3.5" /> Envoyer les digitaux
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-secondary" aria-label="Télécharger">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
