"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import UploadModal from "./upload-modal";

export default function UploadFab({
  eventId,
  slug,
}: {
  eventId: string;
  slug: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let stopTimer: ReturnType<typeof setTimeout>;

    function handleScroll() {
      const y = window.scrollY;
      const scrollingDown = y > lastY && y > 80;
      setCollapsed(scrollingDown);
      lastY = y;

      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => setCollapsed(false), 800);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-accent text-white rounded-pill transition-all duration-200 overflow-hidden"
        style={{
          padding: collapsed ? "12px" : "12px 20px",
          boxShadow: "0 4px 24px rgba(74, 45, 111, 0.25)",
        }}
        aria-label="Upload photos"
      >
        <Camera size={20} className="shrink-0" />
        <span
          className="text-[15px] font-medium whitespace-nowrap transition-all duration-200 overflow-hidden"
          style={{
            maxWidth: collapsed ? "0" : "120px",
            opacity: collapsed ? 0 : 1,
          }}
        >
          Drop photos
        </span>
      </button>

      <UploadModal
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        eventId={eventId}
        slug={slug}
      />
    </>
  );
}
