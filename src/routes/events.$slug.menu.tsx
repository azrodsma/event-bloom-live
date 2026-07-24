import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Wine, Leaf, WheatOff, MilkOff, Fish, Beef, Utensils, Info, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/menu")({
  component: Menu,
  head: () => ({
    meta: [
      { title: "Menu du repas · Memento Live" },
      { name: "description", content: "Découvrez les plats servis, les accords mets & vins et signalez vos allergies avant le grand jour." },
      { property: "og:title", content: "Menu du repas · Memento Live" },
      { property: "og:description", content: "Un menu pensé pour tous les invités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Course = {
  time: string;
  step: string;
  name: string;
  desc: string;
  chef?: string;
  wine?: string;
  tags: Array<"veg" | "gluten-free" | "lactose-free" | "fish" | "meat">;
  image: string;
};

const menu: Course[] = [
  {
    time: "18:30",
    step: "Cocktail",
    name: "Bar à bulles & mignardises",
    desc: "Champagne rosé, gougères tièdes, tartare de dorade au yuzu, verrines de betterave.",
    wine: "Champagne Ruinart rosé",
    tags: ["fish", "veg"],
    image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=600",
  },
  {
    time: "20:00",
    step: "Entrée",
    name: "Foie gras poêlé & figues rôties",
    desc: "Pain d'épices maison, réduction de porto, éclats de noisette du Piémont.",
    chef: "Chef Émile Lambert",
    wine: "Sauternes 2018",
    tags: ["meat"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
  },
  {
    time: "21:00",
    step: "Plat",
    name: "Filet de bœuf, sauce périgueux",
    desc: "Purée de céleri truffée, légumes racines glacés au miel.",
    chef: "Chef Émile Lambert",
    wine: "Saint-Émilion Grand Cru 2016",
    tags: ["meat", "gluten-free"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
  },
  {
    time: "21:15",
    step: "Plat (option végé)",
    name: "Risotto de courge & sauge",
    desc: "Parmesan 24 mois, huile de noisette, tuile de parmesan.",
    wine: "Chablis Premier Cru",
    tags: ["veg"],
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600",
  },
  {
    time: "22:30",
    step: "Dessert",
    name: "Pièce montée aux fruits rouges",
    desc: "Choux vanille de Madagascar, coulis de framboises, éclats de meringue.",
    tags: ["veg"],
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600",
  },
  {
    time: "01:00",
    step: "Late night",
    name: "Bar à ramen & douceurs sucrées",
    desc: "Ramen porc & tofu, crêpes minute, pop-corn caramel.",
    tags: ["veg", "meat"],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
  },
];

const tagMeta = {
  veg: { label: "Végé", icon: Leaf, tint: "bg-emerald-50 text-emerald-700" },
  "gluten-free": { label: "Sans gluten", icon: WheatOff, tint: "bg-amber-50 text-amber-700" },
  "lactose-free": { label: "Sans lactose", icon: MilkOff, tint: "bg-sky-50 text-sky-700" },
  fish: { label: "Poisson", icon: Fish, tint: "bg-blue-50 text-blue-700" },
  meat: { label: "Viande", icon: Beef, tint: "bg-rose-50 text-rose-700" },
} as const;

const allergyOpts = ["Arachides", "Fruits à coque", "Gluten", "Lactose", "Œufs", "Poisson", "Crustacés", "Soja"];

function Menu() {
  const { slug } = useParams({ from: "/events/$slug/menu" });
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "meat" | "fish">("all");
  const [allergies, setAllergies] = useState<string[]>(["Fruits à coque"]);
  const [showForm, setShowForm] = useState(false);

  const toggleAllergy = (a: string) =>
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const filtered = menu.filter((c) => dietFilter === "all" || c.tags.includes(dietFilter));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Menu du repas</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Favori">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Utensils className="h-3.5 w-3.5 text-primary" /> 6 services · 5 h de festin
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Un menu pensé<br />pour vous régaler</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Composé avec le Chef Émile Lambert, autour des produits de la ferme du Château.
        </p>
      </section>

      <section className="px-4">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {(
            [
              { id: "all", label: "Tout" },
              { id: "veg", label: "Végé" },
              { id: "meat", label: "Viande" },
              { id: "fish", label: "Poisson" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setDietFilter(f.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                dietFilter === f.id ? "bg-foreground text-background" : "bg-secondary text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <ol className="mt-5 space-y-4 px-4">
        {filtered.map((c, idx) => (
          <li key={c.name} className="relative">
            {idx < filtered.length - 1 && (
              <span className="absolute left-4 top-16 h-full w-px bg-border" aria-hidden />
            )}
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {idx + 1}
                </span>
                <span className="mt-1 font-mono text-[10px] font-bold tracking-tight text-muted-foreground">
                  {c.time}
                </span>
              </div>
              <div className="min-w-0 flex-1 overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={c.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    {c.step}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="font-serif text-lg leading-tight">{c.name}</h2>
                  <p className="mt-1.5 text-[12px] text-muted-foreground">{c.desc}</p>

                  {c.wine && (
                    <p className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                      <Wine className="h-3.5 w-3.5" /> {c.wine}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.tags.map((t) => {
                      const meta = tagMeta[t];
                      const Icon = meta.icon;
                      return (
                        <span key={t} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.tint}`}>
                          <Icon className="h-2.5 w-2.5" /> {meta.label}
                        </span>
                      );
                    })}
                    {c.chef && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">👨‍🍳 {c.chef}</span>}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="mx-4 mt-6 rounded-3xl border border-border/60 bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Info className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg leading-tight">Allergies & préférences</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Sarah & Thomas ont besoin de connaître vos restrictions avant le 15 mai.
            </p>
            {allergies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {allergies.map((a) => (
                  <span key={a} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {a}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowForm((s) => !s)}
              className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background"
            >
              {showForm ? "Enregistrer" : allergies.length ? "Modifier" : "Signaler mes allergies"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mt-4 grid grid-cols-2 gap-1.5">
            {allergyOpts.map((a) => {
              const on = allergies.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleAllergy(a)}
                  className={`rounded-2xl border-2 px-3 py-2 text-left text-xs font-semibold ${
                    on ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <div className="mx-4 mt-4 flex items-center gap-2 rounded-3xl bg-secondary/60 p-3.5 text-[11px] text-muted-foreground">
        <Leaf className="h-4 w-4 shrink-0 text-emerald-600" />
        <p>Produits locaux à 85 %. Menu enfants et sans gluten disponibles sur demande.</p>
      </div>
    </div>
  );
}
