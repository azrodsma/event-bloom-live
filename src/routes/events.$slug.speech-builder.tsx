import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Wand2, Copy, Check, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/speech-builder")({
  component: SpeechBuilder,
  head: () => ({
    meta: [
      { title: "Assistant discours · Memento Live" },
      { name: "description", content: "Un discours qui touche juste, écrit avec vos souvenirs et une pincée d'IA." },
      { property: "og:title", content: "Discours · Memento Live" },
      { property: "og:description", content: "Trouver vos mots, sans page blanche." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const toneOptions = ["Émouvant", "Drôle", "Solennel", "Chaleureux"] as const;
const lengthOptions = ["2 min", "4 min", "6 min"] as const;

const sections = [
  { id: 1, title: "Ouverture chaleureuse", hint: "Salut au public, gratitude pour l'invitation." },
  { id: 2, title: "Anecdote fondatrice", hint: "Un moment précis qui définit votre lien." },
  { id: 3, title: "Portrait tendre", hint: "Ce qui vous touche chez l'autre / le couple." },
  { id: 4, title: "Vœux et hommage", hint: "Ce que vous leur souhaitez, avec sincérité." },
  { id: 5, title: "Toast final", hint: "Levée de verre, phrase mémorable." },
];

const draft = `Sarah, Thomas, chers amis,

Il y a exactement huit ans, à Rome, un été trop chaud pour marcher, Sarah m'a dit : « Il y a un garçon que je veux te présenter, mais tu vas rire de son béret. » J'ai ri, oui. Puis Thomas est arrivé — sans béret — et j'ai compris que c'était sérieux.

Sarah, tu as ce don rare de rendre les gens meilleurs simplement parce que tu les regardes avec attention. Thomas, tu as celui de nous faire ralentir, de rire des choses graves et de prendre au sérieux les choses drôles.

Ensemble, vous êtes devenus l'endroit où on aime revenir. On y trouve toujours un café chaud, une bougie allumée et une conversation qui dure jusqu'à 3h du matin.

Je vous souhaite mille et une années aussi vivantes que celle-ci. Je vous souhaite les orages courts et les silences longs. Je vous souhaite de vous surprendre encore, souvent.

Levons nos verres — à Sarah et Thomas, à leur maison, à cette famille qui s'agrandit ce soir.`;

function SpeechBuilder() {
  const { slug } = useParams({ from: "/events/$slug/speech-builder" });
  const [tone, setTone] = useState<(typeof toneOptions)[number]>("Émouvant");
  const [length, setLength] = useState<(typeof lengthOptions)[number]>("4 min");
  const [step, setStep] = useState(2);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Discours</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Wand2 className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-primary" /> Trouver vos mots
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Un discours<br />qui touche juste</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Racontez-nous 3 souvenirs — Memento tisse une trame que vous ajustez à votre voix.
        </p>
      </section>

      <section className="px-4 pt-6">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Ton</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {toneOptions.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`rounded-full px-2 py-2 text-[11px] font-semibold ${
                tone === t ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">Durée</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {lengthOptions.map((l) => (
            <button
              key={l}
              onClick={() => setLength(l)}
              className={`rounded-full px-2 py-2 text-[11px] font-semibold ${
                length === l ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Structure</h2>
          <span className="text-[11px] text-muted-foreground">{step}/{sections.length}</span>
        </div>
        <ol className="space-y-2">
          {sections.map((s, idx) => {
            const done = idx + 1 < step;
            const active = idx + 1 === step;
            return (
              <li key={s.id}>
                <button
                  onClick={() => setStep(idx + 1)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                    active ? "border-primary bg-primary/5" : done ? "border-border/60 bg-card opacity-70" : "border-border/60 bg-card"
                  }`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                    done ? "bg-primary text-primary-foreground" : active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                  }`}>
                    {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[14px] leading-tight">{s.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{s.hint}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Brouillon généré</h2>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">{tone}</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">{length}</span>
          </div>
        </div>
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-accent/20 via-background to-background p-5">
          <p className="whitespace-pre-line font-serif text-[14px] leading-relaxed">{draft}</p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={copy}
              className="flex-1 rounded-full bg-foreground py-2.5 text-xs font-bold text-background"
            >
              {copied ? "Copié ✓" : "Copier"}
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-secondary" aria-label="Copier">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Coach diction</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Répétez à voix haute</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Enregistrez votre lecture — l'IA vous rend un rapport rythme, souffle et pauses.</p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Lancer une répétition
        </button>
      </section>
    </div>
  );
}
