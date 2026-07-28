import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getEventStats = createServerFn({ method: "GET" })
  .inputValidator((data: { eventId: string }) => z.object({ eventId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const eid = data.eventId;
    const q = (table: string, filter: Record<string, unknown> = {}) =>
      supabaseAdmin.from(table).select("*", { count: "exact", head: true }).match({ event_id: eid, ...filter });

    const [gb, al, pl, seat, bud, ck, gv, gs, gc] = await Promise.all([
      q("guestbook_entries"),
      q("album_media"),
      q("playlist_songs"),
      q("tables_seating"),
      q("budget_items"),
      q("checklist_items"),
      q("checklist_items", { is_done: true }),
      q("guests"),
      q("guests", { rsvp: "confirmed" }),
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
