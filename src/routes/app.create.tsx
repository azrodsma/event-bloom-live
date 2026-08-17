import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { eventIcon } from "@/lib/event-icons";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  Check,
  Copy,
  Share2,
  X,
  Link2,
  Instagram,
  Facebook,
  MessageCircle,
  Camera,
  Calendar,
  MapPin,
  Globe,
  Lock,
  type LucideIcon,
} from "lucide-react";
import floralFrame from "@/assets/floral-frame.png";
import { createEvent } from "@/lib/events.functions";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/create")({
  head: () => ({
    meta: [
      { title: "Créer un événement — MaFeliza" },
      { name: "description", content: "Créez votre événement en quelques étapes." },
    ],
  }),
  component: CreatePage,
});

const stepTitles = [
  "1. Choisissez le type d'événement",
  "2. Informations de l'événement",
  "3. Choisissez votre faire-part",
  "4. Accès & Partage",
] as const;

/** Ordre et libellés fidèles à la maquette (grille 2 colonnes, 8 tuiles). */
const createTypes = [
  "Mariage",
  "Baptême",
  "Fiançailles",
  "Anniversaire",
  "Communion",
  "Retraite",
  "Baby Shower",
  "Remise diplôme",
  "Autre",
] as const;

const typeTint: Record<string, string> = {
  "Mariage": "bg-primary-light text-primary",
  "Baptême": "bg-iris-light text-iris",
  "Fiançailles": "bg-gold-light text-gold",
  "Anniversaire": "bg-primary-light text-primary",
  "Communion": "bg-iris-light text-iris",
  "Retraite": "bg-gold-light text-gold",
  "Baby Shower": "bg-primary-light text-primary",
  "Remise diplôme": "bg-iris-light text-iris",
  "Autre": "bg-muted text-foreground/70",
};

const typeMap: Record<
  string,
  "wedding" | "baptism" | "birthday" | "anniversary" | "engagement" | "babyshower" | "other"
> = {
  "Mariage": "wedding",
  "Baptême": "baptism",
  "Anniversaire": "birthday",
  "Fiançailles": "engagement",
  "Baby Shower": "babyshower",
};

const cardStyles = ["Classique", "Moderne", "Élégant"] as const;


function randomCode(prefix?: string) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < (prefix ? 4 : 6); i++) out += chars[Math.floor(Math.random() * chars.length)];
  return prefix ? `${prefix}-${out}` : out;
}

function CreatePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const createFn = useServerFn(createEvent);
  const [step, setStep] = useState(0);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState<"public" | "private">("private");
  const [cagnotteUrl, setCagnotteUrl] = useState("");
  const [cagnotteGoal, setCagnotteGoal] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [style, setStyle] = useState<(typeof cardStyles)[number]>("Classique");
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(0);
  const [publishOnPlatform, setPublishOnPlatform] = useState(true);
  const [allowGuestPosts, setAllowGuestPosts] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [enableCagnotte, setEnableCagnotte] = useState(true);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [created, setCreated] = useState<{ slug: string } | null>(null);

  const guestCode = useMemo(() => randomCode(), []);
  const camCode = useMemo(() => randomCode("CAM"), []);

  const mut = useMutation({
    mutationFn: () => {
      const iso = date ? new Date(`${date}T${time || "18:00"}:00`).toISOString() : null;
      return createFn({
        data: {
          title: title.trim(),
          type: typeMap[selectedType ?? ""] ?? "other",
          event_date: iso,
          location: location || null,
          description: description || null,
          cover_url: null,
          visibility: access === "public" ? "public" : publishOnPlatform ? "unlisted" : "private",
          cagnotte_url: enableCagnotte ? cagnotteUrl || null : null,
          cagnotte_goal: enableCagnotte && cagnotteGoal ? Number(cagnotteGoal) : null,
          live_url: liveUrl || null,
        },
      });
    },
    onSuccess: (ev) => setCreated({ slug: ev.slug }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (!loading && !user) {
    return (
      <div className="p-6 text-center">
        <p className="font-serif text-xl">Connectez-vous pour créer un événement</p>
        <Link
          to="/auth"
          className="mt-4 inline-block rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  const canNext = step === 0 ? !!selectedType : step === 1 ? title.trim().length >= 2 : true;
  const copy = (v: string) => {
    void navigator.clipboard?.writeText(v);
    toast.success("Copié !");
  };
  const share = async (v: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || "Mon événement", text: v });
        return;
      } catch {
        /* annulé */
      }
    }
    copy(v);
  };

  return (
    <div className="pb-32">
      {/* En-tête : chevron + titre centré */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-border/60 bg-background/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.65rem)] backdrop-blur-2xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : navigate({ to: "/app" }))}
            aria-label="Retour"
            className="tap grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="truncate text-center text-[17px] font-bold">
            {step === 0 ? "Créer un événement" : "Création de l'événement"}
          </p>
          <span className="h-9 w-9 shrink-0" />
        </div>
        {/* Stepper à points */}
        <div className="mt-3 flex items-center justify-center gap-0">
          {stepTitles.map((label, i) => (
            <div key={label} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                aria-label={label}
                aria-current={i === step}
                className={`block rounded-full transition ${
                  i <= step ? "h-2.5 w-2.5 bg-primary" : "h-2 w-2 bg-primary/25"
                }`}
              />
              {i < stepTitles.length - 1 && (
                <span className={`h-[2px] w-8 ${i < step ? "bg-primary" : "bg-primary/20"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-3.5 max-w-[16rem] font-sans text-[19px] font-bold leading-snug tracking-tight sm:max-w-none">
          {stepTitles[step]}
        </h1>

        {/* ÉTAPE 1 — type (grille 2 colonnes, fidèle à la maquette) */}
        {step === 0 && (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {createTypes.map((t) => {
              const active = selectedType === t;
              const I = eventIcon(t === "Remise diplôme" ? "Remise de diplôme" : t);
              return (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedType(t);
                    setStep(1);
                  }}
                  className={`flex aspect-[1/1.02] flex-col items-center justify-center gap-2 rounded-[16px] border px-2 text-center transition ${
                    active
                      ? "border-primary bg-primary-light"
                      : "border-border/70 bg-surface hover:border-primary/40"
                  }`}
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-[14px] ${
                      active ? "bg-gradient-primary text-white" : typeTint[t]
                    }`}
                  >
                    <I className="h-[22px] w-[22px]" />
                  </span>
                  <span className="line-clamp-2 text-[11.5px] font-semibold leading-tight">{t}</span>
                </button>
              );
            })}
          </div>
        )}


        {/* ÉTAPE 2 — informations */}
        {step === 1 && (
          <div className="space-y-3.5">
            <Field label="Nom de l'événement" value={title} onChange={setTitle} placeholder="Mariage de Sarah & Thomas" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" type="date" value={date} onChange={setDate} icon={Calendar} />
              <Field label="Heure" type="time" value={time} onChange={setTime} />
            </div>
            <div>
              <label className="text-[12.5px] text-muted-foreground">Lieu</label>
              <textarea
                rows={2}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-[16px] border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="Château de Vaux-le-Vicomte&#10;77950 Maincy, France"
              />
            </div>

            <div>
              <label className="text-[12.5px] text-muted-foreground">Type d'accès</label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                {([
                  { v: "public" as const, label: "Public", Icon: Globe },
                  { v: "private" as const, label: "Privé", Icon: Lock },
                ]).map(({ v, label, Icon }) => {
                  const on = access === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setAccess(v)}
                      aria-pressed={on}
                      className={`tap flex items-center justify-center gap-2 rounded-[16px] border py-3.5 text-[13.5px] font-semibold transition ${
                        on ? "border-primary bg-primary-light text-primary" : "border-border bg-surface text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-[12.5px] text-muted-foreground">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-[16px] border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="Rejoignez-nous pour célébrer notre amour ! 💍❤️"
              />
            </div>
            <details className="rounded-[16px] border border-border bg-surface px-4 py-3">
              <summary className="cursor-pointer text-[13px] font-semibold">Live & cagnotte (optionnel)</summary>
              <div className="mt-3 space-y-3">
                <Field
                  label="URL du live (YouTube / Twitch)"
                  value={liveUrl}
                  onChange={setLiveUrl}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <Field
                  label="Lien de la cagnotte"
                  value={cagnotteUrl}
                  onChange={setCagnotteUrl}
                  placeholder="https://leetchi.com/..."
                />
                <Field label="Objectif (€)" type="number" value={cagnotteGoal} onChange={setCagnotteGoal} placeholder="7000" />
              </div>
            </details>
          </div>

        )}

        {/* ÉTAPE 3 — faire-part */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex gap-2">
              {cardStyles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`tap rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                    style === s ? "bg-gradient-primary text-white shadow-glow" : "bg-surface text-muted-foreground border border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Deux modèles côte à côte, comme sur la maquette */}
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((offset) => {
                const idx = (cardIndex + offset) % 6;
                const active = selectedCard === idx;
                return (
                  <button
                    key={offset}
                    onClick={() => setSelectedCard(idx)}
                    aria-pressed={active}
                    className={`overflow-hidden rounded-[18px] border-2 p-1 text-left transition ${
                      active ? "border-primary shadow-glow" : "border-transparent"
                    }`}
                  >
                    <InvitationPreview
                      title={title || "Sarah & Thomas"}
                      date={date}
                      style={style}
                      index={idx}
                      compact
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setCardIndex(i)}
                  aria-label={`Modèle ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === cardIndex ? "w-4 bg-primary" : "w-1.5 bg-primary/25"}`}
                />
              ))}
            </div>

            <button className="tap w-full rounded-[16px] border border-primary/40 bg-surface py-3.5 text-[13.5px] font-semibold text-primary">
              Personnaliser
            </button>

            <section>
              <p className="text-[14px] font-bold">
                Faire-part live <span className="font-normal text-muted-foreground">(pour diffusion)</span>
              </p>
              <div className="mt-2.5 rounded-[24px] border border-primary/30 bg-primary-light/40 p-2.5">
                <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-cream via-background to-primary-light/60 px-5 py-6 text-[13px] leading-relaxed text-foreground/80">
                  <p>
                    Nous avons la joie de vous annoncer notre {selectedType?.toLowerCase() ?? "événement"} qui se
                    déroulera en petit comité le {formatDate(date) || "24 Mai 2025"}.
                  </p>
                  <p className="mt-3">
                    Parce que vous comptez pour nous et que nous souhaitons partager ce moment malgré la distance, nous
                    vous invitons à suivre notre cérémonie en direct !
                  </p>
                </div>
                <button className="tap mt-2.5 w-full rounded-[16px] border border-primary/40 bg-surface/80 py-3 text-[13.5px] font-semibold text-primary">
                  Personnaliser
                </button>
              </div>
            </section>
          </div>

        )}

        {/* ÉTAPE 4 — accès & partage */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-3">
              <CodeCard label="Code invités" value={guestCode} onCopy={copy} onShare={share} />
              <CodeCard label="Code cameraman" value={camCode} onCopy={copy} onShare={share} />
            </div>

            <div>
              <p className="mb-2.5 text-[14px] font-bold">Partager votre événement</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: MessageCircle, label: "WhatsApp", tint: "bg-emerald-50 text-emerald-600" },
                  { icon: Instagram, label: "Instagram", tint: "bg-primary-light text-primary" },
                  { icon: Facebook, label: "Facebook", tint: "bg-iris-light text-iris" },
                  { icon: Link2, label: "Copier le lien", tint: "bg-muted text-foreground/70" },
                ].map(({ icon: Icon, label, tint }) => (
                  <button
                    key={label}
                    onClick={() => share(`Rejoignez ${title || "mon événement"} — code ${guestCode}`)}
                    className="tap flex flex-col items-center gap-1.5"
                  >
                    <span className={`grid h-12 w-12 place-items-center rounded-full ${tint}`}>
                      <Icon className="h-[22px] w-[22px]" />
                    </span>
                    <span className="text-[10.5px] font-medium text-muted-foreground">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Toggle
              label="Publier sur MaFeliza"
              hint="Votre événement sera visible sur la plateforme."
              value={publishOnPlatform}
              onChange={setPublishOnPlatform}
            />

            <div className="divide-y divide-border/70 overflow-hidden rounded-[18px] border border-border bg-surface">
              <Toggle
                label="Événement privé"
                hint="Seuls les invités avec le code peuvent y accéder."
                value={access === "private"}
                onChange={(v) => setAccess(v ? "private" : "public")}
                flush
              />
              <Toggle label="Autoriser les invités à publier" value={allowGuestPosts} onChange={setAllowGuestPosts} flush />
              <Toggle label="Commentaires invités" value={allowComments} onChange={setAllowComments} flush />
              <Toggle label="Participation à la cagnotte" value={enableCagnotte} onChange={setEnableCagnotte} flush />
            </div>
          </div>
        )}
      </div>

      {/* Barre d'action fixe */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-2xl safe-x">
        <div className="mx-auto max-w-2xl">
          {step < stepTitles.length - 1 ? (
            <button
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
              className="tap w-full rounded-[16px] bg-gradient-primary py-4 text-[15px] font-bold text-white shadow-glow disabled:opacity-50"
            >
              Suivant
            </button>
          ) : (
            <button
              disabled={mut.isPending}
              onClick={() => mut.mutate()}
              className="tap w-full rounded-[16px] bg-gradient-primary py-4 text-[15px] font-bold text-white shadow-glow disabled:opacity-50"
            >
              {mut.isPending ? "Publication..." : "Publier l'événement"}
            </button>
          )}
        </div>
      </div>

      {/* Modale de succès */}
      {created && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-foreground/55 px-6 backdrop-blur-sm">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] bg-surface p-6 text-center shadow-2xl">
            <button
              onClick={() => navigate({ to: "/app" })}
              aria-label="Fermer"
              className="tap absolute right-4 top-4 text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <Confetti />
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-light ring-8 ring-gold-light/40">
              <Check className="h-10 w-10 text-emerald-500" strokeWidth={3} />
            </div>
            <p className="mt-4 font-serif text-2xl">Événement créé !</p>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              Vos faire-parts ont été générés avec succès.
            </p>
            <Link
              to="/events/$slug/faire-part"
              params={{ slug: created.slug }}
              className="tap mt-5 block w-full rounded-[16px] bg-gradient-primary py-3.5 text-[14px] font-bold text-white shadow-glow"
            >
              Voir le faire-part
            </Link>
            <button
              onClick={() => share(`${window.location.origin}/events/${created.slug}`)}
              className="tap mt-2.5 w-full rounded-[16px] border border-border bg-background py-3.5 text-[14px] font-semibold"
            >
              Partager
            </button>
            <button
              onClick={() => navigate({ to: "/app" })}
              className="tap mt-3 w-full text-[13.5px] font-semibold underline"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

function InvitationPreview({
  title,
  date,
  style,
  index,
  compact = false,
}: {
  title: string;
  date: string;
  style: string;
  index: number;
  compact?: boolean;
}) {
  const units = [
    { v: "12", l: "JOURS" },
    { v: "07", l: "HEURES" },
    { v: "45", l: "MIN" },
    { v: "30", l: "SEC" },
  ];
  const bg =
    style === "Moderne"
      ? "from-background via-primary-light/40 to-cream"
      : style === "Élégant"
        ? "from-cream via-gold-light/50 to-background"
        : "from-white via-cream/60 to-primary-light/30";
  const short = date
    ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".")
    : "12.08.2024";
  return (
    <div
      className={`relative overflow-hidden rounded-[14px] bg-gradient-to-br ${bg} text-center ${
        compact ? "aspect-[3/4.35] px-3 py-6" : "px-6 py-9"
      }`}
    >
      <img
        src={floralFrame}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-multiply"
      />
      <div className="relative">
        <p className={`font-script leading-[1.05] text-foreground ${compact ? "text-[22px]" : "text-[40px]"}`}>
          {title}
        </p>
        <p
          className={`mt-1 italic text-foreground/55 ${compact ? "text-[8.5px]" : "text-[13px]"}`}
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          se marient
        </p>
        <div className={`mx-auto my-2 h-px bg-foreground/15 ${compact ? "w-10" : "w-24"}`} />
        <p
          className={`tracking-[0.18em] text-foreground/70 ${compact ? "text-[8px]" : "text-[12px]"}`}
        >
          {short}
        </p>
        {!compact && (
          <div className="mt-5 flex items-end justify-center gap-4">
            {units.map((u) => (
              <div key={u.l}>
                <p className="text-xl font-bold leading-none">{u.v}</p>
                <p className="mt-1 text-[8.5px] tracking-[0.14em] text-muted-foreground">{u.l}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <span className="absolute right-2.5 top-2 text-[9px] font-semibold text-foreground/40">{index + 1}/6</span>
    </div>
  );
}

function Confetti() {
  const dots = [
    "left-6 top-6 bg-primary",
    "left-14 top-12 bg-gold",
    "right-8 top-8 bg-iris",
    "right-16 top-16 bg-primary/70",
    "left-10 top-24 bg-gold/80",
    "right-10 top-24 bg-iris/70",
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {dots.map((c, i) => (
        <span key={i} className={`absolute h-1.5 w-1.5 rotate-45 rounded-[2px] ${c}`} />
      ))}
    </div>
  );
}

function CodeCard({
  label,
  value,
  onCopy,
  onShare,
}: {
  label: string;
  value: string;
  onCopy: (v: string) => void;
  onShare: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[12.5px] text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between gap-3 rounded-[16px] border border-border bg-surface px-4 py-3.5">
        <p className="truncate text-[20px] font-extrabold tracking-wide">{value}</p>
        <div className="flex shrink-0 items-center gap-4 text-muted-foreground">
          <button onClick={() => onCopy(value)} aria-label={`Copier ${label}`} className="tap">
            <Copy className="h-[19px] w-[19px]" />
          </button>
          <button onClick={() => onShare(value)} aria-label={`Partager ${label}`} className="tap">
            <Share2 className="h-[19px] w-[19px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CodeRow({
  label,
  value,
  onCopy,
  onShare,
}: {
  label: string;
  value: string;
  onCopy: (v: string) => void;
  onShare: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-surface px-4 py-3.5">
      <p className="text-[13.5px] font-semibold">{label}</p>
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="text-[13.5px] font-bold tracking-wide text-muted-foreground">{value}</span>
        <button onClick={() => onCopy(value)} aria-label={`Copier ${label}`} className="tap text-muted-foreground">
          <Copy className="h-[17px] w-[17px]" />
        </button>
        <button onClick={() => onShare(value)} aria-label={`Partager ${label}`} className="tap text-muted-foreground">
          <Share2 className="h-[17px] w-[17px]" />
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
  flush = false,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  flush?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
        flush ? "bg-surface" : "rounded-[16px] border border-border bg-surface"
      }`}
    >
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold">{label}</p>
        {hint && <p className="text-[12px] text-muted-foreground">{hint}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${value ? "bg-gradient-primary" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon: Icon,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: LucideIcon;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <label className="text-[12.5px] text-muted-foreground">{label}</label>
      <div className="relative mt-1">
        <input
          {...rest}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-[16px] border border-border bg-surface px-4 py-3.5 text-sm outline-none focus:border-primary ${Icon ? "pr-11" : ""}`}
        />
        {Icon && (
          <Icon className="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
