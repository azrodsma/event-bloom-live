import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, Users, Sparkles, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/co-organizers")({
  component: CoOrganizers,
  head: () => ({
    meta: [
      { title: "Co-organisateurs · Memento Live" },
      { name: "description", content: "Déléguez la préparation à vos proches : rôles, permissions et tâches partagées." },
      { property: "og:title", content: "Co-organisateurs · Memento Live" },
      { property: "og:description", content: "À plusieurs, c'est plus doux." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Member = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  scope: string[];
  tasks: number;
  status: "active" | "pending";
};

const initial: Member[] = [
  { id: "m1", name: "Léa Durand", role: "Témoin", avatar: "https://i.pravatar.cc/120?img=47", scope: ["Playlist", "Discours"], tasks: 6, status: "active" },
  { id: "m2", name: "Antoine Bernard", role: "Témoin", avatar: "https://i.pravatar.cc/120?img=12", scope: ["Photobooth", "Jeux"], tasks: 4, status: "active" },
  { id: "m3", name: "Sophie Laurent", role: "Wedding-planner", avatar: "https://i.pravatar.cc/120?img=32", scope: ["Budget", "Prestataires", "Timeline"], tasks: 24, status: "active" },
  { id: "m4", name: "Marc Fontaine", role: "Frère du marié", avatar: "https://i.pravatar.cc/120?img=15", scope: ["Surprise"], tasks: 2, status: "pending" },
];

const scopes = ["Playlist", "Discours", "Photobooth", "Budget", "Prestataires", "Timeline", "Surprise", "RSVP", "Modération"];

function CoOrganizers() {
  const [members, setMembers] = useState(initial);
  const [inviteEmail, setInviteEmail] = useState("");

  const approve = (id: string) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: "active" } : m)));

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Co-organisateurs</p>
          <p className="text-xs text-muted-foreground">{members.filter((m) => m.status === "active").length} actifs · {members.filter((m) => m.status === "pending").length} en attente</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Users className="h-6 w-6" />
          <p className="mt-2 font-serif text-2xl leading-tight">À plusieurs, c'est plus doux</p>
          <p className="mt-1 text-sm opacity-90">Vous avez délégué 34 tâches ce mois. Vos co-organisateurs vous font gagner 12h/semaine.</p>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-card">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inviter un proche</p>
          <div className="flex gap-2">
            <input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@exemple.com"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow">
              <Send className="h-4 w-4" /> Inviter
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {scopes.map((s) => (
              <span key={s} className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Équipe</p>
          {members.map((m) => (
            <article key={m.id} className="rounded-3xl bg-surface p-4 shadow-card">
              <div className="flex items-start gap-3">
                <img src={m.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{m.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      m.status === "active" ? "bg-success/15 text-success" : "bg-gold/20 text-gold"
                    }`}>
                      {m.status === "active" ? "Actif" : "En attente"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{m.role} · {m.tasks} tâches assignées</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.scope.map((s) => (
                      <span key={s} className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {m.status === "pending" ? (
                  <button
                    onClick={() => approve(m.id)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold">
                    Gérer
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Suggestion</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Léa et Antoine ont terminé toutes leurs tâches cette semaine. Envoyez-leur un petit message de gratitude ?
          </p>
          <button className="mt-3 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow">
            Envoyer un merci
          </button>
        </section>
      </main>
    </div>
  );
}
