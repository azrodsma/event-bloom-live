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

    const [gb, al, pl, seat, bud, ck, gv, gs, gc] = await Promise.all([
      q("guestbook_entries"),
      q("album_media"),
      q("playlist_songs"),
      q("tables_seating"),
      q("budget_items"),
      q("checklist_items"),
      q("checklist_items", { column: "is_done", value: true }),
      q("guests"),
      q("guests", { column: "rsvp", value: "confirmed" }),
    ]);

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
    };
  });
