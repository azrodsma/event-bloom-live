import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { welcomeEmail, passwordResetEmail } from "./email-templates";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "Memento Live <mariage@bold-lab-agency.com>";

async function sendViaResend(payload: { to: string; subject: string; html: string }) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) throw new Error("Email service is not configured");

  const res = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({ from: FROM, to: [payload.to], subject: payload.subject, html: payload.html }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[resend] send failed [${res.status}]: ${body}`);
    throw new Error(`Email send failed [${res.status}]`);
  }
  return (await res.json()) as { id?: string };
}

/** Envoie un email de bienvenue brandé après la création d'un compte. */
export const sendWelcomeEmail = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      email: z.string().email(),
      displayName: z.string().max(120).optional(),
      appUrl: z.string().url(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const tpl = welcomeEmail({ displayName: data.displayName, appUrl: data.appUrl });
    try {
      await sendViaResend({ to: data.email, ...tpl });
      return { sent: true };
    } catch (err) {
      // Ne pas bloquer l'inscription si l'email échoue
      console.error("[auth-emails] welcome failed:", err);
      return { sent: false };
    }
  });

/** Génère un lien de reset via Supabase admin et l'envoie via Resend avec un template brandé. */
export const sendPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      email: z.string().email(),
      redirectTo: z.string().url(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: data.email,
      options: { redirectTo: data.redirectTo },
    });

    // On répond toujours en succès (pour éviter l'énumération d'emails)
    if (error || !linkData?.properties?.action_link) {
      console.warn("[auth-emails] generateLink failed:", error?.message);
      return { sent: true };
    }

    const tpl = passwordResetEmail({ resetUrl: linkData.properties.action_link });
    try {
      await sendViaResend({ to: data.email, ...tpl });
    } catch (err) {
      console.error("[auth-emails] reset failed:", err);
    }
    return { sent: true };
  });
