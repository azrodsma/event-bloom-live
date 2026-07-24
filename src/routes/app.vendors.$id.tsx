import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { ArrowLeft, Star, MapPin, ShieldCheck, MessageCircle, Bookmark, Share2, Check } from "lucide-react";
import { findVendor } from "@/lib/vendors";

export const Route = createFileRoute("/app/vendors/$id")({
  component: VendorDetail,
  loader: ({ params }) => {
    const vendor = findVendor(params.id);
    if (!vendor) throw notFound();
    return { vendor };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.vendor.name} · Prestataire Memento Live` },
      {
        name: "description",
        content: `${loaderData?.vendor.name} — ${loaderData?.vendor.category} à ${loaderData?.vendor.city}. ${loaderData?.vendor.bio.slice(0, 120)}`,
      },
      { property: "og:title", content: `${loaderData?.vendor.name} · Memento Live` },
      { property: "og:description", content: loaderData?.vendor.bio ?? "" },
      { property: "og:type", content: "profile" },
      ...(loaderData?.vendor.cover
        ? [
            { property: "og:image", content: loaderData.vendor.cover },
            { name: "twitter:image", content: loaderData.vendor.cover },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function VendorDetail() {
  const { id } = useParams({ from: "/app/vendors/$id" });
  const vendor = findVendor(id)!;

  return (
    <div className="pb-32">
      <div className="relative">
        <img src={vendor.cover} alt={vendor.name} className="h-72 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <Link
          to="/app/vendors"
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute right-4 top-4 flex gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur" aria-label="Sauvegarder">
            <Bookmark className="h-5 w-5" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur" aria-label="Partager">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4">
        <div className="-mt-12 flex items-end gap-4">
          <img
            src={vendor.avatar}
            alt=""
            className="h-24 w-24 rounded-3xl border-4 border-background object-cover shadow-lg"
          />
          <div className="min-w-0 flex-1 pb-2">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-serif text-2xl leading-tight">{vendor.name}</h1>
              {vendor.verified && <ShieldCheck className="h-5 w-5 text-primary" aria-label="Vérifié" />}
            </div>
            <p className="text-sm text-muted-foreground">{vendor.category}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">· {vendor.reviews} avis</span>
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {vendor.city}
          </span>
          <span className="font-semibold text-primary">{vendor.price}</span>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-foreground/90">{vendor.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {vendor.tags.map((t) => (
            <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs">
              {t}
            </span>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="mb-3 font-serif text-lg">Portfolio</h2>
          <div className="grid grid-cols-2 gap-2">
            {vendor.gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${vendor.name} portfolio ${i + 1}`}
                className={`w-full rounded-2xl object-cover ${i % 3 === 0 ? "col-span-2 h-64" : "h-40"}`}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-5">
          <h2 className="font-serif text-lg">Ce qui est inclus</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "Rendez-vous découverte offert",
              "Devis personnalisé sous 48 h",
              "Contrat signé électroniquement",
              "Support Memento Live en cas de litige",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 font-serif text-lg">Avis récents</h2>
          <ul className="space-y-3">
            {[
              { author: "Sarah & Thomas", text: "Un travail d'orfèvre, chaque photo raconte une histoire. Nous sommes bouleversés.", stars: 5 },
              { author: "Léa D.", text: "Discrète, à l'écoute, ultra pro. Livraison rapide et album magnifique.", stars: 5 },
              { author: "Antoine R.", text: "Le rendu est cinématographique. Merci mille fois.", stars: 4 },
            ].map((r) => (
              <li key={r.author} className="rounded-2xl border border-border/60 bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.author}</p>
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.stars ? "fill-primary text-primary" : "text-border"}`} />
                    ))}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button className="grid h-12 w-12 place-items-center rounded-full border border-border" aria-label="Message">
            <MessageCircle className="h-5 w-5" />
          </button>
          <button className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
            Demander un devis
          </button>
        </div>
      </div>
    </div>
  );
}
