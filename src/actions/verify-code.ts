"use server";

import { scryptSync, timingSafeEqual } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

function checkCode(stored: string, code: string): boolean {
  const [salt, hash] = stored.split(":");
  const hashBuf = Buffer.from(hash, "hex");
  const codeBuf = scryptSync(code, salt, 32);
  return timingSafeEqual(codeBuf, hashBuf);
}

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

  const valid = checkCode(event.access_code, code);
  return { valid };
}
