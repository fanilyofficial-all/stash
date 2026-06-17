"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhotoGrid from "./photo-grid";
import type { Photo } from "@/lib/types";

type GalleryContextType = {
  addOptimisticPhoto: (photo: Photo) => void;
  onAllUploaded: () => void;
};

export const GalleryContext = createContext<GalleryContextType | null>(null);

export function useGalleryContext() {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error("useGalleryContext must be used within GalleryClientShell");
  return ctx;
}

export default function GalleryClientShell({
  initialPhotos,
  allowDownload,
  children,
}: {
  initialPhotos: Photo[];
  allowDownload: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [optimisticPhotos, setOptimisticPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (optimisticPhotos.length === 0) return;
    const serverIds = new Set(initialPhotos.map((p) => p.id));
    if (optimisticPhotos.every((p) => serverIds.has(p.id))) {
      setOptimisticPhotos([]);
    }
  }, [initialPhotos, optimisticPhotos]);

  const addOptimisticPhoto = useCallback((photo: Photo) => {
    setOptimisticPhotos((prev) => [...prev, photo]);
  }, []);

  const onAllUploaded = useCallback(() => {
    router.refresh();
  }, [router]);

  const serverIds = new Set(initialPhotos.map((p) => p.id));
  const pendingOptimistic = optimisticPhotos.filter((p) => !serverIds.has(p.id));
  const allPhotos = [...initialPhotos, ...pendingOptimistic];

  return (
    <GalleryContext.Provider value={{ addOptimisticPhoto, onAllUploaded }}>
      <PhotoGrid photos={allPhotos} allowDownload={allowDownload} />
      {children}
    </GalleryContext.Provider>
  );
}
