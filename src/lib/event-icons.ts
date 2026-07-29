import {
  Gem,
  Bird,
  Cake,
  Heart,
  Baby,
  Flame,
  Milk,
  GraduationCap,
  Leaf,
  Martini,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { EventType } from "@/lib/mock-data";

export const eventTypeLucide: Record<string, LucideIcon> = {
  "Mariage": Gem,
  "Baptême": Bird,
  "Anniversaire": Cake,
  "Fiançailles": Heart,
  "Baby Shower": Baby,
  "Communion": Flame,
  "Naissance": Milk,
  "Remise de diplôme": GraduationCap,
  "Retraite": Leaf,
  "Soirée privée": Martini,
  "Autre": Sparkles,
};

export function eventIcon(type?: string | null): LucideIcon {
  return (type && eventTypeLucide[type]) || Sparkles;
}

export type { EventType };
