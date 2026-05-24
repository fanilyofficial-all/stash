"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Photo } from "@/lib/types";

export async function uploadPhoto(
  file: File,
  eventId: string,
  sessionId: string
): Promise<{ photo: Photo } | { error: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const storagePath = `${eventId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await admin.storage
    .from("stash-photos")
    .upload(storagePath, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: photo, error: insertError } = await supabase
    .from("photos")
    .insert({
      event_id: eventId,
      storage_path: storagePath,
      uploader_session_id: sessionId,
    })
    .select()
    .single();

  if (insertError || !photo) {
    return { error: insertError?.message ?? "Upload failed" };
  }

  const { data: signedData } = await admin.storage
    .from("stash-photos")
    .createSignedUrl(storagePath, 86400);

  return { photo: { ...photo, signed_url: signedData?.signedUrl ?? undefined } };
}
