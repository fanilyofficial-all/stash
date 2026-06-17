"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Photo } from "@/lib/types";

export async function uploadDisplayPhoto(
  displayFile: File,
  eventId: string,
  sessionId: string
): Promise<{ photo: Photo } | { error: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

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
