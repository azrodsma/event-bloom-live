import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listActiveStories } from "@/lib/events.functions";

export function StoryRail() {
  const fetchStories = useServerFn(listActiveStories);
  const { data } = useQuery({ queryKey: ["stories", "active"], queryFn: () => fetchStories() });
  const stories = (data ?? []) as Array<{
    id: string;
    media_url: string;
    author_name: string | null;
    events: { slug: string; title: string; status: string };
  }>;

  return (
    <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
      <Link to="/app/story/new" className="flex w-16 shrink-0 flex-col items-center gap-1.5">
        <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-primary/60 bg-primary-light text-primary">
          <Plus className="h-6 w-6" />
        </div>
        <span className="truncate text-[10px] font-medium text-muted-foreground">Nouveau</span>
      </Link>
      {stories.map((s) => (
        <Link
          key={s.id}
          to="/events/$slug"
          params={{ slug: s.events.slug }}
          className="flex w-16 shrink-0 flex-col items-center gap-1.5"
        >
          <div className="relative rounded-full bg-gradient-story p-[2.5px]">
            <div className="rounded-full bg-background p-[2px]">
              <img src={s.media_url} alt={s.events.title} className="h-14 w-14 rounded-full object-cover" />
            </div>
            {s.events.status === "live" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-live px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
                Live
              </span>
            )}
          </div>
          <span className="w-full truncate text-center text-[10px] font-medium text-foreground">
            {s.events.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
