import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Crown, Shield, Eye, MoreVertical, Copy, Check, Mail } from "lucide-react";
import { useState } from "react";
import { findEvent } from "@/lib/mock-data";

export const Route = createFileRoute("/events/$slug/contributors")({
  component: Contributors,
  head: () => ({
    meta: [
      { title: "Co-organisateurs · Memento Live" },
      { name: "description", content: "Invitez des proches à co-organiser votre événement et attribuez leurs permissions." },
      { property: "og:title", content: "Co-organisateurs · Memento Live" },
      { property: "og:description", content: "Gérez l'équipe qui organise l'événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Role = "Propriétaire" | "Co-organisateur" | "Modérateur" | "Lecteur";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  status: "Actif" | "Invitation envoyée";
}

const initialMembers: Member[] = [
  { id: "m1", name: "Sarah Bernard", email: "sarah@memento.live", avatar: "https://i.pravatar.cc/80?img=47", role: "Propriétaire", status: "Actif" },
  { id: "m2", name: "Thomas Bernard", email: "thomas@memento.live", avatar: "https://i.pravatar.cc/80?img=15", role: "Co-organisateur", status: "Actif" },
  { id: "m3", name: "Camille Rousseau", email: "camille.r@icloud.com", avatar: "https://i.pravatar.cc/80?img=32", role: "Modérateur", status: "Actif" },
  { id: "m4", name: "Julien Mercier", email: "julien.m@gmail.com", avatar: "https://i.pravatar.cc/80?img=12", role: "Lecteur", status: "Invitation envoyée" },
];

const roleMeta: Record<Role, { icon: typeof Crown; tone: string; desc: string }> = {
  "Propriétaire": { icon: Crown, tone: "bg-primary/10 text-primary", desc: "Contrôle total" },
  "Co-organisateur": { icon: Shield, tone: "bg-accent/20 text-foreground", desc: "Peut tout modifier sauf supprimer" },
  "Modérateur": { icon: Shield, tone: "bg-secondary text-foreground", desc: "Modère les messages et médias" },
  "Lecteur": { icon: Eye, tone: "bg-muted text-muted-foreground", desc: "Consultation uniquement" },
};

function Contributors() {
  const { slug } = useParams({ from: "/events/$slug/contributors" });
  const event = findEvent(slug);
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Co-organisateur");
  const [copied, setCopied] = useState(false);

  const inviteLink = `https://memento.live/join?event=${slug}`;

  function copyLink() {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function sendInvite() {
    if (!inviteEmail.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        name: inviteEmail.split("@")[0],
        email: inviteEmail.trim(),
        avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70)}`,
        role: inviteRole,
        status: "Invitation envoyée",
      },
    ]);
    setInviteEmail("");
    setShowInvite(false);
  }

  function updateRole(id: string, role: Role) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Équipe</p>
        <button
          onClick={() => setShowInvite(true)}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"
          aria-label="Inviter"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/60 to-background p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Co-organiser à plusieurs</p>
          <h1 className="mt-1 font-serif text-2xl leading-tight">{event?.title ?? "Votre événement"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Invitez vos témoins, parents ou amis à gérer l'événement avec vous. Chaque rôle a des permissions dédiées.
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-border bg-background/60 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-mono text-muted-foreground">{inviteLink}</p>
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background"
            >
              {copied ? <><Check className="h-3.5 w-3.5" /> Copié</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
            </button>
          </div>
        </div>

        <section className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-xl">Membres · {members.length}</h2>
            <button onClick={() => setShowInvite(true)} className="text-xs font-medium text-primary hover:underline">
              + Inviter
            </button>
          </div>
          <ul className="space-y-3">
            {members.map((m) => {
              const meta = roleMeta[m.role];
              const RoleIcon = meta.icon;
              return (
                <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                  <img src={m.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      {m.status === "Invitation envoyée" && (
                        <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-medium">En attente</span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  {m.role === "Propriétaire" ? (
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${meta.tone}`}>
                      <RoleIcon className="h-3.5 w-3.5" /> {m.role}
                    </span>
                  ) : (
                    <select
                      value={m.role}
                      onChange={(e) => updateRole(m.id, e.target.value as Role)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none focus:border-primary"
                      aria-label={`Rôle de ${m.name}`}
                    >
                      {(["Co-organisateur", "Modérateur", "Lecteur"] as Role[]).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  )}
                  <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted" aria-label="Plus d'options">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl">Rôles disponibles</h2>
          <ul className="mt-3 space-y-2">
            {(Object.keys(roleMeta) as Role[]).map((r) => {
              const meta = roleMeta[r];
              const RoleIcon = meta.icon;
              return (
                <li key={r} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${meta.tone}`}>
                    <RoleIcon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r}</p>
                    <p className="text-xs text-muted-foreground">{meta.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={() => setShowInvite(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-background p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl">Inviter un co-organisateur</h3>
            <p className="mt-1 text-sm text-muted-foreground">Il recevra un email d'invitation à rejoindre l'équipe.</p>

            <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Adresse email</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-4 py-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="prenom@exemple.com"
                type="email"
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>

            <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Rôle</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {(["Co-organisateur", "Modérateur", "Lecteur"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setInviteRole(r)}
                  className={`rounded-2xl border px-3 py-3 text-xs font-medium ${
                    inviteRole === r ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowInvite(false)} className="flex-1 rounded-full border border-border py-3 text-sm font-medium">
                Annuler
              </button>
              <button
                onClick={sendInvite}
                disabled={!inviteEmail.trim()}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
