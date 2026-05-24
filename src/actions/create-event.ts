"use server";

import { randomBytes, scryptSync } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import type { ExpiryOption } from "@/lib/types";

function getExpiresAt(expiry: ExpiryOption): string | null {
  if (expiry === "never") return null;
  const days: Record<Exclude<ExpiryOption, "never">, number> = {
    "1d": 1,
    "3d": 3,
    "7d": 7,
    "30d": 30,
  };
  const date = new Date();
  date.setDate(date.getDate() + days[expiry as Exclude<ExpiryOption, "never">]);
  return date.toISOString();
}

function hashCode(code: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(code, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export async function createEvent(data: {
  name: string;
  message: string;
  auth_type: "open" | "code";
  access_code: string;
  allow_download: boolean;
  expiry: ExpiryOption;
}): Promise<{ slug: string } | { error: string }> {
  const supabase = await createClient();

  const slug = randomBytes(6).toString("base64url");

  let hashedCode: string | null = null;
  if (data.auth_type === "code" && data.access_code.length === 6) {
    hashedCode = hashCode(data.access_code);
  }

  const { error } = await supabase.from("events").insert({
    slug,
    name: data.name,
    message: data.message || null,
    auth_type: data.auth_type,
    access_code: hashedCode,
    allow_download: data.allow_download,
    expires_at: getExpiresAt(data.expiry),
  });

  if (error) return { error: error.message };

  return { slug };
}
