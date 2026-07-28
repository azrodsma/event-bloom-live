import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function serverPublic() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const eventIdSchema = z.object({ eventId: z.string().uuid() });

// ============ CHECKLIST ============
export const listChecklist = createServerFn({ method: "GET" })
  .inputValidator((i) => eventIdSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("checklist_items")
      .select("id, event_id, title, category, due_date, is_done, assigned_to, position")
      .eq("event_id", data.eventId)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createChecklistItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      title: z.string().min(1).max(200),
      category: z.string().max(80).optional(),
      dueDate: z.string().optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("checklist_items")
      .insert({
        event_id: data.eventId,
        title: data.title,
        category: data.category ?? null,
        due_date: data.dueDate ?? null,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const toggleChecklistItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid(), isDone: z.boolean() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("checklist_items").update({ is_done: data.isDone }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteChecklistItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("checklist_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ BUDGET ============
export const listBudget = createServerFn({ method: "GET" })
  .inputValidator((i) => eventIdSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("budget_items")
      .select("id, event_id, label, category, estimated, actual, paid, vendor, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createBudgetItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      label: z.string().min(1).max(200),
      category: z.string().max(80).optional(),
      estimated: z.number().min(0).default(0),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("budget_items")
      .insert({
        event_id: data.eventId,
        label: data.label,
        category: data.category ?? null,
        estimated: data.estimated,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateBudgetItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      actual: z.number().min(0).optional(),
      paid: z.boolean().optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = {};
    if (data.actual !== undefined) patch.actual = data.actual;
    if (data.paid !== undefined) patch.paid = data.paid;
    const { error } = await context.supabase.from("budget_items").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ PLAYLIST ============
export const listPlaylist = createServerFn({ method: "GET" })
  .inputValidator((i) => eventIdSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("playlist_songs")
      .select("id, event_id, title, artist, suggested_by_name, votes, moment, created_at")
      .eq("event_id", data.eventId)
      .order("votes", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const suggestSong = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      title: z.string().min(1).max(200),
      artist: z.string().max(200).optional(),
      moment: z.string().max(40).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
    const { data: row, error } = await context.supabase
      .from("playlist_songs")
      .insert({
        event_id: data.eventId,
        title: data.title,
        artist: data.artist ?? null,
        suggested_by: context.userId,
        suggested_by_name: profile?.display_name ?? "Invité",
        moment: data.moment ?? null,
        votes: 1,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const voteSong = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid(), delta: z.number().int().min(-1).max(1) }).parse(i))
  .handler(async ({ data, context }) => {
    // simple increment (no per-user vote table in schema)
    const { data: cur } = await context.supabase
      .from("playlist_songs").select("votes").eq("id", data.id).maybeSingle();
    const next = Math.max(0, (cur?.votes ?? 0) + data.delta);
    const { error } = await context.supabase
      .from("playlist_songs").update({ votes: next }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { votes: next };
  });

// ============ TIMELINE ============
export const listTimeline = createServerFn({ method: "GET" })
  .inputValidator((i) => eventIdSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: rows, error } = await sb
      .from("timeline_items")
      .select("id, event_id, time_label, title, description, location, position")
      .eq("event_id", data.eventId)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createTimelineItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      eventId: z.string().uuid(),
      timeLabel: z.string().min(1).max(20),
      title: z.string().min(1).max(200),
      description: z.string().max(500).optional(),
      location: z.string().max(200).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: last } = await context.supabase
      .from("timeline_items")
      .select("position").eq("event_id", data.eventId)
      .order("position", { ascending: false }).limit(1).maybeSingle();
    const position = (last?.position ?? 0) + 1;
    const { data: row, error } = await context.supabase
      .from("timeline_items")
      .insert({
        event_id: data.eventId,
        time_label: data.timeLabel,
        title: data.title,
        description: data.description ?? null,
        location: data.location ?? null,
        position,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteTimelineItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("timeline_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
