import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listMyConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const { data: memberships } = await sb
      .from("conversation_members")
      .select("conversation_id, last_read_at")
      .eq("user_id", context.userId);
    const ids = (memberships ?? []).map((m) => m.conversation_id);
    if (ids.length === 0) return { threads: [] as any[] };

    const { data: convs } = await sb
      .from("conversations")
      .select("id, title, is_group, event_id, last_message_at, created_by")
      .in("id", ids)
      .order("last_message_at", { ascending: false });

    const { data: members } = await sb
      .from("conversation_members")
      .select("conversation_id, user_id")
      .in("conversation_id", ids);

    const userIds = Array.from(new Set((members ?? []).map((m) => m.user_id)));
    const { data: profiles } = await sb
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));

    const { data: lastMsgs } = await sb
      .from("direct_messages")
      .select("conversation_id, content, created_at, sender_name")
      .in("conversation_id", ids)
      .order("created_at", { ascending: false })
      .limit(200);
    const lastByConv = new Map<string, any>();
    (lastMsgs ?? []).forEach((m) => {
      if (!lastByConv.has(m.conversation_id)) lastByConv.set(m.conversation_id, m);
    });

    const readByConv = new Map((memberships ?? []).map((m) => [m.conversation_id, m.last_read_at]));

    const threads = (convs ?? []).map((c) => {
      const mems = (members ?? []).filter((m) => m.conversation_id === c.id);
      const others = mems.filter((m) => m.user_id !== context.userId).map((m) => pmap.get(m.user_id)).filter(Boolean) as any[];
      const last = lastByConv.get(c.id);
      const lastRead = readByConv.get(c.id);
      const unread = last && lastRead ? new Date(last.created_at) > new Date(lastRead) : false;
      const title = c.title || (c.is_group ? "Groupe" : others[0]?.display_name || "Conversation");
      const avatars = c.is_group ? others.slice(0, 3).map((o) => o.avatar_url).filter(Boolean) : [others[0]?.avatar_url].filter(Boolean);
      return {
        id: c.id,
        title,
        isGroup: c.is_group,
        eventId: c.event_id,
        avatars,
        lastMessage: last ? (c.is_group && last.sender_name ? `${last.sender_name} : ${last.content}` : last.content) : "Nouvelle conversation",
        lastAt: c.last_message_at,
        unread,
      };
    });
    return { threads };
  });

export const getConversation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const { data: conv, error } = await sb
      .from("conversations").select("id, title, is_group, event_id").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!conv) throw new Error("Conversation introuvable");
    const { data: members } = await sb
      .from("conversation_members").select("user_id").eq("conversation_id", data.id);
    const userIds = (members ?? []).map((m) => m.user_id);
    const { data: profiles } = await sb
      .from("profiles").select("id, display_name, avatar_url").in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
    const others = (profiles ?? []).filter((p) => p.id !== context.userId);
    const { data: messages } = await sb
      .from("direct_messages").select("id, sender_id, sender_name, sender_avatar, content, created_at")
      .eq("conversation_id", data.id).order("created_at", { ascending: true }).limit(500);
    await sb.from("conversation_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", data.id).eq("user_id", context.userId);
    return { conv, others, messages: messages ?? [] };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ conversationId: z.string().uuid(), content: z.string().min(1).max(4000) }).parse(i))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const { data: profile } = await sb
      .from("profiles").select("display_name, avatar_url").eq("id", context.userId).maybeSingle();
    const { data: msg, error } = await sb
      .from("direct_messages")
      .insert({
        conversation_id: data.conversationId,
        sender_id: context.userId,
        sender_name: profile?.display_name ?? "Invité",
        sender_avatar: profile?.avatar_url ?? null,
        content: data.content,
      })
      .select().single();
    if (error) throw new Error(error.message);
    await sb.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", data.conversationId);
    return msg;
  });

export const startConversationWith = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ otherUserId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    if (data.otherUserId === context.userId) throw new Error("Impossible de se parler à soi-même");
    const sb = context.supabase;
    const { data: mine } = await sb.from("conversation_members").select("conversation_id").eq("user_id", context.userId);
    const myIds = (mine ?? []).map((m) => m.conversation_id);
    if (myIds.length) {
      const { data: shared } = await sb
        .from("conversation_members")
        .select("conversation_id")
        .in("conversation_id", myIds)
        .eq("user_id", data.otherUserId);
      const candidateIds = (shared ?? []).map((s) => s.conversation_id);
      if (candidateIds.length) {
        const { data: dm } = await sb.from("conversations").select("id").in("id", candidateIds).eq("is_group", false).limit(1).maybeSingle();
        if (dm) return { id: dm.id };
      }
    }
    const { data: conv, error } = await sb
      .from("conversations")
      .insert({ is_group: false, created_by: context.userId })
      .select().single();
    if (error) throw new Error(error.message);
    const { error: mErr } = await sb.from("conversation_members").insert([
      { conversation_id: conv.id, user_id: context.userId },
      { conversation_id: conv.id, user_id: data.otherUserId },
    ]);
    if (mErr) throw new Error(mErr.message);
    return { id: conv.id };
  });

export const searchUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ q: z.string().min(1).max(80) }).parse(i))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const { data: profs } = await sb
      .from("profiles").select("id, display_name, avatar_url")
      .ilike("display_name", `%${data.q}%`).neq("id", context.userId).limit(20);
    return { users: profs ?? [] };
  });
