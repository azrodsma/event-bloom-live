import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Handshake, Search, Star, Phone, Sparkles, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/vendors-hub")({
  component: VendorsHub,
  head: () => ({
    meta: [
      { title: "Prestataires · Memento Live" },
      { name: "description", content: "Le hub central de tous vos prestataires : statut, contact, devis, contrats." },
      { property: "og:title", content: "Prestataires · Memento Live" },
      { property: "og:description", content: "Un seul endroit pour orchestrer votre équipe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Vendor = {
  id: string;
  name: string;
  role: string;
  status: "confirmé" | "négociation" | "à contacter" | "acompte payé";
  amount: string;
  paid: string;
  contact: string;
  next: string;
  score: number;
  avatar: string;
};

const vendors: Vendor[] = [
  { id: "v1", name: "Julien Mercier", role: "Photographe", status: "acompte payé", amount: "3 200 €", paid: "50%", contact: "julien.m@studio.fr", next: "Rendez-vous shot-list · 20 mai", score: 4.9, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" },
  { id: "v2", name: "Maison Lenoir", role: "Traiteur", status: "confirmé", amount: "18 400 €", paid: "30%", contact: "contact@lenoir.fr", next: "Menu final · 1er mai", score: 4.8, avatar: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=200" },
  { id: "v3", name: "DJ Marco", role: "DJ & animation", status: "acompte payé", amount: "1 800 €", paid: "50%", contact: "marco@sound.fr", next: "Playlist finale · J-14", score: 4.7, avatar: "https://images.unsplash.com/photo-1571266028243-e4bb35f61c6c?w=200" },
  { id: "v4", name: "Fleuriste Camille", role: "Fleurs & décoration", status: "négociation", amount: "2 400 €", paid: "0%", contact: "camille@fleurs.fr", next: "Devis v2 attendu · 25 avril", score: 5.0, avatar: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=200" },
  { id: "v5", name: "Pâtisserie Chloé", role: "Pièce montée", status: "confirmé", amount: "620 €", paid: "0%", contact: "hello@patisserie-chloe.fr", next: "Dégustation · 1er mars", score: 4.9, avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200" },
  { id: "v6", name: "Bus & Co", role: "Navettes invités", status: "à contacter", amount: "—", paid: "0%", contact: "resa@busetco.fr", next: "Demande de devis à envoyer", score: 4.5, avatar: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=200" },
];

const statusStyle = {
  "acompte payé": "bg-emerald-100 text-emerald-800",
  "confirmé": "bg-primary/10 text-primary",
  "négociation": "bg-amber-100 text-amber-800",
  "à contacter": "bg-rose-100 text-rose-800",
} as const;

const filters = ["Tous", "confirmé", "acompte payé", "négociation", "à contacter"] as const;

function VendorsHub() {
  const { slug } = useParams({ from: "/events/$slug/vendors-hub" });
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof filters)[number]>("Tous");

  const list = vendors.filter((v) => {
    const ok = f === "Tous" ? true : v.status === f;
    const search = !q.trim() ? true : (v.name + v.role).toLowerCase().includes(q.toLowerCase());
    return ok && search;
  });

  const total = vendors.reduce((s, v) => s + (Number(v.amount.replace(/[^\d]/g, "")) || 0), 0);
  const paid = vendors.reduce((s, v) => {
    const a = Number(v.amount.replace(/[^\d]/g, "")) || 0;
    const p = Number(v.paid.replace("%", "")) || 0;
    return s + Math.round((a * p) / 100);
  }, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Prestataires</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Handshake className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/30 to-background px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Handshake className="h-3.5 w-3.5 text-primary" /> Votre équipe du jour
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">L'orchestre au complet</h1>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">{vendors.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Prestas</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">{total.toLocaleString("fr-FR")} €</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none text-primary">{paid.toLocaleString("fr-FR")} €</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Versés</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2.5 backdrop-blur">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nom, métier…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3">
          {filters.map((x) => (
            <button
              key={x}
              onClick={() => setF(x)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${
                f === x ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3 px-4 pt-2">
        {list.map((v) => (
          <li key={v.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
            <div className="flex items-start gap-3 p-4">
              <img src={v.avatar} alt={v.name} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[15px] leading-tight">{v.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{v.role}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${statusStyle[v.status]}`}>
                    {v.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" /> {v.score.toFixed(1)}
                  <span className="text-border">·</span>
                  <span className="font-serif text-foreground">{v.amount}</span>
                  <span className="text-border">·</span>
                  <span>Versé {v.paid}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-border/60 bg-secondary/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-primary">Prochaine étape</p>
              <p className="mt-1 flex items-center gap-1.5 text-[12px]">
                <Check className="h-3 w-3 text-primary" /> {v.next}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button className="flex-1 rounded-full bg-foreground py-2 text-xs font-bold text-background">
                  Ouvrir la fiche
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Appeler">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Groupe WhatsApp</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Créer un canal partagé</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Un groupe unique pour tous vos prestataires, avec messages épinglés et rappels automatiques.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Générer le groupe
        </button>
      </section>
    </div>
  );
}
