import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, Download, Filter, ExternalLink, Gift, Heart, CreditCard, Shield } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/wallet")({
  component: WalletRoute,
  head: () => ({
    meta: [
      { title: "Mon portefeuille · MaFeliza" },
      { name: "description", content: "Historique de vos contributions aux cagnottes, reçus téléchargeables et suivi des dons envoyés." },
      { property: "og:title", content: "Mon portefeuille · MaFeliza" },
      { property: "og:description", content: "Historique de vos contributions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type TxType = "contribution" | "gift" | "received" | "refund";

interface Tx {
  id: string;
  type: TxType;
  title: string;
  event: string;
  eventSlug: string;
  date: string;
  amount: number;
  platform: string;
  status: "confirmed" | "pending";
}

const txs: Tx[] = [
  { id: "t1", type: "contribution", title: "Voyage de noces", event: "Mariage Sarah & Thomas", eventSlug: "sarah-thomas", date: "12 mars 2026", amount: 80, platform: "Leetchi", status: "confirmed" },
  { id: "t2", type: "gift", title: "Robot pâtissier (KitchenAid)", event: "Mariage Sarah & Thomas", eventSlug: "sarah-thomas", date: "05 mars 2026", amount: 120, platform: "Liste MaFeliza", status: "confirmed" },
  { id: "t3", type: "contribution", title: "Trousseau bébé", event: "Baptême de Gabriel", eventSlug: "bapteme-gabriel", date: "22 février 2026", amount: 50, platform: "Lydia", status: "confirmed" },
  { id: "t4", type: "received", title: "Cadeau reçu · Livre photo", event: "30 ans de Clara", eventSlug: "clara-30", date: "18 février 2026", amount: 45, platform: "Amazon", status: "confirmed" },
  { id: "t5", type: "contribution", title: "Rénovation atelier", event: "Crémaillère Julie & Max", eventSlug: "cremaillere-jm", date: "10 février 2026", amount: 30, platform: "PayPal.me", status: "pending" },
  { id: "t6", type: "refund", title: "Annulation gala 2025", event: "Gala association", eventSlug: "gala", date: "28 janvier 2026", amount: 25, platform: "Leetchi", status: "confirmed" },
];

function WalletRoute() {
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  const filtered = txs.filter((t) => {
    if (filter === "sent") return t.type === "contribution" || t.type === "gift";
    if (filter === "received") return t.type === "received" || t.type === "refund";
    return true;
  });

  const sent = txs.filter((t) => t.type === "contribution" || t.type === "gift").reduce((s, t) => s + t.amount, 0);
  const received = txs.filter((t) => t.type === "received" || t.type === "refund").reduce((s, t) => s + t.amount, 0);
  const eventsCount = new Set(txs.map((t) => t.eventSlug)).size;

  const grouped = filtered.reduce<Record<string, Tx[]>>((acc, t) => {
    const key = t.date.split(" ").slice(1).join(" ");
    (acc[key] = acc[key] ?? []).push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app/settings" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Portefeuille</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Filtres">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <section className="px-4 pt-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-6 text-white shadow-glow">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-80">
            <Wallet className="h-3.5 w-3.5" /> Total 2026
          </div>
          <p className="mt-3 font-serif text-4xl leading-none">{sent} €</p>
          <p className="mt-1 text-xs opacity-80">contribués à {eventsCount} événements</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
              <ArrowUpRight className="h-4 w-4" />
              <p className="mt-1.5 text-[10px] uppercase tracking-wider opacity-80">Envoyé</p>
              <p className="mt-0.5 font-serif text-xl">{sent} €</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
              <ArrowDownLeft className="h-4 w-4" />
              <p className="mt-1.5 text-[10px] uppercase tracking-wider opacity-80">Reçu</p>
              <p className="mt-0.5 font-serif text-xl">{received} €</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary/60 p-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-[11px] text-muted-foreground">
            MaFeliza ne manipule pas d'argent. Les cagnottes sont hébergées par des tiers agréés (Leetchi, Lydia, PayPal). Cet historique est indicatif.
          </p>
        </div>
      </section>

      <div className="sticky top-14 z-10 mt-6 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-secondary p-1">
          {(["all", "sent", "received"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {f === "all" ? "Tout" : f === "sent" ? "Envoyés" : "Reçus"}
            </button>
          ))}
        </div>
      </div>

      <section className="px-4 pt-5">
        {Object.entries(grouped).map(([month, list]) => (
          <div key={month} className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{month}</p>
            <ul className="space-y-2">
              {list.map((t) => {
                const isIn = t.type === "received" || t.type === "refund";
                const Icon = t.type === "gift" ? Gift : t.type === "received" ? Heart : t.type === "refund" ? ArrowDownLeft : CreditCard;
                return (
                  <li key={t.id}>
                    <Link
                      to="/events/$slug"
                      params={{ slug: t.eventSlug }}
                      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5"
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                          isIn ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{t.title}</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {t.event} · {t.platform}
                        </p>
                        {t.status === "pending" && (
                          <span className="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                            En attente
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-serif text-lg leading-none ${isIn ? "text-primary" : ""}`}>
                          {isIn ? "+" : "−"}
                          {t.amount} €
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{t.date.split(" ").slice(0, 2).join(" ")}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            Aucune transaction à afficher.
          </div>
        )}
      </section>

      <div className="mt-4 flex flex-col gap-3 px-4">
        <button className="flex items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-semibold text-background">
          <Download className="h-4 w-4" /> Télécharger le récapitulatif annuel (PDF)
        </button>
        <a
          href="https://www.leetchi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold"
        >
          Voir mes cagnottes externes <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
