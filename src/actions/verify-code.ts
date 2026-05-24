"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";

export async function verifyCode(
  slug: string,
  code: string
): Promise<{ valid: boolean }> {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("access_code")
    .eq("slug", slug)
    .single();

  if (!event?.access_code) return { valid: false };

  const valid = await bcrypt.compare(code, event.access_code);
  return { valid };
}
