import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, Sparkles, Calendar, Heart, Plus, Check, Baby, Cake } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/family")({
  component: Family,
  head: () => ({
    meta: [
      { title: "Cercle familial · Memento Live" },
      { name: "description", content: "Rassemblez votre tribu, partagez les événements et gardez un fil unique des grandes occasions." },
      { property: "og:title", content: "Cercle familial · Memento Live" },
      { property: "og:description", content: "Une famille, un fil, tous les souvenirs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Member = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  birthday?: string;
  contributor?: boolean;
};

type Event = {
  id: string;
  title: string;
  when: string;
  host: string;
  cover: string;
  attending: number;
};

const members: Member[] = [
  { id: "m1", name: "Sarah", role: "Vous", avatar: "https://i.pravatar.cc/80?img=47", contributor: true },
  { id: "m2", name: "Thomas", role: "Époux", avatar: "https://i.pravatar.cc/80?img=12", contributor: true },
  { id: "m3", name: "Isabelle", role: "Maman de Sarah", avatar: "https://i.pravatar.cc/80?img=32", birthday: "12 août" },
  { id: "m4", name: "Marc", role: "Papa de Sarah", avatar: "https://i.pravatar.cc/80?img=15", birthday: "3 mars" },
  { id: "m5", name: "Léa", role: "Sœur de Sarah", avatar: "https://i.pravatar.cc/80?img=44", contributor: true },
  { id: "m6", name: "Antoine", role: "Frère de Thomas", avatar: "https://i.pravatar.cc/80?img=13", birthday: "27 septembre" },
  { id: "m7", name: "Emma", role: "Nièce · 6 ans", avatar: "https://i.pravatar.cc/80?img=48", birthday: "18 juin" },
  { id: "m8", name: "Mamie Rose", role: "Grand-mère", avatar: "https://i.pravatar.cc/80?img=45", birthday: "9 décembre" },
];

const upcoming: Event[] = [
  { id: "e1", title: "Baptême d'Emma", when: "Sam. 12 sept.", host: "Léa & Julien", cover: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600", attending: 22 },
  { id: "e2", title: "80 ans de Mamie Rose", when: "Dim. 9 déc.", host: "Toute la famille", cover: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600", attending: 34 },
];

function Family() {
  const [joined, setJoined] = useState<Set<string>>(new Set(["e1"]));

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Ma famille</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Ajouter">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/20 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-primary" /> Cercle privé
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Famille Bernard-Moreau</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Un fil unique pour vos {members.length} membres et les grands rendez-vous de l'année.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none">{members.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Membres</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none text-primary">{upcoming.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Événements</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none">128</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Souvenirs</p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Prochains rendez-vous</h2>
          <Link to="/app/agenda" className="text-[11px] text-primary hover:underline">Voir tout</Link>
        </div>
        <ul className="space-y-3">
          {upcoming.map((e) => {
            const isJoined = joined.has(e.id);
            return (
              <li key={e.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={e.cover} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-x-4 bottom-3 text-white">
                    <p className="text-[11px] uppercase tracking-widest text-white/80"><Calendar className="mr-1 inline h-3 w-3" />{e.when}</p>
                    <p className="mt-0.5 font-serif text-xl leading-tight">{e.title}</p>
                    <p className="text-[11px] text-white/80">Organisé par {e.host}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-[11px] text-muted-foreground"><Users className="mr-0.5 inline h-3 w-3" /> {e.attending + (isJoined ? 1 : 0)} présents</span>
                  <button
                    onClick={() => setJoined((s) => { const n = new Set(s); n.has(e.id) ? n.delete(e.id) : n.add(e.id); return n; })}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-[11px] font-bold ${isJoined ? "bg-primary/10 text-primary" : "bg-foreground text-background"}`}
                  >
                    {isJoined ? <><Check className="h-3 w-3" /> Confirmé</> : "Je viens"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Membres</h2>
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <div className="relative">
                <img src={m.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                {m.contributor && (
                  <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                    <Sparkles className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{m.role}</p>
              </div>
              {m.birthday && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                  <Cake className="h-3 w-3 text-primary" /> {m.birthday}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl border border-dashed border-border p-5 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary">
          <Baby className="h-5 w-5 text-primary" />
        </span>
        <p className="mt-3 font-serif text-lg">Nouvelle arrivée dans la famille ?</p>
        <p className="mx-auto mt-1 max-w-xs text-[11px] text-muted-foreground">
          Créez un profil, invitez ses proches, préparez la fête de bienvenue.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Ajouter un membre
        </button>
      </section>
    </div>
  );
}
