import type { EventType, MockEvent } from "@/lib/mock-data";

export function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/") || u.pathname.startsWith("/live/")) return url.replace("/live/", "/embed/");
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (host.endsWith("twitch.tv")) {
      const channel = u.pathname.split("/").filter(Boolean)[0];
      if (channel) {
        const parent = typeof window !== "undefined" ? window.location.hostname : "lovable.app";
        return `https://player.twitch.tv/?channel=${channel}&parent=${parent}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

type DbEventType = "wedding" | "baptism" | "birthday" | "anniversary" | "engagement" | "babyshower" | "other";

export const dbTypeToLabel: Record<DbEventType, EventType> = {
  wedding: "Mariage",
  baptism: "Baptême",
  birthday: "Anniversaire",
  anniversary: "Anniversaire",
  engagement: "Fiançailles",
  babyshower: "Baby Shower",
  other: "Autre",
};

export interface DbEvent {
  id: string;
  slug: string;
  title: string;
  type: string;
  visibility: string;
  is_demo: boolean;
  status: string;
  event_date: string | null;
  location: string | null;
  cover_url: string | null;
  description: string | null;
  cagnotte_url: string | null;
  cagnotte_goal: number | null;
  cagnotte_current: number | null;
  live_url: string | null;
  owner_id?: string | null;
}

export function adaptEvent(e: DbEvent): MockEvent {
  const type = dbTypeToLabel[e.type as DbEventType] ?? "Autre";
  const isLive = e.status === "live";
  const eventDate = e.event_date ?? new Date().toISOString();
  const days = Math.max(0, Math.ceil((new Date(eventDate).getTime() - Date.now()) / 86400000));
  const [city = e.location ?? ""] = (e.location ?? "").split(",").reverse();
  const platform: "YouTube" | "Twitch" = (e.live_url ?? "").includes("twitch") ? "Twitch" : "YouTube";
  const embedUrl = e.live_url ? toEmbedUrl(e.live_url) : undefined;
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    type,
    organizers: "",
    city: city.trim(),
    country: "",
    venue: e.location ?? "",
    date: eventDate,
    cover: e.cover_url ?? "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
    isLive,
    viewers: isLive ? 1000 + Math.floor(Math.random() * 3000) : undefined,
    countdownDays: days,
    moneyPot: e.cagnotte_url && e.cagnotte_goal
      ? {
          platform: e.cagnotte_url.includes("lydia") ? "Lydia" : e.cagnotte_url.includes("leetchi") ? "Leetchi" : "Cagnotte",
          url: e.cagnotte_url,
          current: Number(e.cagnotte_current ?? 0),
          target: Number(e.cagnotte_goal),
          currency: "€",
          title: `Cagnotte ${e.title}`,
        }
      : undefined,
    livestream: e.live_url
      ? { platform, url: e.live_url, embedUrl: e.live_url }
      : undefined,
    guestbookCount: 0,
    photosCount: 0,
    visibility: (e.visibility === "public" ? "public" : "private"),
    description: e.description ?? "",
    color: "#E85D8E",
  };
}
