import {
  Gem,
  Bird,
  Cake,
  Heart,
  Baby,
  Cross,
  Shirt,
  GraduationCap,
  Leaf,
  Martini,
  MoreHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { EventType } from "@/lib/mock-data";

export const eventTypeLucide: Record<string, LucideIcon> = {
  "Mariage": Gem,
  "Baptême": Bird,
  "Anniversaire": Cake,
  "Fiançailles": Heart,
  "Baby Shower": Shirt,
  "Communion": Cross,
  "Naissance": Baby,
  "Remise de diplôme": GraduationCap,
  "Retraite": Leaf,
  "Soirée privée": Martini,
  "Autre": MoreHorizontal,
};

export function eventIcon(type?: string | null): LucideIcon {
  return (type && eventTypeLucide[type]) || Sparkles;
}

export type { EventType };
