import { Logo } from "@/components/Logo";

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: "Produit",
    links: [
      ["Concept", "/#concept"],
      ["Fonctionnalités", "/#features"],
      ["Événements", "/events"],
      ["Tarifs", "/#pricing"],
    ],
  },
  {
    title: "Commencer",
    links: [
      ["Créer un événement", "/auth"],
      ["J'ai un code", "/join"],
      ["Connexion", "/auth"],
    ],
  },
  {
    title: "Moments",
    links: [
      ["Mariage", "/events"],
      ["Baptême", "/events"],
      ["Anniversaire", "/events"],
      ["Baby shower", "/events"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          <div className="col-span-2 max-w-xs lg:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">
              Le réseau social privé de vos plus beaux événements : live, feed et livre d'or multimédia.
            </p>
            <div className="rule-gold mt-4 w-16" />
          </div>
          {columns.map((col) => (

            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="transition-colors hover:text-foreground">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MaFeliza · Vos événements, en direct, en souvenirs.</p>
          <p>Cagnottes externes (Leetchi, Lydia…) · Live via YouTube &amp; Twitch</p>
        </div>
      </div>
    </footer>
  );
}
