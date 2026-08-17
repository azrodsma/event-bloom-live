import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Star, Video, ChevronRight, Camera, Radio } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { listMyEvents } from "@/lib/events.functions";

export const Route = createFileRoute("/app/cameraman")({
  head: () => ({
    meta: [
      { title: "Espace Caméraman — MaFeliza" },
      { name: "description", content: "Vos missions, votre matériel et la diffusion des lives depuis l'espace caméraman." },
      { property: "og:title", content: "Espace Caméraman — MaFeliza" },
      { property: "og:description", content: "Gérez vos missions et diffusez les lives de vos clients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CameramanSpace,
});

type MyEvent = {
  id: string;
  slug: string;
  title: string;
  type: string;
  location: string | null;
  cover_url: string | null;
  status: string;
  event_date?: string | null;
};

const statusLabel: Record<string, { label: string; className: string }> = {
  live: { label: "En direct", className: "text-live" },
  upcoming: { label: "À venir", className: "text-iris" },
  past: { label: "Terminé", className: "text-muted-foreground" },
};

const gear = [
  { name: "Trépied stabilisé", detail: "Plan fixe cérémonie", tag: "Essentiel" },
  { name: "Micro-cravate HF", detail: "Vœux & discours", tag: "Recommandé" },
  { name: "Encodeur 4G double SIM", detail: "Live sans coupure", tag: "Live" },
];

function CameramanSpace() {
  const { user } = useAuth();
  const list = useServerFn(listMyEvents);
  const { data: missions = [] } = useQuery({
    queryKey: ["cameraman-missions", user?.id],
    enabled: !!user,
    queryFn: async () => (await list()) as MyEvent[],
  });

  return (
    <div className="min-h-screen bg-background pb-nav">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-iris px-4 py-3.5 text-white safe-top">
        <Link to="/app" aria-label="Retour" className="tap grid h-9 w-9 place-items-center rounded-full bg-white/20">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <p className="text-[17px] font-bold">Espace Caméraman</p>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-4">
        {/* Carte studio */}
        <section className="rounded-[20px] bg-iris p-4 text-white shadow-card">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-white/20">
              <Camera className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[16px] font-bold">Studio Vision</span>
              <span className="block truncate text-xs text-white/80">Caméraman professionnel</span>
              <span className="mt-1 flex items-center gap-1 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" /> 4.9
                <span className="font-normal text-white/75">(128 avis)</span>
              </span>
            </span>
          </div>
        </section>

        {/* Missions */}
        <section>
          <h2 className="mb-2.5 px-1 text-[15px] font-bold">Mes missions</h2>
          {!user ? (
            <Link to="/auth" className="block rounded-[18px] bg-surface p-5 text-center text-sm text-muted-foreground shadow-card">
              Connectez-vous avec votre code caméraman
            </Link>
          ) : missions.length === 0 ? (
            <div className="rounded-[18px] bg-surface p-5 text-center text-sm text-muted-foreground shadow-card">
              Aucune mission pour l'instant. Entrez le code caméraman d'un événement pour y accéder.
            </div>
          ) : (
            <div className="space-y-2">
              {missions.slice(0, 6).map((m) => {
                const s = statusLabel[m.status] ?? statusLabel.upcoming;
                const date = m.event_date
                  ? new Date(m.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                  : (m.location ?? "");
                return (
                  <Link
                    key={m.id}
                    to="/events/$slug/live"
                    params={{ slug: m.slug }}
                    className="tap grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] bg-surface p-3 shadow-card"
                  >
                    {m.cover_url ? (
                      <img src={m.cover_url} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-iris-light font-serif text-iris">
                        {m.title.slice(0, 1)}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold">{m.title}</span>
                      <span className="block truncate text-[11.5px] text-muted-foreground">
                        {date} · <span className={`font-semibold ${s.className}`}>{s.label}</span>
                      </span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <Link
          to="/app/create"
          className="tap flex w-full items-center justify-center gap-2 rounded-full bg-iris py-3.5 text-[14.5px] font-bold text-white shadow-card"
        >
          <Radio className="h-4 w-4" /> Diffuser un live
        </Link>

        {/* Matériel */}
        <section>
          <h2 className="mb-2.5 px-1 text-[15px] font-bold">Matériel recommandé</h2>
          <div className="space-y-2">
            {gear.map((g) => (
              <article key={g.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] bg-surface p-3 shadow-card">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-iris-light text-iris">
                  <Video className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold">{g.name}</span>
                  <span className="block truncate text-[11.5px] text-muted-foreground">{g.detail}</span>
                </span>
                <span className="shrink-0 rounded-full bg-iris-light px-2.5 py-1 text-[10.5px] font-semibold text-iris">{g.tag}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
