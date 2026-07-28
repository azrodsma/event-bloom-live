import { ExternalLink, Gift } from "lucide-react";

type Props = {
  url?: string | null;
  goal?: number | null;
  current?: number | null;
  compact?: boolean;
};

export function CagnotteCard({ url, goal, current, compact }: Props) {
  if (!url && !goal && !current) return null;
  const g = Number(goal ?? 0);
  const c = Number(current ?? 0);
  const pct = g > 0 ? Math.min(100, Math.round((c / g) * 100)) : 0;
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <section className={`rounded-3xl border border-gold/40 bg-gradient-to-br from-cream to-gold-light/40 p-5 ${compact ? "" : "shadow-card"}`}>
      <div className="flex items-center gap-2 text-gold">
        <Gift className="h-4 w-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Cagnotte externe</p>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-serif text-3xl">{fmt(c)}</p>
        {g > 0 && <p className="text-sm text-muted-foreground">/ {fmt(g)}</p>}
      </div>
      {g > 0 && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/60">
          <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Memento Live ne collecte pas les fonds. Les contributions se font directement chez notre partenaire.
      </p>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Contribuer <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </section>
  );
}
