"use client";

import { useEffect, useRef, useState } from "react";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/lib/types";

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
  const touchStartX = useRef(0);

  const photo = photos[index];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIndex((i) => Math.min(photos.length - 1, i + 1));
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
      if (delta < 0) setIndex((i) => Math.min(photos.length - 1, i + 1));
      else setIndex((i) => Math.max(0, i - 1));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#141414", animation: "fade-in 300ms ease" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 text-white/80 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIndex((i) => i - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Photo */}
      {photo.signed_url && (
        <img
          key={photo.id}
          src={photo.signed_url}
          alt=""
          className="max-w-full max-h-full object-contain"
          style={{ animation: "photo-in 350ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      )}

      {/* Next */}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIndex((i) => i + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Download */}
      {allowDownload && photo.signed_url && (
        <a
          href={photo.signed_url}
          download
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-5 right-5 z-10 text-white/80 hover:text-white transition-colors"
          aria-label="Download"
        >
          <Download size={22} />
        </a>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] text-white/50">
          {index + 1} / {photos.length}
        </span>
      )}
    </div>
  );
}
