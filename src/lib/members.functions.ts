import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RoleZ = z.enum(["owner", "coorganizer", "guest"]);

export const listEventMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { eventId: string }) => z.object({ eventId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: members, error } = await context.supabase
      .from("event_members")
      .select("id, user_id, role, created_at, profiles:user_id ( display_name, avatar_url )")
      .eq("event_id", data.eventId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (members ?? []).map((m: any) => ({
      id: m.id,
      user_id: m.user_id,
      role: m.role as "owner" | "coorganizer" | "guest",
      created_at: m.created_at,
      display_name: m.profiles?.display_name ?? "Membre",
      avatar_url: m.profiles?.avatar_url ?? null,
    }));
  });

export const addEventMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { eventId: string; email: string; role: "coorganizer" | "guest" }) =>
    z.object({
      eventId: z.string().uuid(),
      email: z.string().email(),
      role: z.enum(["coorganizer", "guest"]),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isOrg } = await context.supabase.rpc("is_event_organizer", {
      _event_id: data.eventId,
      _user_id: context.userId,
    });
    if (!isOrg) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: prof, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("display_name", data.email.split("@")[0])
      .maybeSingle();
    if (profErr) throw profErr;
    if (!prof) throw new Error("Aucun utilisateur trouvé avec cet email. Il doit d'abord créer un compte.");

    const { error } = await supabaseAdmin
      .from("event_members")
      .insert({ event_id: data.eventId, user_id: prof.id, role: data.role });
    if (error) throw error;
    return { ok: true };
  });

export const updateMemberRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { memberId: string; eventId: string; role: "coorganizer" | "guest" }) =>
    z.object({
      memberId: z.string().uuid(),
      eventId: z.string().uuid(),
      role: z.enum(["coorganizer", "guest"]),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isOrg } = await context.supabase.rpc("is_event_organizer", {
      _event_id: data.eventId,
      _user_id: context.userId,
    });
    if (!isOrg) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("event_members")
      .update({ role: data.role })
      .eq("id", data.memberId);
    if (error) throw error;
    return { ok: true };
  });

export const removeEventMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { memberId: string; eventId: string }) =>
    z.object({ memberId: z.string().uuid(), eventId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isOrg } = await context.supabase.rpc("is_event_organizer", {
      _event_id: data.eventId,
      _user_id: context.userId,
    });
    if (!isOrg) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("event_members")
      .delete()
      .eq("id", data.memberId);
    if (error) throw error;
    return { ok: true };
  });
