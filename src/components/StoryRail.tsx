import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { stories } from "@/lib/mock-data";

export function StoryRail() {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
      <Link
        to="/app/create"
        className="flex w-16 shrink-0 flex-col items-center gap-1.5"
      >
        <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-primary/60 bg-primary-light text-primary">
          <Plus className="h-6 w-6" />
        </div>
        <span className="truncate text-[10px] font-medium text-muted-foreground">Nouveau</span>
      </Link>
      {stories.map((s) => (
        <Link
          key={s.id}
          to="/stories/$slug"
          params={{ slug: s.event }}
          className="flex w-16 shrink-0 flex-col items-center gap-1.5"
        >
          <div className="relative rounded-full bg-gradient-story p-[2.5px]">
            <div className="rounded-full bg-background p-[2px]">
              <img
                src={s.cover}
                alt={s.title}
                className="h-14 w-14 rounded-full object-cover"
              />
            </div>
            {s.live && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-live px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
                Live
              </span>
            )}
          </div>
          <span className="w-full truncate text-center text-[10px] font-medium text-foreground">
            {s.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
