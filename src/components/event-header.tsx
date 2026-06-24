import { Clock } from "lucide-react";
import type { Event } from "@/lib/types";

function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return "Never closes";
  const date = new Date(expiresAt);
  return `Closes ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function EventHeader({
  event,
  photoCount,
}: {
  event: Event;
  photoCount: number;
}) {
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
      </div>
    </div>
  );
}
