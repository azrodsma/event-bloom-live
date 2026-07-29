import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Plus, Crown, Shield, Eye, Copy, Check, Mail, Trash2, LogIn } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import {
  listEventMembers,
  addEventMember,
  updateMemberRole,
  removeEventMember,
} from "@/lib/members.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/events/$slug/contributors")({
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
  loader: async ({ params }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) throw notFound();
    return { event: adaptEvent(db), dbId: db.id };
  },
  component: Contributors,
});

type Role = "owner" | "coorganizer" | "guest";

const roleMeta: Record<Role, { icon: typeof Crown; tone: string; label: string; desc: string }> = {
  owner: { icon: Crown, tone: "bg-primary/10 text-primary", label: "Propriétaire", desc: "Contrôle total" },
  coorganizer: { icon: Shield, tone: "bg-accent/20 text-foreground", label: "Co-organisateur", desc: "Peut tout modifier" },
  guest: { icon: Eye, tone: "bg-muted text-muted-foreground", label: "Invité", desc: "Consultation" },
};

function Contributors() {
  const { event, dbId } = Route.useLoaderData();
  const { user } = useAuth();
  const qc = useQueryClient();

  const list = useServerFn(listEventMembers);
  const add = useServerFn(addEventMember);
  const upd = useServerFn(updateMemberRole);
  const del = useServerFn(removeEventMember);

  const key = ["members", dbId] as const;
  const { data: members = [] } = useQuery({
    queryKey: key,
    enabled: !!user,
    queryFn: () => list({ data: { eventId: dbId } }),
  });

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"coorganizer" | "guest">("coorganizer");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMutation = useMutation({
    mutationFn: () => add({ data: { eventId: dbId, email: inviteEmail.trim(), role: inviteRole } }),
    onSuccess: () => {
      setInviteEmail("");
      setShowInvite(false);
      setError(null);
      qc.invalidateQueries({ queryKey: key });
    },
    onError: (e: Error) => setError(e.message),
  });

  const updMutation = useMutation({
    mutationFn: (v: { memberId: string; role: "coorganizer" | "guest" }) =>
      upd({ data: { memberId: v.memberId, eventId: dbId, role: v.role } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const delMutation = useMutation({
    mutationFn: (memberId: string) => del({ data: { memberId, eventId: dbId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/rsvp/${event.slug}` : `/rsvp/${event.slug}`;
  const copyLink = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug: event.slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Équipe</p>
        <button
          onClick={() => setShowInvite(true)}
          disabled={!user}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          aria-label="Inviter"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/60 to-background p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Co-organiser à plusieurs</p>
          <h1 className="mt-1 font-serif text-2xl leading-tight">{event.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Invitez vos témoins, parents ou amis à gérer l'événement avec vous.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-border bg-background/60 p-3">
            <p className="min-w-0 flex-1 truncate text-xs font-mono text-muted-foreground">{inviteLink}</p>
            <button onClick={copyLink} className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background">
              {copied ? <><Check className="h-3.5 w-3.5" /> Copié</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
            </button>
          </div>
        </div>

        {!user ? (
          <div className="mt-8 flex items-center gap-3 rounded-3xl bg-surface p-5 shadow-card">
            <LogIn className="h-5 w-5 text-primary" />
            <p className="flex-1 text-sm">Connectez-vous pour voir et gérer l'équipe.</p>
            <Link to="/auth" className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Connexion</Link>
          </div>
        ) : (
          <section className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-serif text-xl">Membres · {members.length}</h2>
            </div>
            {members.length === 0 ? (
              <p className="rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground">Aucun membre pour le moment.</p>
            ) : (
              <ul className="space-y-3">
                {members.map((m) => {
                  const meta = roleMeta[m.role];
                  const RoleIcon = meta.icon;
                  const isOwner = m.role === "owner";
                  return (
                    <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                      <img
                        src={m.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.display_name)}`}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.display_name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">Depuis {new Date(m.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      {isOwner ? (
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${meta.tone}`}>
                          <RoleIcon className="h-3.5 w-3.5" /> {meta.label}
                        </span>
                      ) : (
                        <>
                          <select
                            value={m.role}
                            onChange={(e) => updMutation.mutate({ memberId: m.id, role: e.target.value as "coorganizer" | "guest" })}
                            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none focus:border-primary"
                            aria-label={`Rôle de ${m.display_name}`}
                          >
                            <option value="coorganizer">Co-organisateur</option>
                            <option value="guest">Invité</option>
                          </select>
                          <button
                            onClick={() => delMutation.mutate(m.id)}
                            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Retirer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

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
                    <p className="text-sm font-medium">{meta.label}</p>
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
            <h3 className="font-serif text-xl">Ajouter un membre</h3>
            <p className="mt-1 text-sm text-muted-foreground">La personne doit déjà avoir un compte Memento Live.</p>

            <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Adresse email / pseudo</label>
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
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(["coorganizer", "guest"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setInviteRole(r)}
                  className={`rounded-2xl border px-3 py-3 text-xs font-medium ${
                    inviteRole === r ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"
                  }`}
                >
                  {roleMeta[r].label}
                </button>
              ))}
            </div>

            {error && <p className="mt-3 rounded-2xl bg-destructive/10 p-3 text-xs text-destructive">{error}</p>}

            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowInvite(false)} className="flex-1 rounded-full border border-border py-3 text-sm font-medium">
                Annuler
              </button>
              <button
                onClick={() => addMutation.mutate()}
                disabled={!inviteEmail.trim() || addMutation.isPending}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                {addMutation.isPending ? "Ajout…" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
