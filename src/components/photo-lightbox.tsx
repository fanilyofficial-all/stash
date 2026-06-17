"use client";

import { useEffect, useRef, useState } from "react";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/lib/types";
import { getOriginalSignedUrl } from "@/actions/get-original-url";

export default function PhotoLightbox({
  photos,
  initialIndex,
  allowDownload,
  onClose,
}: {
  photos: Photo[];
  initialIndex: number;
  allowDownload: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const touchStartX = useRef(0);

  const photo = photos[index];

  function prev() {
    setDirection("left");
    setIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    setDirection("right");
    setIndex((i) => Math.min(photos.length - 1, i + 1));
  }

  useEffect(() => {
    setIsDownloading(false);
  }, [photo?.id]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") { setDirection("left"); setIndex((i) => Math.max(0, i - 1)); }
      if (e.key === "ArrowRight") { setDirection("right"); setIndex((i) => Math.min(photos.length - 1, i + 1)); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, photos.length]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
  }

  async function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    if (isDownloading) return;
    setIsDownloading(true);
    const result = await getOriginalSignedUrl(photo.id);
    setIsDownloading(false);
    if (!("error" in result)) {
      const a = document.createElement("a");
      a.href = result.url;
      a.download = "";
      a.click();
    }
  }

  const imgAnimation =
    direction === "right"
      ? "slide-from-right 350ms cubic-bezier(0.16, 1, 0.3, 1)"
      : direction === "left"
      ? "slide-from-left 350ms cubic-bezier(0.16, 1, 0.3, 1)"
      : "fade-in 200ms ease";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#141414", animation: "fade-in 200ms ease" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
    >
      {/* Counter — top center */}
      {photos.length > 1 && (
        <span
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-[13px] font-sans tabular-nums pointer-events-none select-none"
          style={{ color: "#B0ABA6" }}
        >
          {index + 1} / {photos.length}
        </span>
      )}

      {/* Close — top right */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-2 right-2 z-10 flex items-center justify-center w-11 h-11 text-white/70 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      {/* Prev arrow */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
      )}

      {/* Photo — display version (1920px max) */}
      {photo.signed_url && (
        <img
          key={photo.id}
          src={photo.signed_url}
          alt=""
          className="max-w-full max-h-full object-contain"
          style={{ animation: imgAnimation }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      )}

      {/* Next arrow */}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight size={24} strokeWidth={1.5} />
        </button>
      )}

      {/* Download — fetches original full-res on click */}
      {allowDownload && (
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 h-11 px-5 rounded-full text-white text-[15px] font-medium transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
          style={{ backgroundColor: "#4A2D6F" }}
        >
          <Download size={16} strokeWidth={1.5} />
          {isDownloading ? "Preparing..." : "Download photo"}
        </button>
      )}
    </div>
  );
}
