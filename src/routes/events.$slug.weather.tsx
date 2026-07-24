import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sun, Cloud, CloudRain, CloudSun, Wind, Droplets, Sunrise, Sunset, Thermometer, Umbrella, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/weather")({
  component: Weather,
  head: () => ({
    meta: [
      { title: "Météo du jour J · Memento Live" },
      { name: "description", content: "Prévisions heure par heure et jours précédents pour anticiper la tenue et les décisions extérieures." },
      { property: "og:title", content: "Météo du jour J · Memento Live" },
      { property: "og:description", content: "Toute la météo autour de votre événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Cond = "clear" | "cloud" | "partly" | "rain";

const condMeta: Record<Cond, { label: string; icon: typeof Sun; color: string }> = {
  clear: { label: "Ensoleillé", icon: Sun, color: "text-amber-500" },
  partly: { label: "Éclaircies", icon: CloudSun, color: "text-amber-400" },
  cloud: { label: "Nuageux", icon: Cloud, color: "text-slate-400" },
  rain: { label: "Averses", icon: CloudRain, color: "text-sky-500" },
};

const hourly: Array<{ h: string; temp: number; cond: Cond; rain: number }> = [
  { h: "06 h", temp: 16, cond: "partly", rain: 5 },
  { h: "08 h", temp: 18, cond: "partly", rain: 5 },
  { h: "10 h", temp: 22, cond: "clear", rain: 0 },
  { h: "12 h", temp: 26, cond: "clear", rain: 0 },
  { h: "14 h", temp: 28, cond: "clear", rain: 0 },
  { h: "16 h", temp: 29, cond: "clear", rain: 0 },
  { h: "18 h", temp: 27, cond: "partly", rain: 10 },
  { h: "20 h", temp: 24, cond: "partly", rain: 15 },
  { h: "22 h", temp: 21, cond: "cloud", rain: 20 },
  { h: "00 h", temp: 19, cond: "cloud", rain: 15 },
];

const daily: Array<{ label: string; date: string; min: number; max: number; cond: Cond; rain: number }> = [
  { label: "Mer.", date: "22 juil.", min: 17, max: 25, cond: "cloud", rain: 30 },
  { label: "Jeu.", date: "23 juil.", min: 18, max: 27, cond: "partly", rain: 10 },
  { label: "Ven.", date: "24 juil.", min: 19, max: 28, cond: "clear", rain: 0 },
  { label: "Sam.", date: "25 juil.", min: 20, max: 29, cond: "clear", rain: 5 },
  { label: "Dim.", date: "26 juil.", min: 19, max: 26, cond: "partly", rain: 15 },
];

function Weather() {
  const { slug } = useParams({ from: "/events/$slug/weather" });
  const [tab, setTab] = useState<"hourly" | "daily">("hourly");
  const maxTemp = Math.max(...hourly.map((h) => h.temp));
  const minTemp = Math.min(...hourly.map((h) => h.temp));

  return (
    <div className="min-h-screen pb-16"
      style={{ background: "linear-gradient(180deg, #7BB4E8 0%, #B8D9F0 30%, #FFF8F4 70%)" }}
    >
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/30 bg-white/20 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-white/30 backdrop-blur" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Météo du jour J</p>
        <span className="w-9" />
      </div>

      <section className="px-6 pb-6 pt-8 text-center text-foreground">
        <p className="text-xs uppercase tracking-[0.25em] opacity-70">Samedi 25 juillet 2026</p>
        <p className="mt-1 text-sm opacity-80">Saint-Émilion · Château La Rose</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Sun className="h-24 w-24 text-amber-400 drop-shadow-lg" strokeWidth={1.2} />
          <div className="text-left">
            <p className="font-serif text-7xl leading-none">28°</p>
            <p className="mt-1 text-sm font-medium">Ensoleillé</p>
            <p className="text-xs opacity-70">Ressenti 30° · Min 20°</p>
          </div>
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-semibold backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Journée idéale pour une cérémonie en extérieur
        </div>
      </section>

      <section className="mx-4 rounded-3xl bg-white/70 p-5 shadow-lg backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <Sunrise className="mx-auto h-5 w-5 text-amber-500" />
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Lever</p>
            <p className="font-semibold">06 h 24</p>
          </div>
          <div>
            <Sunset className="mx-auto h-5 w-5 text-amber-600" />
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Coucher</p>
            <p className="font-semibold">21 h 48</p>
          </div>
          <div>
            <Wind className="mx-auto h-5 w-5 text-sky-500" />
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Vent</p>
            <p className="font-semibold">12 km/h</p>
          </div>
          <div>
            <Droplets className="mx-auto h-5 w-5 text-sky-600" />
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Humidité</p>
            <p className="font-semibold">58 %</p>
          </div>
        </div>
      </section>

      <div className="mx-4 mt-6 flex gap-2 rounded-full bg-white/60 p-1 backdrop-blur">
        {(["hourly", "daily"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold transition-colors ${
              tab === t ? "bg-foreground text-background" : "text-foreground/70"
            }`}
          >
            {t === "hourly" ? "Heure par heure" : "5 jours"}
          </button>
        ))}
      </div>

      <section className="mx-4 mt-3 rounded-3xl bg-white/70 p-5 shadow-lg backdrop-blur-xl">
        {tab === "hourly" ? (
          <div className="scrollbar-none -mx-2 flex gap-1 overflow-x-auto px-2 pb-2">
            {hourly.map((h) => {
              const Icon = condMeta[h.cond].icon;
              const heightPct = ((h.temp - (minTemp - 2)) / (maxTemp - (minTemp - 2) + 2)) * 100;
              return (
                <div key={h.h} className="flex w-14 shrink-0 flex-col items-center gap-1.5">
                  <span className="font-mono text-xs font-semibold">{h.temp}°</span>
                  <div className="relative h-16 w-1.5 overflow-hidden rounded-full bg-secondary/60">
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-amber-500 to-amber-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <Icon className={`h-4 w-4 ${condMeta[h.cond].color}`} />
                  {h.rain > 0 && (
                    <span className="flex items-center gap-0.5 text-[9px] text-sky-600">
                      <Droplets className="h-2 w-2" />
                      {h.rain}%
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{h.h}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <ul className="space-y-2">
            {daily.map((d) => {
              const Icon = condMeta[d.cond].icon;
              const isDday = d.label === "Sam.";
              return (
                <li
                  key={d.date}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${
                    isDday ? "bg-primary/10 ring-1 ring-primary/40" : ""
                  }`}
                >
                  <div className="w-14">
                    <p className={`text-sm font-semibold ${isDday ? "text-primary" : ""}`}>{d.label}</p>
                    <p className="text-[10px] text-muted-foreground">{d.date}</p>
                  </div>
                  <Icon className={`h-6 w-6 ${condMeta[d.cond].color}`} />
                  <span className="w-14 text-[10px] text-sky-600">
                    {d.rain > 0 && (
                      <span className="inline-flex items-center gap-0.5">
                        <Droplets className="h-2.5 w-2.5" />
                        {d.rain}%
                      </span>
                    )}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-xs text-muted-foreground">{d.min}°</span>
                    <div className="relative h-1 flex-1 rounded-full bg-secondary/60">
                      <div
                        className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-amber-500"
                        style={{ left: `${(d.min - 15) * 6}%`, width: `${(d.max - d.min) * 6}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold">{d.max}°</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mx-4 mt-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recommandations Memento</p>
        {[
          { icon: Umbrella, title: "Plan B extérieur", desc: "Averses possibles en soirée : prévoyez tonnelle ou repli sous la grange.", color: "bg-sky-500/15 text-sky-700" },
          { icon: Thermometer, title: "Étole ou veste légère", desc: "La température chute à 19° après 22 h — pensez aux plus frileux.", color: "bg-amber-500/15 text-amber-700" },
          { icon: Wind, title: "Coiffures tenues", desc: "Vent modéré à 12 km/h : brushings et laques renforcées conseillés.", color: "bg-emerald-500/15 text-emerald-700" },
        ].map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="flex items-start gap-3 rounded-2xl bg-white/80 p-3.5 shadow-sm backdrop-blur">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${r.color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      <p className="mt-6 px-4 text-center text-[10px] text-muted-foreground">
        Prévisions actualisées automatiquement · Source Open-Meteo
      </p>
    </div>
  );
}
