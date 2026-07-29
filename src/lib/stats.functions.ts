import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getEventStats = createServerFn({ method: "GET" })
  .inputValidator((data: { eventId: string }) => z.object({ eventId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const eid = data.eventId;
    const q = (table: string, extra?: { column: string; value: unknown }) => {
      let b = (supabaseAdmin as any).from(table).select("*", { count: "exact", head: true }).eq("event_id", eid);
      if (extra) b = b.eq(extra.column, extra.value);
      return b as Promise<{ count: number | null }>;
    };

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const reactionsQ = (supabaseAdmin as any)
      .from("live_reactions")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eid)
      .gte("created_at", since24h);

    const [gb, al, pl, seat, bud, ck, gv, gs, gc, rx, postsList, mediaList, gbList] = await Promise.all([
      q("guestbook_entries"),
      q("album_media"),
      q("playlist_songs"),
      q("tables_seating"),
      q("budget_items"),
      q("checklist_items"),
      q("checklist_items", { column: "is_done", value: true }),
      q("guests"),
      q("guests", { column: "rsvp", value: "confirmed" }),
      reactionsQ as Promise<{ count: number | null }>,
      (supabaseAdmin as any)
        .from("posts")
        .select("author_id, created_at, profiles:author_id(display_name, avatar_url)")
        .eq("event_id", eid)
        .order("created_at", { ascending: false })
        .limit(500),
      (supabaseAdmin as any)
        .from("album_media")
        .select("uploader_id, uploader_name, created_at")
        .eq("event_id", eid)
        .limit(500),
      (supabaseAdmin as any)
        .from("guestbook_entries")
        .select("author_id, author_name, created_at")
        .eq("event_id", eid)
        .limit(500),
    ]);

    // Top contributors — aggregate posts + album uploads + guestbook entries
    const bucket = new Map<string, { name: string; avatar: string | null; count: number }>();
    const add = (key: string | null, name: string | null, avatar: string | null) => {
      const k = key ?? `anon:${name ?? "Invité"}`;
      const cur = bucket.get(k) ?? { name: name ?? "Invité", avatar, count: 0 };
      cur.count += 1;
      if (!cur.avatar && avatar) cur.avatar = avatar;
      bucket.set(k, cur);
    };
    for (const p of (postsList.data ?? []) as any[]) {
      add(p.author_id, p.profiles?.display_name ?? null, p.profiles?.avatar_url ?? null);
    }
    for (const m of (mediaList.data ?? []) as any[]) {
      add(m.uploader_id, m.uploader_name ?? null, null);
    }
    for (const g of (gbList.data ?? []) as any[]) {
      add(g.author_id, g.author_name ?? null, null);
    }
    const topContributors = Array.from(bucket.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Activity chart — posts per day over the last 12 days
    const days: { label: string; value: number }[] = [];
    const dayKey = (d: Date) => d.toISOString().slice(0, 10);
    const counts = new Map<string, number>();
    for (const p of (postsList.data ?? []) as any[]) {
      const k = dayKey(new Date(p.created_at));
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    for (const m of (mediaList.data ?? []) as any[]) {
      const k = dayKey(new Date(m.created_at));
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    for (const g of (gbList.data ?? []) as any[]) {
      const k = dayKey(new Date(g.created_at));
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ label: `J-${i}`, value: counts.get(dayKey(d)) ?? 0 });
    }

    return {
      guestbook: gb.count ?? 0,
      photos: al.count ?? 0,
      songs: pl.count ?? 0,
      tables: seat.count ?? 0,
      budgetItems: bud.count ?? 0,
      checklistTotal: ck.count ?? 0,
      checklistDone: gv.count ?? 0,
      guestsTotal: gs.count ?? 0,
      guestsConfirmed: gc.count ?? 0,
      reactions24h: rx.count ?? 0,
      topContributors,
      activity: days,
    };
  });

