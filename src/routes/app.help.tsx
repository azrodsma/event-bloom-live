import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, MessageCircle, Mail, BookOpen, Sparkles, Shield, CreditCard, Video, Users, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/help")({
  component: Help,
  head: () => ({
    meta: [
      { title: "Centre d'aide · Memento Live" },
      { name: "description", content: "Trouvez des réponses à toutes vos questions sur Memento Live : événements, live, cagnotte, livre d'or." },
      { property: "og:title", content: "Centre d'aide · Memento Live" },
      { property: "og:description", content: "Guides, FAQ et support Memento Live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const categories = [
  { icon: Sparkles, label: "Premiers pas", count: 8, tone: "bg-primary/10 text-primary" },
  { icon: Video, label: "Diffusion Live", count: 12, tone: "bg-accent/20 text-foreground" },
  { icon: CreditCard, label: "Cagnotte", count: 6, tone: "bg-secondary text-foreground" },
  { icon: Users, label: "Invités & accès", count: 9, tone: "bg-primary/10 text-primary" },
  { icon: BookOpen, label: "Livre d'or", count: 5, tone: "bg-accent/20 text-foreground" },
  { icon: Shield, label: "Confidentialité", count: 7, tone: "bg-secondary text-foreground" },
];

const faqs = [
  {
    q: "Comment inviter mes proches à l'événement ?",
    a: "Depuis la page de votre événement, cliquez sur « Inviter ». Vous pouvez partager un lien, un QR code ou envoyer un faire-part par email. Un code d'accès à 6 caractères protège les événements privés.",
  },
  {
    q: "Memento Live gère-t-il l'argent de la cagnotte ?",
    a: "Non. La cagnotte est toujours hébergée sur une plateforme externe (Leetchi, Lydia, Le Pot Commun…). Memento affiche uniquement la progression et redirige vos invités vers la plateforme choisie. Aucun frais n'est prélevé par Memento.",
  },
  {
    q: "Sur quelles plateformes puis-je diffuser mon live ?",
    a: "Vous pouvez encapsuler un flux YouTube Live ou Twitch. Collez simplement l'URL de diffusion dans les paramètres de l'événement. Le chat interne Memento reste disponible en parallèle du live.",
  },
  {
    q: "Qui peut voir mon événement ?",
    a: "Vous choisissez : événement privé (accessible uniquement via code d'invitation), semi-privé (accessible aux abonnés Memento invités) ou public (visible dans l'onglet Explorer).",
  },
  {
    q: "Comment fonctionnent les messages vocaux du livre d'or ?",
    a: "Vos invités peuvent enregistrer jusqu'à 3 minutes de vocal directement depuis le livre d'or. Les messages sont conservés à vie sur votre compte et peuvent être ajoutés au livre imprimé souvenir.",
  },
  {
    q: "Puis-je annuler mon abonnement Premium ?",
    a: "Oui, à tout moment depuis Réglages › Abonnement. Vous conservez l'accès aux fonctionnalités Premium jusqu'à la fin de la période en cours.",
  },
];

function Help() {
  const [open, setOpen] = useState<string | null>(faqs[0].q);
  const [query, setQuery] = useState("");
  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="pb-24">
      <div className="sticky top-[57px] z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app/settings" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Centre d'aide</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-secondary/60 to-transparent px-4 pb-8 pt-6">
        <h1 className="font-serif text-3xl leading-tight">Comment pouvons-nous vous aider ?</h1>
        <p className="mt-2 text-sm text-muted-foreground">Retrouvez guides pas à pas, réponses aux questions fréquentes et contact direct avec notre équipe.</p>
        <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une question…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      <section className="px-4">
        <h2 className="font-serif text-xl">Catégories</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.label} className="flex flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left hover:border-primary/40">
                <span className={`grid h-10 w-10 place-items-center rounded-full ${c.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.count} articles</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8 px-4">
        <h2 className="font-serif text-xl">Questions fréquentes</h2>
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border/60 bg-card">
          {filtered.map((f) => {
            const isOpen = open === f.q;
            return (
              <li key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : f.q)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                >
                  <span className="text-sm font-medium">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>}
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun résultat pour « {query} ».</li>
          )}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <h2 className="font-serif text-xl">Un besoin particulier ?</h2>
        <div className="mt-3 grid gap-3">
          <Link to="/app/messages" className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 hover:border-primary/40">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">Chat en direct</p>
              <p className="text-xs text-muted-foreground">Réponse en moins de 5 min · 7j/7</p>
            </div>
          </Link>
          <a href="mailto:support@memento.live" className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 hover:border-primary/40">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/20">
              <Mail className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">support@memento.live</p>
              <p className="text-xs text-muted-foreground">Réponse sous 24 h</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
