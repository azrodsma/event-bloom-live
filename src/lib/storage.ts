import { supabase } from "@/integrations/supabase/client";

/**
 * Upload a user file into the private `event-media` bucket and return a
 * long-lived signed URL usable as `<img src>` / `<video src>`.
 *
 * Path convention: `<eventId>/<userId>/<timestamp>-<safeName>`.
 */
export async function uploadEventMedia(params: {
  eventId: string;
  file: File;
  userId: string;
}): Promise<{ url: string; path: string }> {
  const { eventId, file, userId } = params;
  const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(-60);
  const path = `${eventId}/${userId}/${Date.now()}-${safe}`;

  const { error } = await supabase.storage
    .from("event-media")
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);

  // 1 year signed URL — bucket is private, so we need a signature.
  const { data: signed, error: signErr } = await supabase.storage
    .from("event-media")
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr || !signed) throw new Error(signErr?.message ?? "Sign URL failed");
  return { url: signed.signedUrl, path };
}
