import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Users, Gift, Video, Camera, Bell } from "lucide-react";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Memento Live" },
      { name: "description", content: "Toutes vos notifications d'événements." },
    ],
  }),
  component: Notifications,
});

type Notif = {
  id: string;
  icon: typeof Heart;
  color: string;
  title: string;
  detail: string;
  time: string;
  event?: string;
  unread?: boolean;
};

const notifs: Notif[] = [
  { id: "n1", icon: Video, color: "bg-live text-white", title: "Sarah & Thomas est en Live", detail: "2 546 personnes regardent en ce moment.", time: "à l'instant", event: "sarah-thomas", unread: true },
  { id: "n2", icon: Heart, color: "bg-primary text-white", title: "Marie a aimé votre message", detail: "« Ma fille chérie, je suis tellement fière… »", time: "5 min", unread: true },
  { id: "n3", icon: MessageCircle, color: "bg-gold text-white", title: "Nouveau message vocal", detail: "Julien a laissé un vocal dans le livre d'or.", time: "12 min", event: "sarah-thomas", unread: true },
  { id: "n4", icon: Gift, color: "bg-gradient-primary text-white", title: "La cagnotte a atteint 85%", detail: "Lune de miel de Sarah & Thomas · 8 500 € / 10 000 €", time: "1 h", event: "sarah-thomas" },
  { id: "n5", icon: Camera, color: "bg-surface-alt text-primary", title: "37 nouvelles photos", detail: "L'album collaboratif de Clara vient d'être mis à jour.", time: "3 h", event: "clara-30" },
  { id: "n6", icon: Users, color: "bg-surface-alt text-foreground", title: "3 nouveaux invités", detail: "Ont rejoint le baptême de Gabriel.", time: "hier", event: "bapteme-gabriel" },
  { id: "n7", icon: Bell, color: "bg-surface-alt text-foreground", title: "Rappel", detail: "Baby Shower Emma dans 12 jours.", time: "hier", event: "baby-shower-emma" },
];

function Notifications() {
  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="font-serif text-3xl">Notifications</h1>
        <button className="text-xs font-medium text-primary">Tout marquer lu</button>
      </div>

      <div className="space-y-2">
        {notifs.map((n) => {
          const Icon = n.icon;
          const Wrapper: any = n.event ? Link : "div";
          const wrapperProps = n.event
            ? { to: "/events/$slug", params: { slug: n.event } }
            : {};
          return (
            <Wrapper
              key={n.id}
              {...wrapperProps}
              className={`flex items-start gap-3 rounded-2xl p-3 shadow-card transition-colors ${
                n.unread ? "bg-primary-light/60" : "bg-surface"
              }`}
            >
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${n.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-sm">{n.title}</p>
                  {n.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{n.detail}</p>
                <p className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
