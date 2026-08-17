import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { eventErrorComponent, eventNotFoundComponent } from "@/components/RouteState";
import { getEventBySlug, listEventStories } from "@/lib/events.functions";
import floralFrame from "@/assets/floral-frame.png";

const routeLoader = async ({ params }: { params: { slug: string } }) => {
  const event = await getEventBySlug({ data: { slug: params.slug } });
  if (!event) throw notFound();
  const stories = await listEventStories({ data: { eventId: event.id } });
  return { event, stories };
};
type RouteLoaderData = Awaited<ReturnType<typeof routeLoader>>;

export const Route = createFileRoute("/events/$slug/faire-part")({
  head: ({ params }) => ({
    meta: [
      { title: `Faire-part — ${params.slug} — MaFeliza` },
      { name: "description", content: "Le faire-part interactif de l'événement, avec compte à rebours et aperçu des stories." },
      { property: "og:title", content: "Vous êtes invité — MaFeliza" },
      { property: "og:description", content: "Découvrez le faire-part interactif et suivez l'événement en direct." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: routeLoader,
  errorComponent: eventErrorComponent,
  notFoundComponent: eventNotFoundComponent,
  component: FairePart,
});

function useCountdown(target?: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = target ? new Date(target).getTime() - now : 0;
  const clamped = Math.max(0, ms);
  return {
    days: Math.floor(clamped / 86400000),
    hours: Math.floor((clamped % 86400000) / 3600000),
    minutes: Math.floor((clamped % 3600000) / 60000),
    seconds: Math.floor((clamped % 60000) / 1000),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function FairePart() {
  const { event, stories } = Route.useLoaderData() as RouteLoaderData;
  const c = useCountdown(event.event_date);

  const dateStr = event.event_date
    ? new Date(event.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const kicker =
    event.type === "mariage" || event.type === "wedding"
      ? "se marient"
      : event.type
        ? `vous invitent · ${event.type}`
        : "vous invitent";

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <main className="mx-auto max-w-md px-3 pb-10 safe-top">
        {/* Carte faire-part */}
        <section className="relative overflow-hidden rounded-[22px] bg-[#FBF1E9] px-6 pb-7 pt-10 text-center shadow-card">
          <img
            src={floralFrame}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={1024}
            height={1408}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="relative">
            <Heart className="mx-auto h-8 w-8 text-primary/50" strokeWidth={1.5} />
            <h1 className="mt-6 font-script text-[38px] leading-[1.1] text-foreground">{event.title}</h1>
            <p className="mt-2 font-script text-lg italic text-foreground/70">{kicker}</p>

            {dateStr && <p className="mt-5 text-[21px] font-medium tracking-wide text-foreground">{dateStr}</p>}

            <div className="mx-auto mt-3 flex max-w-[240px] items-center gap-2">
              <span className="h-px flex-1 bg-foreground/15" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
              <span className="h-px flex-1 bg-foreground/15" />
            </div>

            <div className="mt-4 grid grid-cols-4">
              {[
                { v: c.days, l: "JOURS" },
                { v: c.hours, l: "HEURES" },
                { v: c.minutes, l: "MIN" },
                { v: c.seconds, l: "SEC" },
              ].map((b) => (
                <div key={b.l}>
                  <div className="text-[26px] font-bold leading-none text-foreground">{pad(b.v)}</div>
                  <div className="mt-1 text-[9px] font-semibold tracking-[0.14em] text-foreground/50">{b.l}</div>
                </div>
              ))}
            </div>

            <Link
              to="/auth"
              className="tap mt-6 block w-full rounded-[14px] bg-gradient-primary px-5 py-3.5 text-center text-[15px] font-semibold leading-tight text-white shadow-glow"
            >
              Créer votre compte
              <span className="block font-normal">pour voir les stories</span>
            </Link>
          </div>
        </section>

        {/* Aperçu des stories */}
        <section className="mt-5">
          <h2 className="px-1 text-[17px] font-bold">Aperçu des stories</h2>
          <div className="scrollbar-hide -mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1">
            {(stories.length
              ? stories.slice(0, 8).map((s) => ({ id: s.id, url: s.media_url }))
              : Array.from({ length: 5 }, (_, i) => ({ id: `ph-${i}`, url: event.cover_url ?? "" }))
            ).map((s, i) => (
              <Link
                key={s.id}
                to="/auth"
                aria-label="Créer un compte pour voir les stories"
                className={`tap block h-[74px] w-[74px] shrink-0 rounded-full p-[2.5px] ${
                  i % 4 === 3 ? "bg-sky-300" : "bg-gradient-primary"
                }`}
              >
                {s.url ? (
                  <img
                    src={s.url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full rounded-full object-cover ring-2 ring-[#FDF6F0]"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center rounded-full bg-muted ring-2 ring-[#FDF6F0]" />
                )}
              </Link>
            ))}
          </div>
          <p className="mt-3 px-1 text-xs text-muted-foreground">
            Les stories sont réservées aux invités connectés · {event.location ?? "Lieu communiqué prochainement"}
          </p>
        </section>
      </main>
    </div>
  );
}
