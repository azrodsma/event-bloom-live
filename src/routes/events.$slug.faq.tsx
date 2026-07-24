import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, HelpCircle, Search, ChevronDown, MessageCircle, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/faq")({
  component: EventFaq,
  head: () => ({
    meta: [
      { title: "FAQ de l'événement · Memento Live" },
      { name: "description", content: "Toutes les réponses aux questions pratiques des invités : horaires, accès, cadeaux, tenue, hébergement." },
      { property: "og:title", content: "FAQ de l'événement · Memento Live" },
      { property: "og:description", content: "Les réponses aux questions des invités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful: number;
  hot?: boolean;
}

const faqs: Faq[] = [
  { id: "f1", category: "Horaires", question: "À quelle heure commence la cérémonie ?", answer: "L'accueil des invités commence à 14 h, la cérémonie religieuse débute précisément à 14 h 30. Merci d'être installé·e 15 minutes avant.", helpful: 42, hot: true },
  { id: "f2", category: "Horaires", question: "Jusqu'à quelle heure durera la soirée ?", answer: "La soirée dansante se termine à 3 h du matin. Un service navette est prévu pour les retours à Bordeaux jusqu'à 2 h.", helpful: 31 },
  { id: "f3", category: "Accès", question: "Comment se rendre au Château La Rose ?", answer: "Le château se situe à 4 km de Saint-Émilion. GPS conseillé, parking sur place. Depuis Bordeaux : 40 min en voiture, 25 min en train + taxi.", helpful: 38, hot: true },
  { id: "f4", category: "Accès", question: "Y a-t-il un parking sur place ?", answer: "Oui, un parking gratuit d'une centaine de places est disponible dans le domaine, à 3 min à pied de la salle de réception.", helpful: 24 },
  { id: "f5", category: "Tenue", question: "Y a-t-il un dress code ?", answer: "Notre dress code est \"champêtre chic\" : tons ivoire, dorés, pastels. Évitez le blanc pur (réservé aux mariés) et privilégiez le confort — la cérémonie sera sur l'herbe.", helpful: 55, hot: true },
  { id: "f6", category: "Tenue", question: "Talons ou chaussures plates ?", answer: "Talons plats ou compensés recommandés pour la cérémonie sur pelouse. Les talons fins risquent de s'enfoncer dans l'herbe.", helpful: 29 },
  { id: "f7", category: "Cadeaux", question: "Une liste de cadeaux existe-t-elle ?", answer: "Nous avons opté pour une cagnotte voyage de noces disponible directement dans l'app. Toute participation, même symbolique, nous touchera énormément.", helpful: 47 },
  { id: "f8", category: "Repas", question: "Peut-on préciser un régime alimentaire ?", answer: "Absolument. Indiquez-le en confirmant votre RSVP (végétarien, vegan, sans gluten, allergies). Un menu enfant est prévu pour les moins de 12 ans.", helpful: 22 },
  { id: "f9", category: "Hébergement", question: "Y a-t-il des hôtels recommandés ?", answer: "Nous avons pré-réservé des chambres à l'Hôtel Les Vignes (5 min) et au Domaine La Grave (10 min). Retrouvez les codes de réduction dans l'onglet Plan.", helpful: 34 },
  { id: "f10", category: "Enfants", question: "Les enfants sont-ils les bienvenus ?", answer: "Oui ! Un espace enfants avec animateurs, ateliers créatifs et projection de dessins animés est prévu de 15 h à 22 h.", helpful: 26 },
  { id: "f11", category: "Photos", question: "Peut-on prendre des photos pendant la cérémonie ?", answer: "Pendant la cérémonie religieuse, seul le photographe officiel est autorisé. Ensuite, un photobooth intégré à l'app vous attend toute la soirée !", helpful: 19 },
];

const categories = ["Toutes", ...Array.from(new Set(faqs.map((f) => f.category)))];

function EventFaq() {
  const { slug } = useParams({ from: "/events/$slug/faq" });
  const [cat, setCat] = useState("Toutes");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("f1");

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      if (cat !== "Toutes" && f.category !== cat) return false;
      if (q && !`${f.question} ${f.answer}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [cat, q]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">FAQ</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-secondary/70 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <HelpCircle className="h-3.5 w-3.5 text-primary" /> Questions fréquentes
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">On a pensé à<br />vos questions</h1>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Chercher dans les réponses…"
            className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {q === "" && cat === "Toutes" && (
        <section className="px-4 pt-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider">Questions les plus posées</p>
          </div>
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {faqs.filter((f) => f.hot).map((f) => (
              <button
                key={f.id}
                onClick={() => setOpen(f.id)}
                className="w-64 shrink-0 rounded-2xl border border-primary/30 bg-primary/5 p-3 text-left"
              >
                <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
                  {f.category}
                </span>
                <p className="mt-2 font-serif text-sm leading-tight">{f.question}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 pt-6">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-10 text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Aucune réponse ne correspond</p>
            <p className="mt-1 text-xs text-muted-foreground">Écrivez directement aux mariés ci-dessous.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((f) => {
              const isOpen = open === f.id;
              return (
                <li key={f.id} className={`rounded-2xl border transition-colors ${
                  isOpen ? "border-primary/40 bg-primary/[0.03]" : "border-border/60 bg-card"
                }`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{f.category}</span>
                      <p className="mt-0.5 text-sm font-medium leading-tight">{f.question}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border/40 px-4 py-3">
                      <p className="text-sm leading-relaxed text-foreground/85">{f.answer}</p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{f.helpful} personnes trouvent utile</span>
                        <div className="flex gap-2">
                          <button className="rounded-full border border-border px-3 py-1 font-medium hover:bg-secondary">👍 Utile</button>
                          <button className="rounded-full border border-border px-3 py-1 font-medium hover:bg-secondary">👎</button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/20 p-5 text-center">
        <MessageCircle className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 font-serif text-lg">Vous ne trouvez pas ?</p>
        <p className="mt-1 text-xs text-muted-foreground">Envoyez un message aux mariés, réponse rapide garantie.</p>
        <Link
          to="/app/messages"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
        >
          <MessageCircle className="h-4 w-4" /> Écrire aux mariés
        </Link>
      </section>
    </div>
  );
}
