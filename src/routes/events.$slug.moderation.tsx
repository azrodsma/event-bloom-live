import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Shield, Check, X, AlertTriangle, Users, MessageCircle, Ban, Trash2, Eye, Sparkles, Radio } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/moderation")({
  component: Moderation,
  head: () => ({
    meta: [
      { title: "Modération du Live · Memento Live" },
      { name: "description", content: "Validez ou masquez messages et médias en direct, gérez les avertissements et gardez le chat bienveillant." },
      { property: "og:title", content: "Modération du Live · Memento Live" },
      { property: "og:description", content: "Tableau de bord de modération en temps réel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type ItemKind = "message" | "photo" | "reaction";
type Severity = "info" | "warn" | "high";

interface Item {
  id: string;
  kind: ItemKind;
  author: string;
  avatar: string;
  content: string;
  time: string;
  severity: Severity;
  reasons: string[];
  media?: string;
  reported?: number;
}

const initial: Item[] = [
  { id: "m1", kind: "message", author: "Julien M.", avatar: "https://i.pravatar.cc/64?img=12", content: "Trop belle cette robe 😍", time: "20:14", severity: "info", reasons: ["Auto-check ✓"] },
  { id: "m2", kind: "message", author: "Anonyme", avatar: "https://i.pravatar.cc/64?img=52", content: "Blague douteuse à propos de l'ex du marié…", time: "20:12", severity: "high", reasons: ["Signalé 3 fois", "Détection IA · inapproprié"], reported: 3 },
  { id: "m3", kind: "photo", author: "Camille R.", avatar: "https://i.pravatar.cc/64?img=32", content: "Photo de la piste de danse", time: "20:10", severity: "info", reasons: ["Auto-check ✓"], media: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop" },
  { id: "m4", kind: "message", author: "Paul V.", avatar: "https://i.pravatar.cc/64?img=14", content: "Lien externe non vérifié : bit.ly/xxxx", time: "20:07", severity: "warn", reasons: ["Lien externe", "Vérifier"] },
  { id: "m5", kind: "photo", author: "Antoine K.", avatar: "https://i.pravatar.cc/64?img=13", content: "Selfie de groupe", time: "20:05", severity: "info", reasons: ["Auto-check ✓"], media: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&auto=format&fit=crop" },
  { id: "m6", kind: "reaction", author: "Léa D.", avatar: "https://i.pravatar.cc/64?img=44", content: "Spam de cœurs : 42 en 3 secondes", time: "20:03", severity: "warn", reasons: ["Rythme suspect", "Limiter"] },
  { id: "m7", kind: "message", author: "Nadia O.", avatar: "https://i.pravatar.cc/64?img=45", content: "Où sont les toilettes svp ?", time: "20:01", severity: "info", reasons: ["Auto-check ✓"] },
];

const severityMeta: Record<Severity, { label: string; ring: string; badge: string; icon: typeof Check }> = {
  info: { label: "OK", ring: "border-border/50", badge: "bg-primary/10 text-primary", icon: Check },
  warn: { label: "À vérifier", ring: "border-amber-500/40", badge: "bg-amber-500/15 text-amber-700", icon: AlertTriangle },
  high: { label: "À traiter", ring: "border-destructive/50 ring-1 ring-destructive/30", badge: "bg-destructive/10 text-destructive", icon: AlertTriangle },
};

const kindLabel: Record<ItemKind, string> = { message: "Message", photo: "Photo", reaction: "Réactions" };

function Moderation() {
  const { slug } = useParams({ from: "/events/$slug/moderation" });
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"pending" | Severity | "all">("pending");
  const [autoMod, setAutoMod] = useState(true);

  const stats = useMemo(
    () => ({
      pending: items.length,
      high: items.filter((i) => i.severity === "high").length,
      warn: items.filter((i) => i.severity === "warn").length,
      approved: 128,
    }),
    [items],
  );

  const filtered = items.filter((i) => {
    if (filter === "all" || filter === "pending") return true;
    return i.severity === filter;
  });

  function decide(id: string, action: "approve" | "hide") {
    void action;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug/live" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="grid h-2 w-2 place-items-center rounded-full bg-destructive animate-pulse" />
          <p className="font-serif text-lg">Modération Live</p>
        </div>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-destructive/10 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-destructive" /> Tableau de bord modérateur
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Gardez le chat bienveillant</h1>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-lg leading-none">{stats.pending}</p>
            <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">En attente</p>
          </div>
          <div className="rounded-2xl bg-destructive/10 p-3 text-center">
            <p className="font-serif text-lg leading-none text-destructive">{stats.high}</p>
            <p className="mt-1 text-[9px] uppercase tracking-wider text-destructive/80">À traiter</p>
          </div>
          <div className="rounded-2xl bg-amber-500/10 p-3 text-center">
            <p className="font-serif text-lg leading-none text-amber-700">{stats.warn}</p>
            <p className="mt-1 text-[9px] uppercase tracking-wider text-amber-700/80">À vérifier</p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-center">
            <p className="font-serif text-lg leading-none text-primary">{stats.approved}</p>
            <p className="mt-1 text-[9px] uppercase tracking-wider text-primary/80">Validés</p>
          </div>
        </div>
      </section>

      <div className="sticky top-14 z-10 space-y-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl">
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {(["pending", "high", "warn", "info", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                filter === f ? "border-foreground bg-foreground text-background" : "border-border bg-card"
              }`}
            >
              {f === "pending" ? "À valider" : f === "all" ? "Tout" : severityMeta[f as Severity].label}
            </button>
          ))}
        </div>
        <label className="flex items-center justify-between rounded-2xl bg-secondary/60 px-3 py-2">
          <span className="flex items-center gap-2 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold">Auto-modération IA</span>
            <span className="text-muted-foreground">· filtre langage & spam</span>
          </span>
          <button
            onClick={() => setAutoMod((v) => !v)}
            className={`relative h-5 w-9 rounded-full transition-colors ${autoMod ? "bg-primary" : "bg-border"}`}
            aria-label="Toggle auto-mod"
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                autoMod ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      <ul className="space-y-3 px-4 pt-4">
        {filtered.length === 0 ? (
          <li className="rounded-3xl border border-dashed border-border py-10 text-center">
            <Check className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 text-sm font-medium">Rien à modérer, tout est calme.</p>
          </li>
        ) : (
          filtered.map((it) => {
            const meta = severityMeta[it.severity];
            const SevIcon = meta.icon;
            return (
              <li key={it.id} className={`overflow-hidden rounded-3xl border bg-card ${meta.ring}`}>
                <div className="flex items-start gap-3 p-4">
                  <img src={it.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium">{it.author}</p>
                      <span className="text-[10px] text-muted-foreground">{it.time}</span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                        {kindLabel[it.kind]}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${meta.badge}`}>
                        <SevIcon className="h-2.5 w-2.5" /> {meta.label}
                      </span>
                      {it.reported && (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] font-semibold text-destructive">
                          {it.reported} signalements
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-snug">{it.content}</p>
                    {it.media && (
                      <img src={it.media} alt="" className="mt-3 aspect-video w-full rounded-xl object-cover" loading="lazy" />
                    )}
                    <ul className="mt-3 flex flex-wrap gap-1">
                      {it.reasons.map((r) => (
                        <li key={r} className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium ring-1 ring-border">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-border/60 bg-background/30 text-xs font-semibold">
                  <button
                    onClick={() => decide(it.id, "approve")}
                    className="flex items-center justify-center gap-1.5 py-3 text-primary hover:bg-primary/5"
                  >
                    <Check className="h-4 w-4" /> Valider
                  </button>
                  <button
                    onClick={() => decide(it.id, "hide")}
                    className="flex items-center justify-center gap-1.5 border-l border-border/60 py-3 hover:bg-secondary"
                  >
                    <Eye className="h-4 w-4" /> Masquer
                  </button>
                  <button className="flex items-center justify-center gap-1.5 border-l border-border/60 py-3 text-amber-700 hover:bg-amber-500/5">
                    <Ban className="h-4 w-4" /> Avertir
                  </button>
                  <button
                    onClick={() => decide(it.id, "hide")}
                    className="flex items-center justify-center gap-1.5 border-l border-border/60 py-3 text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <section className="mx-4 mt-8 rounded-3xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Users className="h-3.5 w-3.5 text-primary" /> Modérateurs actifs
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["47", "15", "32"].map((n) => (
              <img key={n} src={`https://i.pravatar.cc/64?img=${n}`} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">3 modérateurs en ligne</p>
            <p className="text-[11px] text-muted-foreground">Isabelle B., Marc B., Camille R.</p>
          </div>
          <Link to="/events/$slug/contributors" params={{ slug }} className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold">
            Gérer
          </Link>
        </div>
      </section>

      <Link
        to="/events/$slug/live"
        params={{ slug }}
        className="mx-4 mt-4 flex items-center justify-center gap-2 rounded-full bg-destructive py-3 text-sm font-semibold text-white"
      >
        <Radio className="h-4 w-4" /> Retour au Live
      </Link>
      <button className="mx-4 mt-2 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold">
        <MessageCircle className="h-4 w-4" /> Envoyer une annonce à tous
      </button>
    </div>
  );
}
