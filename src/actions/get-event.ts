"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Event, Photo } from "@/lib/types";

export async function getEvent(
  slug: string
): Promise<{ event: Event; photos: Photo[] } | null> {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) return null;

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("event_id", event.id)
    .order("uploaded_at", { ascending: true });

  const admin = createAdminClient();
  const photosWithUrls: Photo[] = await Promise.all(
    (photos || []).map(async (photo) => {
      const displayPath = photo.display_path ?? photo.storage_path;
      const { data } = await admin.storage
        .from("stash-photos")
        .createSignedUrl(displayPath, 86400);
      return { ...photo, signed_url: data?.signedUrl ?? undefined };
    })
  );

  return { event, photos: photosWithUrls };
}
