"use client";

import { useState } from "react";
import { Share2, X } from "lucide-react";

export default function ShareBanner({ slug }: { slug: string }) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `/${slug}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-accent-light border-b border-border text-[13px]">
      <Share2 size={14} className="text-accent shrink-0" />
      <span className="text-text-primary flex-1">Your stash is live.</span>
      <button
        onClick={copy}
        className="font-medium text-accent shrink-0"
      >
        {copied ? "Copied!" : "Copy link"}
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
