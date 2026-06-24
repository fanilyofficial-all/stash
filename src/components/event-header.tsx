"use client";

import { useState } from "react";
import { Clock, Share2 } from "lucide-react";
import type { Event } from "@/lib/types";

function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return "Never closes";
  const date = new Date(expiresAt);
  return `Closes ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function EventHeader({
  event,
  slug,
  photoCount,
}: {
  event: Event;
  slug: string;
  photoCount: number;
}) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `/${slug}`;

  async function share() {
    if (navigator.canShare && navigator.canShare()) {
      try {
        await navigator.share({
          title: event.name,
          text: "Drop your photos in my stash",
          url,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="px-6 md:px-10 pt-8 pb-4">
      <h1
        className="font-display font-light text-text-primary leading-[1.1]"
        style={{
          fontSize: event.name.length > 30 ? "36px" : "48px",
        }}
      >
        {event.name}
      </h1>

      {event.message && (
        <p className="mt-3 text-[15px] text-text-secondary leading-relaxed">
          {event.message}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-[13px] text-text-tertiary">
        <span className="flex items-center gap-1.5">
          <Clock size={13} />
          {formatExpiry(event.expires_at)}
        </span>
        <span>
          {photoCount} {photoCount === 1 ? "photo" : "photos"}
        </span>
        <button
          onClick={share}
          title={copied ? "Link copied" : "Share stash"}
          className="stash-btn-press ml-auto flex items-center gap-1.5 text-text-secondary"
        >
          <Share2 size={14} />
          <span className="text-[13px]">{copied ? "Copied" : "Share"}</span>
        </button>
      </div>
    </div>
  );
}
