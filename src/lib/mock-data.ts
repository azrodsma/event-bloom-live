export type EventType =
  | "Mariage"
  | "Baptême"
  | "Anniversaire"
  | "Fiançailles"
  | "Baby Shower"
  | "Communion"
  | "Naissance"
  | "Remise de diplôme"
  | "Retraite"
  | "Soirée privée"
  | "Autre";

export interface MockEvent {
  id: string;
  slug: string;
  title: string;
  type: EventType;
  organizers: string;
  city: string;
  country: string;
  venue: string;
  date: string; // ISO
  cover: string;
  isLive: boolean;
  viewers?: number;
  countdownDays?: number;
  moneyPot?: {
    platform: string;
    url: string;
    current: number;
    target: number;
    currency: string;
    title: string;
  };
  livestream?: {
    platform: "YouTube" | "Twitch";
    url: string;
    embedUrl: string;
  };
  guestbookCount: number;
  photosCount: number;
  visibility: "public" | "private";
  description: string;
  color: string; // gradient hex tint
}

export const eventTypeIcons: Record<EventType, string> = {
  "Mariage": "💍",
  "Baptême": "🕊️",
  "Anniversaire": "🎂",
  "Fiançailles": "💖",
  "Baby Shower": "👶",
  "Communion": "🕯️",
  "Naissance": "🍼",
  "Remise de diplôme": "🎓",
  "Retraite": "🌿",
  "Soirée privée": "🥂",
  "Autre": "✨",
};

export const mockEvents: MockEvent[] = [
  {
    id: "evt-1",
    slug: "sarah-thomas",
    title: "Sarah & Thomas",
    type: "Mariage",
    organizers: "Sarah & Thomas Laurent",
    city: "Bordeaux",
    country: "France",
    venue: "Château La Rose",
    date: new Date().toISOString(),
    cover:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop",
    isLive: true,
    viewers: 2546,
    moneyPot: {
      platform: "Leetchi",
      url: "https://www.leetchi.com/",
      current: 4250,
      target: 7000,
      currency: "€",
      title: "Voyage de noces à Bali",
    },
    livestream: {
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      embedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1",
    },
    guestbookCount: 128,
    photosCount: 548,
    visibility: "private",
    description:
      "Après 8 ans d'histoire, nous nous disons oui entourés de nos familles et amis. Partagez ce moment avec nous, où que vous soyez.",
    color: "#E85D8E",
  },
  {
    id: "evt-2",
    slug: "bapteme-gabriel",
    title: "Baptême de Gabriel",
    type: "Baptême",
    organizers: "Famille Moreau",
    city: "Toulouse",
    country: "France",
    venue: "Église Saint-Sernin",
    date: new Date(Date.now() + 6 * 86400000).toISOString(),
    cover:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop",
    isLive: false,
    countdownDays: 6,
    moneyPot: {
      platform: "Lydia",
      url: "https://lydia-app.com/",
      current: 850,
      target: 1500,
      currency: "€",
      title: "Cadeau collectif pour Gabriel",
    },
    guestbookCount: 34,
    photosCount: 62,
    visibility: "private",
    description: "Nous célébrons le baptême de notre petit Gabriel. Un moment doux à partager en famille.",
    color: "#D9A441",
  },
  {
    id: "evt-3",
    slug: "clara-30",
    title: "Anniversaire de Clara",
    type: "Anniversaire",
    organizers: "Clara Dubois",
    city: "Paris",
    country: "France",
    venue: "Rooftop Belleville",
    date: new Date().toISOString(),
    cover:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&auto=format&fit=crop",
    isLive: true,
    viewers: 856,
    livestream: {
      platform: "Twitch",
      url: "https://www.twitch.tv/twitch",
      embedUrl: "https://player.twitch.tv/?channel=twitch&parent=lovable.app&muted=true",
    },
    guestbookCount: 89,
    photosCount: 214,
    visibility: "public",
    description: "Les 30 ans de Clara — DJ, cocktails et surprises sur les toits de Paris.",
    color: "#FF2D55",
  },
  {
    id: "evt-4",
    slug: "baby-shower-emma",
    title: "Baby Shower Emma",
    type: "Baby Shower",
    organizers: "Emma & Julien",
    city: "Lyon",
    country: "France",
    venue: "Villa Bellecour",
    date: new Date(Date.now() + 12 * 86400000).toISOString(),
    cover:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&auto=format&fit=crop",
    isLive: false,
    countdownDays: 12,
    moneyPot: {
      platform: "OnParticipe",
      url: "https://www.onparticipe.fr/",
      current: 320,
      target: 1000,
      currency: "€",
      title: "Trousseau pour bébé",
    },
    guestbookCount: 21,
    photosCount: 18,
    visibility: "private",
    description: "On se retrouve pour fêter l'arrivée prochaine de bébé. Ambiance douce et pastel.",
    color: "#F7B2C4",
  },
  {
    id: "evt-5",
    slug: "diplome-lucas",
    title: "Remise de diplôme de Lucas",
    type: "Remise de diplôme",
    organizers: "Lucas Bernard",
    city: "Lille",
    country: "France",
    venue: "Grand Auditorium",
    date: new Date(Date.now() + 21 * 86400000).toISOString(),
    cover:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop",
    isLive: false,
    countdownDays: 21,
    guestbookCount: 12,
    photosCount: 4,
    visibility: "public",
    description: "Après 5 ans d'études, Lucas décroche son diplôme d'ingénieur. Rejoignez la fête !",
    color: "#32B77A",
  },
  {
    id: "evt-6",
    slug: "fiancailles-noor-adam",
    title: "Fiançailles Noor & Adam",
    type: "Fiançailles",
    organizers: "Noor & Adam",
    city: "Marseille",
    country: "France",
    venue: "Villa Méditerranée",
    date: new Date(Date.now() + 40 * 86400000).toISOString(),
    cover:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&auto=format&fit=crop",
    isLive: false,
    countdownDays: 40,
    guestbookCount: 7,
    photosCount: 2,
    visibility: "private",
    description: "Nous nous fiançons face à la mer. Un moment intime à partager avec vous.",
    color: "#E85D8E",
  },
];

