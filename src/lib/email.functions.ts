import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const emailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email()).min(1).max(50)]),
  subject: z.string().min(1).max(200),
  html: z.string().min(1).max(200_000),
  text: z.string().max(200_000).optional(),
  from: z.string().max(200).optional(),
  reply_to: z.string().email().optional(),
});

export type SendEmailInput = z.infer<typeof emailSchema>;

/**
 * Sends an email through the Resend connector gateway.
 * Requires LOVABLE_API_KEY and RESEND_API_KEY (auto-injected by Lovable).
 *
 * Default `from` uses `onboarding@resend.dev` which only delivers to the
 * Resend account owner. To send to arbitrary recipients, verify a domain
 * in Resend and pass `from: "MaFeliza <hello@yourdomain.com>"`.
 */
export const sendEmail = createServerFn({ method: "POST" })
  .inputValidator((input) => emailSchema.parse(input))
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
    if (!resendKey) throw new Error("RESEND_API_KEY is not configured");

    const payload: Record<string, unknown> = {
      from: data.from ?? "MaFeliza <mariage@bold-lab-agency.com>",
      to: Array.isArray(data.to) ? data.to : [data.to],
      subject: data.subject,
      html: data.html,
    };
    if (data.text) payload.text = data.text;
    if (data.reply_to) payload.reply_to = data.reply_to;

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[resend] send failed [${res.status}]: ${body}`);
      throw new Error(`Email send failed [${res.status}]: ${body}`);
    }
    return (await res.json()) as { id?: string };
  });
