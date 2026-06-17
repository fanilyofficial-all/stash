"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getOriginalSignedUrl(
  photoId: string
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: photo } = await supabase
    .from("photos")
    .select("original_path, storage_path")
    .eq("id", photoId)
    .single();

  if (!photo) return { error: "Photo not found" };

  const path = photo.original_path ?? photo.storage_path;

  const { data } = await admin.storage
    .from("stash-photos")
    .createSignedUrl(path, 3600);

  if (!data?.signedUrl) return { error: "Failed to generate download URL" };

  return { url: data.signedUrl };
}