export const stories = [
  { id: "s1", title: "Sarah & Thomas", cover: mockEvents[0].cover, live: true, event: "sarah-thomas" },
  { id: "s2", title: "Clara 30", cover: mockEvents[2].cover, live: true, event: "clara-30" },
  { id: "s3", title: "Gabriel J-6", cover: mockEvents[1].cover, live: false, event: "bapteme-gabriel" },
  { id: "s4", title: "Emma J-12", cover: mockEvents[3].cover, live: false, event: "baby-shower-emma" },
  { id: "s5", title: "Lucas J-21", cover: mockEvents[4].cover, live: false, event: "diplome-lucas" },
  { id: "s6", title: "Noor & Adam", cover: mockEvents[5].cover, live: false, event: "fiancailles-noor-adam" },
];

export const eventTypes: EventType[] = [
  "Mariage",
  "Baptême",
  "Anniversaire",
  "Fiançailles",
  "Baby Shower",
  "Communion",
  "Naissance",
  "Remise de diplôme",
  "Retraite",
  "Soirée privée",
  "Autre",
];

export interface GuestbookMsg {
  id: string;
  author: string;
  avatar: string;
  role: string;
  time: string;
  text: string;
  media?: { type: "photo" | "video" | "audio"; url: string };
  likes: number;
  isFeatured?: boolean;
}

export const guestbookMessages: GuestbookMsg[] = [
  {
    id: "g1",
    author: "Marie Laurent",
    avatar: "https://i.pravatar.cc/150?img=47",
    role: "Maman de la mariée",
    time: "il y a 5 min",
    text: "Ma fille chérie, je suis tellement fière de toi aujourd'hui. Que ce jour soit le début d'une vie remplie d'amour ❤️",
    likes: 42,
    isFeatured: true,
  },
  {
    id: "g2",
    author: "Alex Bernard",
    avatar: "https://i.pravatar.cc/150?img=12",
    role: "Ami du marié",
    time: "il y a 12 min",
    text: "Depuis Paris avec vous en pensée ! Les meilleurs souvenirs vous attendent 🥂",
    media: {
      type: "photo",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    },
    likes: 18,
  },
  {
    id: "g3",
    author: "Grand-mère Rose",
    avatar: "https://i.pravatar.cc/150?img=32",
    role: "Grand-mère",
    time: "il y a 30 min",
    text: "Je ne peux pas être là physiquement mais mon cœur est avec vous. Toute ma tendresse mes chéris.",
    likes: 67,
    isFeatured: true,
  },
  {
    id: "g4",
    author: "Emma Petit",
    avatar: "https://i.pravatar.cc/150?img=25",
    role: "Témoin",
    time: "il y a 1h",
    text: "Un discours d'anthologie se prépare... préparez les mouchoirs !",
    likes: 9,
  },
  {
    id: "g5",
    author: "Julien Roux",
    avatar: "https://i.pravatar.cc/150?img=15",
    role: "Cousin",
    time: "il y a 2h",
    text: "Message vocal envoyé depuis Montréal 🎙️",
    media: { type: "audio", url: "#" },
    likes: 5,
  },
];

export const liveChatMessages = [
  { id: "c1", user: "Léa", color: "#E85D8E", text: "Trop belle la mariée 😍", time: "20:14" },
  { id: "c2", user: "Papa Thomas", color: "#D9A441", text: "On vous embrasse fort ❤️", time: "20:15" },
  { id: "c3", user: "Marc", color: "#32B77A", text: "Le DJ envoie du lourd !", time: "20:16" },
  { id: "c4", user: "Chloé", color: "#FF2D55", text: "🥂🥂🥂", time: "20:16" },
  { id: "c5", user: "Sofia", color: "#7A6670", text: "Merci pour le live, on est à Tokyo 🇯🇵", time: "20:17" },
  { id: "c6", user: "Yanis", color: "#E85D8E", text: "Vous êtes magnifiques", time: "20:17" },
  { id: "c7", user: "Emma", color: "#D9A441", text: "Applaudissements virtuels 👏👏", time: "20:18" },
];

export const paidInteractions = [
  { id: "p1", label: "Applaudir", emoji: "👏", price: 1 },
  { id: "p2", label: "Cœur animé", emoji: "💖", price: 2 },
  { id: "p3", label: "Message mis en avant", emoji: "✨", price: 3 },
  { id: "p4", label: "Feu d'artifice", emoji: "🎆", price: 5 },
  { id: "p5", label: "Champagne virtuel", emoji: "🍾", price: 10 },
];

export function findEvent(slug: string) {
  return mockEvents.find((e) => e.slug === slug);
}
