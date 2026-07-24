export interface Vendor {
  id: string;
  name: string;
  category: "Photographe" | "DJ" | "Traiteur" | "Fleuriste" | "Vidéaste" | "Lieu";
  city: string;
  rating: number;
  reviews: number;
  price: string;
  cover: string;
  avatar: string;
  bio: string;
  tags: string[];
  gallery: string[];
  verified?: boolean;
}

export const vendors: Vendor[] = [
  {
    id: "estelle-lumen",
    name: "Estelle Lumen",
    category: "Photographe",
    city: "Paris",
    rating: 4.9,
    reviews: 128,
    price: "à partir de 1 800 €",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/160?img=47",
    bio: "Photographe de mariage depuis 10 ans, spécialisée dans les émotions et la lumière naturelle. Ambiance douce, intemporelle et discrète.",
    tags: ["Reportage", "Lumière naturelle", "Livre premium"],
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&auto=format&fit=crop",
    ],
    verified: true,
  },
  {
    id: "dj-atlas",
    name: "Atlas Sound",
    category: "DJ",
    city: "Lyon",
    rating: 4.8,
    reviews: 92,
    price: "à partir de 1 200 €",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/160?img=12",
    bio: "Un set sur-mesure pour chaque événement. Ambiances éclectiques, du cocktail feutré au dancefloor incandescent.",
    tags: ["Sur-mesure", "Éclairage inclus", "Vinyle"],
    gallery: [
      "https://images.unsplash.com/photo-1571266028243-e4bb3f3e5a80?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
    ],
    verified: true,
  },
  {
    id: "maison-oli",
    name: "Maison Oli",
    category: "Traiteur",
    city: "Bordeaux",
    rating: 4.7,
    reviews: 64,
    price: "à partir de 85 €/pers.",
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/160?img=32",
    bio: "Cuisine française bistronomique, produits locaux et de saison. Menus signature et pièces cocktail spectaculaires.",
    tags: ["Bistronomique", "Local", "Vegan possible"],
    gallery: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "atelier-flora",
    name: "Atelier Flora",
    category: "Fleuriste",
    city: "Marseille",
    rating: 5.0,
    reviews: 47,
    price: "à partir de 600 €",
    cover: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/160?img=25",
    bio: "Compositions florales généreuses et sauvages inspirées de la Méditerranée. Fleurs françaises exclusivement.",
    tags: ["Éco-responsable", "Sur-mesure"],
    gallery: [
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522092372459-dcecbc9a6f5b?w=800&auto=format&fit=crop",
    ],
    verified: true,
  },
  {
    id: "studio-halo",
    name: "Studio Halo",
    category: "Vidéaste",
    city: "Nantes",
    rating: 4.9,
    reviews: 71,
    price: "à partir de 2 200 €",
    cover: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/160?img=58",
    bio: "Films de mariage cinématographiques, format court et long. Livraison sous 6 semaines.",
    tags: ["4K", "Drone", "Live"],
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "domaine-solene",
    name: "Domaine de Solène",
    category: "Lieu",
    city: "Provence",
    rating: 4.8,
    reviews: 39,
    price: "à partir de 6 500 €",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/160?img=41",
    bio: "Bastide du XVIIIe entourée de champs de lavande. Jusqu'à 180 invités, hébergement sur place.",
    tags: ["Extérieur", "Hébergement", "180 pers."],
    gallery: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop",
    ],
    verified: true,
  },
];

export function findVendor(id: string) {
  return vendors.find((v) => v.id === id);
}
