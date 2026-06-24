"use client";

import { useState } from "react";
import { Share2, X } from "lucide-react";

export default function ShareBanner({ slug, eventName }: { slug: string; eventName: string }) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `/${slug}`;

  const shareData = {
    title: eventName,
    text: "Drop your photos in my stash",
    url,
  };

  async function share() {
    // Check navigator.share directly — canShare() with no args returns false
    // on some iOS versions even when share is fully supported.
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User dismissed the share sheet — don't fall through to clipboard.
        if (err instanceof Error && err.name === "AbortError") return;
        // Any other error (permissions, unsupported data): fall through.
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-accent-light border-b border-border text-[13px]">
      <Share2 size={14} className="text-accent shrink-0" />
      <span className="text-text-primary flex-1">Your stash is live.</span>
      <button
        onClick={share}
        className="text-accent font-medium shrink-0 underline underline-offset-2"
      >
        {copied ? "Link copied" : "Share stash"}
      </button>
      <button
        onClick={() => setVisible(false)}
        className="text-text-tertiary shrink-0 -mr-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}
