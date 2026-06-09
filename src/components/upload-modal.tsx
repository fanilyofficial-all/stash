"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { uploadPhoto } from "@/actions/upload-photo";

const UPLOAD_LIMIT = 10;
const MAX_PX = 1920;
const JPEG_QUALITY = 0.8;

type FileStatus = "pending" | "uploading" | "done" | "error";

function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_PX / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(new File([blob!], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" })),
        "image/jpeg",
        JPEG_QUALITY,
      );
    };
    img.src = url;
  });
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("stash-session-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("stash-session-id", id);
  }
  return id;
}

function getUploadCount(slug: string): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(`stash-uploads-${slug}`) ?? "0", 10);
}

function incrementUploadCount(slug: string) {
  const count = getUploadCount(slug);
  localStorage.setItem(`stash-uploads-${slug}`, String(count + 1));
}

export default function UploadModal({
  open,
  onOpenChange,
  eventId,
  slug,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  slug: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<FileStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadedCount = getUploadCount(slug);
  const remaining = Math.max(0, UPLOAD_LIMIT - uploadedCount);
  const atLimit = remaining === 0;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    setSelectedFiles((prev) => {
      const slots = Math.max(0, remaining - prev.length);
      const chosen = files.slice(0, slots);
      return [...prev, ...chosen];
    });
    setPreviewUrls((prev) => {
      const slots = Math.max(0, remaining - prev.length);
      const chosen = files.slice(0, slots);
      return [...prev, ...chosen.map((f) => URL.createObjectURL(f))];
    });
    setStatuses((prev) => {
      const slots = Math.max(0, remaining - prev.length);
      return [...prev, ...Array(Math.min(files.length, slots)).fill("pending")];
    });
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setStatuses((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (!selectedFiles.length || isUploading) return;

    setIsUploading(true);
    setStatuses(selectedFiles.map(() => "uploading"));
    const sessionId = getSessionId();

    await Promise.all(
      selectedFiles.map(async (file, i) => {
        const compressed = await compressImage(file);
        const result = await uploadPhoto(compressed, eventId, sessionId);
        setStatuses((prev) => {
          const next = [...prev];
          next[i] = "error" in result ? "error" : "done";
          return next;
        });
        if (!("error" in result)) incrementUploadCount(slug);
      })
    );

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setIsUploading(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setStatuses([]);
    onOpenChange(false);
    router.refresh();
  }

  const pendingCount = selectedFiles.filter((_, i) => statuses[i] === "pending").length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="rounded-t-[20px] px-0 pb-safe max-h-[85svh] overflow-y-auto">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <SheetHeader className="px-6 pb-2">
          <SheetTitle className="font-display text-[24px] font-light text-text-primary text-left">
            Drop your photos
          </SheetTitle>
          <SheetDescription className="text-[14px] text-text-secondary text-left">
            Up to 10 photos. They&apos;ll appear in the stash right away.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Upload zone */}
          {!atLimit ? (
            <label
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-card py-8 cursor-pointer hover:border-accent transition-colors"
              htmlFor="photo-upload-input"
            >
              <UploadCloud size={28} className="text-text-tertiary" />
              <span className="text-[14px] text-text-secondary">
                Tap to choose photos
              </span>
              <input
                id="photo-upload-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          ) : (
            <div className="rounded-card bg-accent-light px-4 py-4 text-[14px] text-text-secondary text-center">
              You&apos;ve reached the 10 photo limit.
            </div>
          )}

          {/* Preview grid */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {selectedFiles.map((_, i) => (
                <div key={i} className="relative aspect-square rounded-input overflow-hidden bg-border">
                  <img
                    src={previewUrls[i]}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {/* Progress bar */}
                  {statuses[i] === "uploading" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent"
                         style={{ animation: "progress-fill 1.5s ease-out forwards" }} />
                  )}
                  {statuses[i] === "done" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent" />
                  )}

                  {/* Remove button */}
                  {statuses[i] === "pending" && !isUploading && (
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                      aria-label="Remove"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="h-[52px] w-full rounded-pill bg-accent text-white text-[16px] font-medium transition-opacity disabled:opacity-40"
          >
            {isUploading
              ? "Uploading..."
              : selectedFiles.length > 0
              ? `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? "photo" : "photos"}`
              : "Upload photos"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
