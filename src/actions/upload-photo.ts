"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Photo } from "@/lib/types";

const UPLOAD_LIMIT = 10;

export async function uploadDisplayPhoto(
  displayFile: File,
  eventId: string,
  sessionId: string
): Promise<{ photo: Photo } | { error: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  // Check event exists and hasn't expired
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, expires_at")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return { error: "Event not found." };
  }

  if (event.expires_at && new Date(event.expires_at) < new Date()) {
    return { error: "This event has expired and is no longer accepting uploads." };
  }

  // Enforce per-session upload limit server-side
  const { count, error: countError } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("uploader_session_id", sessionId);

  if (countError) {
    return { error: "Could not verify upload limit. Please try again." };
  }

  if ((count ?? 0) >= UPLOAD_LIMIT) {
    return { error: `You've reached the limit of ${UPLOAD_LIMIT} photos per event.` };
  }

  const timestamp = Date.now();
  const displayPath = `${eventId}/display/${timestamp}-${displayFile.name}`;

  const { error: uploadError } = await admin.storage
    .from("stash-photos")
    .upload(displayPath, displayFile);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: photo, error: insertError } = await supabase
    .from("photos")
    .insert({
      event_id: eventId,
      storage_path: displayPath,
      display_path: displayPath,
      uploader_session_id: sessionId,
    })
    .select()
    .single();

  if (insertError || !photo) {
    return { error: insertError?.message ?? "Upload failed" };
  }

  const { data: signedData } = await admin.storage
    .from("stash-photos")
    .createSignedUrl(displayPath, 86400);

  return { photo: { ...photo, signed_url: signedData?.signedUrl ?? undefined } };
}

export async function uploadOriginalPhoto(
  originalFile: File,
  eventId: string,
  photoId: string
): Promise<void> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const timestamp = Date.now();
  const originalPath = `${eventId}/original/${timestamp}-${originalFile.name}`;

  const { error: uploadError } = await admin.storage
    .from("stash-photos")
    .upload(originalPath, originalFile);

  if (uploadError) return;

  await supabase
    .from("photos")
    .update({ original_path: originalPath })
    .eq("id", photoId);
}
