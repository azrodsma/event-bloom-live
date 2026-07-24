import { createFileRoute, Link } from "@tanstack/react-router";
import { X, Camera, Type, Music, MapPin, Smile, Palette, Sparkles, Send, Timer, Sticker } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/story-composer")({
  component: StoryComposer,
  head: () => ({
    meta: [
      { title: "Nouvelle story · Memento Live" },
      { name: "description", content: "Créez une story éphémère pour vos proches : photo, filtre, musique et stickers en quelques secondes." },
      { property: "og:title", content: "Nouvelle story · Memento Live" },
      { property: "og:description", content: "Partagez un moment en 24 h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const filters = [
  { id: "none", label: "Original", style: "" },
  { id: "rose", label: "Poudré", style: "sepia(0.2) saturate(1.15) hue-rotate(-8deg) brightness(1.05)" },
  { id: "vintage", label: "Vintage", style: "sepia(0.6) contrast(1.05) saturate(0.85)" },
  { id: "nb", label: "Argentique", style: "grayscale(1) contrast(1.1)" },
  { id: "gold", label: "Doré", style: "sepia(0.35) saturate(1.3) hue-rotate(-10deg)" },
  { id: "cool", label: "Éclat", style: "saturate(1.25) contrast(1.05) brightness(1.05)" },
];

const stickerSet = ["💍", "🥂", "❤️", "✨", "🎉", "🌸", "🕊️", "🎂", "🎁", "💃", "🎤", "📸"];
const musicTracks = [
  { title: "Perfect", artist: "Ed Sheeran", duration: "0:15" },
  { title: "La Vie en Rose", artist: "Édith Piaf", duration: "0:15" },
  { title: "A Thousand Years", artist: "Christina Perri", duration: "0:15" },
  { title: "L'Amour", artist: "Angèle", duration: "0:15" },
];

type Tab = "filter" | "text" | "sticker" | "music" | "location";

function StoryComposer() {
  const [tab, setTab] = useState<Tab>("filter");
  const [filter, setFilter] = useState("rose");
  const [text, setText] = useState("Que la fête commence ✨");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [selectedStickers, setSelectedStickers] = useState<string[]>(["🥂", "❤️"]);
  const [music, setMusic] = useState<string | null>("Perfect");
  const [location, setLocation] = useState<string | null>("Château de Villette");
  const [duration, setDuration] = useState(5);

  const activeFilter = filters.find((f) => f.id === filter);

  function toggleSticker(s: string) {
    setSelectedStickers((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-black text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur" aria-label="Fermer">
          <X className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Nouvelle story</p>
        <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
          <Timer className="h-3.5 w-3.5" />
          <span className="text-[11px] font-semibold">{duration}s</span>
        </div>
      </div>

      <div className="relative mx-auto my-2 aspect-[9/16] w-full max-w-sm flex-1 overflow-hidden rounded-3xl bg-slate-900 ring-1 ring-white/10">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: activeFilter?.style }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute left-3 right-3 top-3 flex items-center gap-2">
          <img src="https://i.pravatar.cc/64?img=48" alt="" className="h-8 w-8 rounded-full ring-2 ring-white/60" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">Isabelle</p>
            <p className="text-[10px] opacity-70">à l'instant</p>
          </div>
        </div>

        {text && (
          <p
            className="absolute left-1/2 top-1/2 max-w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black/25 px-3 py-2 text-center font-serif text-2xl leading-tight backdrop-blur-sm"
            style={{ color: textColor }}
          >
            {text}
          </p>
        )}

        <div className="absolute right-4 top-24 flex flex-col gap-3">
          {selectedStickers.map((s, i) => (
            <span key={i} className="text-4xl drop-shadow-lg">
              {s}
            </span>
          ))}
        </div>

        {location && (
          <span className="absolute bottom-20 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-foreground">
            <MapPin className="h-3 w-3 text-primary" /> {location}
          </span>
        )}
        {music && (
          <span className="absolute bottom-20 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-foreground">
            <Music className="h-3 w-3 text-primary" /> {music}
          </span>
        )}
      </div>

      <div className="px-4">
        {tab === "filter" && (
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl border-2 p-1 ${
                  filter === f.id ? "border-primary" : "border-transparent"
                }`}
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=200&auto=format&fit=crop"
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ filter: f.style }}
                  />
                </div>
                <span className="text-[10px] font-semibold">{f.label}</span>
              </button>
            ))}
          </div>
        )}

        {tab === "text" && (
          <div className="space-y-3 pb-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ajoutez du texte…"
              className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none backdrop-blur focus:bg-white/15"
            />
            <div className="flex gap-2">
              {["#FFFFFF", "#E85D8E", "#D9A441", "#000000"].map((c) => (
                <button
                  key={c}
                  onClick={() => setTextColor(c)}
                  className={`h-8 w-8 rounded-full ring-2 transition-transform ${
                    textColor === c ? "ring-primary scale-110" : "ring-white/30"
                  }`}
                  style={{ background: c }}
                  aria-label={`Couleur ${c}`}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "sticker" && (
          <div className="grid grid-cols-6 gap-2 pb-2">
            {stickerSet.map((s) => {
              const active = selectedStickers.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSticker(s)}
                  className={`grid aspect-square place-items-center rounded-xl text-2xl transition-transform ${
                    active ? "bg-primary/40 scale-110 ring-2 ring-primary" : "bg-white/10"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}

        {tab === "music" && (
          <ul className="space-y-1.5 pb-2">
            {musicTracks.map((t) => {
              const active = music === t.title;
              return (
                <li key={t.title}>
                  <button
                    onClick={() => setMusic(active ? null : t.title)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${
                      active ? "bg-primary/30" : "bg-white/5"
                    }`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-full ${active ? "bg-primary" : "bg-white/10"}`}>
                      <Music className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{t.title}</p>
                      <p className="truncate text-[10px] text-white/60">{t.artist} · {t.duration}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {tab === "location" && (
          <div className="space-y-1.5 pb-2">
            {["Château de Villette", "Paris, France", "Domaine des Roses", "Ma position"].map((loc) => {
              const active = location === loc;
              return (
                <button
                  key={loc}
                  onClick={() => setLocation(active ? null : loc)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${
                    active ? "bg-primary/30" : "bg-white/5"
                  }`}
                >
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-sm">{loc}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mb-3 mt-2">
          <p className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-white/60">
            <span>Durée</span>
            <span className="text-white">{duration}s</span>
          </p>
          <input
            type="range"
            min={3}
            max={15}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-primary"
            aria-label="Durée de la story"
          />
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/60 px-4 py-3 backdrop-blur">
        <div className="mb-3 flex items-center justify-around">
          {(
            [
              { id: "filter", icon: Palette, label: "Filtre" },
              { id: "text", icon: Type, label: "Texte" },
              { id: "sticker", icon: Sticker, label: "Sticker" },
              { id: "music", icon: Music, label: "Musique" },
              { id: "location", icon: MapPin, label: "Lieu" },
            ] as { id: Tab; icon: typeof Camera; label: string }[]
          ).map((b) => {
            const Icon = b.icon;
            const active = tab === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setTab(b.id)}
                className={`flex flex-col items-center gap-0.5 ${active ? "text-primary" : "text-white/70"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-semibold">{b.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10" aria-label="Changer la photo">
            <Camera className="h-5 w-5" />
          </button>
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10" aria-label="Ajouter un emoji">
            <Smile className="h-5 w-5" />
          </button>
          <Link
            to="/app"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-bold text-white shadow-glow"
          >
            <Send className="h-4 w-4" /> Publier ma story
          </Link>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-white/60">
          <Sparkles className="h-3 w-3" /> Visible 24 h par vos proches
        </p>
      </div>
    </div>
  );
}
