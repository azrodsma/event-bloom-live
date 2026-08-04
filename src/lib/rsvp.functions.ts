import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

const rsvpSchema = z.object({
  slug: z.string().min(1).max(120),
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().nullable(),
  rsvp: z.enum(["confirmed", "declined", "maybe", "pending"]),
  plus_ones: z.number().int().min(0).max(10),
  dietary: z.string().trim().max(300).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((input) => rsvpSchema.parse(input))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: ev, error: evErr } = await sb
      .from("events")
      .select("id, visibility")
      .eq("slug", data.slug)
      .maybeSingle();
    if (evErr) throw new Error(evErr.message);
    if (!ev) throw new Error("Événement introuvable");
    if (!["public", "unlisted"].includes(ev.visibility)) {
      throw new Error("Cet événement n'accepte pas les RSVP publics");
    }
    const { data: evFull } = await sb
      .from("events")
      .select("title, event_date, location, slug")
      .eq("id", ev.id)
      .maybeSingle();
    const { error } = await sb.from("guests").insert({
      event_id: ev.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone ?? null,
      rsvp: data.rsvp,
      plus_ones: data.plus_ones,
      dietary: data.dietary ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);

    // Fire-and-forget confirmation email via Resend
    try {
      const lovableKey = process.env.LOVABLE_API_KEY;
      const resendKey = process.env.RESEND_API_KEY;
      if (lovableKey && resendKey && evFull) {
        const statusLabel =
          data.rsvp === "confirmed" ? "confirmée ✨"
          : data.rsvp === "declined" ? "déclinée"
          : data.rsvp === "maybe" ? "en attente (peut-être)"
          : "en attente";
        const when = evFull.event_date
          ? new Date(evFull.event_date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
          : "Date à venir";
        const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#FFF8F4;color:#1a1a1a">
          <h1 style="font-family:'Playfair Display',serif;color:#E85D8E;margin:0 0 8px">Merci ${data.full_name} !</h1>
          <p style="margin:0 0 16px">Votre réponse pour <strong>${evFull.title}</strong> est <strong>${statusLabel}</strong>.</p>
          <div style="background:#fff;border-radius:12px;padding:16px;margin:16px 0">
            <p style="margin:4px 0"><strong>📅</strong> ${when}</p>
            ${evFull.location ? `<p style="margin:4px 0"><strong>📍</strong> ${evFull.location}</p>` : ""}
            <p style="margin:4px 0"><strong>👥</strong> ${data.plus_ones} accompagnant(s)</p>
          </div>
          <p style="color:#8a6b52;font-size:13px">MaFeliza — Le réseau social privé de vos plus beaux événements.</p>
        </div>`;
        await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": resendKey,
          },
          body: JSON.stringify({
            from: "MaFeliza <mariage@bold-lab-agency.com>",
            to: [data.email],
            subject: `Votre réponse pour ${evFull.title}`,
            html,
          }),
        }).catch((e) => console.error("[rsvp email]", e));
      }
    } catch (e) {
      console.error("[rsvp email] non-fatal", e);
    }
    return { ok: true };
  });

export const getRsvpStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ eventId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("guests")
      .select("rsvp, plus_ones, checked_in_at")
      .eq("event_id", data.eventId);
    if (error) throw new Error(error.message);
    const stats = { total: 0, confirmed: 0, declined: 0, maybe: 0, pending: 0, plus_ones: 0, checked_in: 0 };
    for (const r of rows ?? []) {
      stats.total += 1;
      stats.plus_ones += r.plus_ones ?? 0;
      if (r.checked_in_at) stats.checked_in += 1;
      const k = r.rsvp as keyof typeof stats;
      if (typeof stats[k] === "number") (stats[k] as number) += 1;
    }
    return stats;
  });

export const listGuests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ eventId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("guests")
      .select("id, full_name, email, phone, rsvp, plus_ones, dietary, table_number, notes, invite_token, checked_in_at, created_at")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

/* ---------- Per-guest invite tokens ---------- */

export const createGuestInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      eventId: z.string().uuid(),
      full_name: z.string().trim().min(1).max(120),
      email: z.string().trim().email().max(255).optional().nullable(),
      phone: z.string().trim().max(40).optional().nullable(),
      plus_ones: z.number().int().min(0).max(10).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("guests")
      .insert({
        event_id: data.eventId,
        full_name: data.full_name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        plus_ones: data.plus_ones ?? 0,
        rsvp: "pending",
      })
      .select("id, invite_token, full_name")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const getGuestByToken = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ token: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: g, error } = await supabaseAdmin
      .from("guests")
      .select("id, event_id, full_name, email, phone, rsvp, plus_ones, dietary, notes, checked_in_at, events!inner(id, slug, title, event_date, location, cover_url, visibility)")
      .eq("invite_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!g) throw new Error("Invitation introuvable");
    return g;
  });

export const updateRsvpByToken = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      token: z.string().uuid(),
      full_name: z.string().trim().min(1).max(120),
      email: z.string().trim().email().max(255),
      phone: z.string().trim().max(40).optional().nullable(),
      rsvp: z.enum(["confirmed", "declined", "maybe", "pending"]),
      plus_ones: z.number().int().min(0).max(10),
      dietary: z.string().trim().max(300).optional().nullable(),
      notes: z.string().trim().max(500).optional().nullable(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("guests")
      .update({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone ?? null,
        rsvp: data.rsvp,
        plus_ones: data.plus_ones,
        dietary: data.dietary ?? null,
        notes: data.notes ?? null,
      })
      .eq("invite_token", data.token);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkInGuest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      guestId: z.string().uuid(),
      checked_in: z.boolean().default(true),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("guests")
      .update({ checked_in_at: data.checked_in ? new Date().toISOString() : null })
      .eq("id", data.guestId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteGuest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ guestId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("guests").delete().eq("id", data.guestId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendRsvpReminders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ eventId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: ev, error: evErr } = await context.supabase
      .from("events")
      .select("id, title, slug, event_date, location")
      .eq("id", data.eventId)
      .maybeSingle();
    if (evErr) throw new Error(evErr.message);
    if (!ev) throw new Error("Événement introuvable");

    const { data: rows, error } = await context.supabase
      .from("guests")
      .select("id, full_name, email, invite_token")
      .eq("event_id", data.eventId)
      .eq("rsvp", "pending");
    if (error) throw new Error(error.message);

    const targets = (rows ?? []).filter((r) => r.email);
    const lovableKey = process.env.LOVABLE_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!lovableKey || !resendKey) {
      return { sent: 0, skipped: targets.length, reason: "email_not_configured" };
    }
    const origin = process.env.PUBLIC_SITE_URL || "https://event-bloom-live.lovable.app";
    const when = ev.event_date
      ? new Date(ev.event_date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
      : "Date à venir";

    let sent = 0;
    for (const g of targets) {
      const link = g.invite_token
        ? `${origin}/i/${g.invite_token}`
        : `${origin}/rsvp/${ev.slug}`;
      const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#FFF8F4;color:#1a1a1a">
        <h1 style="font-family:'Playfair Display',serif;color:#E85D8E;margin:0 0 8px">Un petit rappel, ${g.full_name} 💌</h1>
        <p style="margin:0 0 12px">Nous serions ravis de recevoir votre réponse pour <strong>${ev.title}</strong>.</p>
        <div style="background:#fff;border-radius:12px;padding:16px;margin:16px 0">
          <p style="margin:4px 0"><strong>📅</strong> ${when}</p>
          ${ev.location ? `<p style="margin:4px 0"><strong>📍</strong> ${ev.location}</p>` : ""}
        </div>
        <p style="text-align:center;margin:24px 0">
          <a href="${link}" style="background:#E85D8E;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Répondre à l'invitation</a>
        </p>
        <p style="color:#8a6b52;font-size:13px">MaFeliza — Le réseau social privé de vos plus beaux événements.</p>
      </div>`;
      try {
        const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": resendKey,
          },
          body: JSON.stringify({
            from: "MaFeliza <mariage@bold-lab-agency.com>",
            to: [g.email],
            subject: `Rappel : votre réponse pour ${ev.title}`,
            html,
          }),
        });
        if (res.ok) sent += 1;
      } catch (e) {
        console.error("[rsvp reminder]", e);
      }
    }
    return { sent, skipped: targets.length - sent };
  });
