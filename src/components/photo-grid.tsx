"use client";

import { useState } from "react";
import type { Photo } from "@/lib/types";
import PhotoLightbox from "./photo-lightbox";

export default function PhotoGrid({
  photos,
  allowDownload,
}: {
  photos: Photo[];
  allowDownload: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 md:px-10 text-center">
        <p className="font-display text-[28px] font-light italic text-text-primary leading-tight">
          Nothing here yet.
        </p>
        <p className="mt-2 text-[15px] text-text-secondary">
          Be the first to drop something.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-[2px]">
        {photos.map((photo, i) =>
          photo.signed_url ? (
            <button
              key={photo.id}
              onClick={() => setLightboxIndex(i)}
              className="aspect-square overflow-hidden block"
              aria-label={`Photo ${i + 1}`}
            >
              <img
                src={photo.signed_url}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  animation: `photo-in 350ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms both`,
                }}
              />
            </button>
          ) : null
        )}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          initialIndex={lightboxIndex}
          allowDownload={allowDownload}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
