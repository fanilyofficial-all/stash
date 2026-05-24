"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createEvent } from "@/actions/create-event";
import type { ExpiryOption } from "@/lib/types";

const EXPIRY_OPTIONS: { label: string; value: ExpiryOption }[] = [
  { label: "1 day", value: "1d" },
  { label: "3 days", value: "3d" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "Never", value: "never" },
];

const inputClass =
  "h-[52px] w-full rounded-input border border-border bg-surface px-4 text-[15px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors";

export default function CreateEventForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [authType, setAuthType] = useState<"open" | "code">("open");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [allowDownload, setAllowDownload] = useState(true);
  const [expiry, setExpiry] = useState<ExpiryOption>("7d");
  const [error, setError] = useState<string | null>(null);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handlePinChange(index: number, value: string) {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6);
      const next = Array.from({ length: 6 }, (_, i) => digits[i] ?? "");
      setPin(next);
      pinRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const next = [...pin];
    next[index] = value;
    setPin(next);
    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  }

  function handleSubmit() {
    if (!name.trim() || isPending) return;
    setError(null);

    startTransition(async () => {
      const result = await createEvent({
        name: name.trim(),
        message: message.trim(),
        auth_type: authType,
        access_code: pin.join(""),
        allow_download: allowDownload,
        expiry,
      });

      if ("error" in result) {
        setError("Something went wrong. Try again.");
        return;
      }

      router.push(`/${result.slug}?created=true`);
    });
  }

  function toggleButton(active: boolean) {
    return active
      ? "bg-accent text-white"
      : "border border-text-primary bg-transparent text-text-primary";
  }

  // iOS Safari: touchend fires before scroll-detection can cancel the gesture.
  // e.preventDefault() suppresses the synthetic click to avoid double-firing.
  // Also using onClick as a fallback for non-touch environments.
  function touchHandler<T>(action: (v: T) => void, value: T) {
    return {
      onClick: () => action(value),
      onTouchEnd: (e: React.TouchEvent) => { e.preventDefault(); action(value); },
    };
  }

  // Use a div instead of form — iOS Safari intercepts touch events differently
  // for <button type="button"> elements inside <form> elements (WebKit bug).
  return (
    <div role="form" className="flex flex-col gap-6">
      {/* Event name */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="What's the occasion?"
        maxLength={60}
        className={inputClass}
      />

      {/* Message to guests */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Say something to the people joining..."
        maxLength={200}
        rows={3}
        className="w-full rounded-input border border-border bg-surface px-4 py-3 text-[15px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors resize-none"
      />

      {/* Who can upload */}
      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-text-secondary">
          Who can upload?
        </p>
        <div className="flex gap-2">
          {(
            [
              { label: "Anyone with the link", value: "open" },
              { label: "Link + access code", value: "code" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              {...touchHandler(setAuthType, opt.value)}
              className={`flex-1 h-[44px] rounded-pill text-[13px] font-medium transition-colors ${toggleButton(authType === opt.value)}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* PIN inputs — animated in/out */}
        {/* pointer-events-none when collapsed: iOS WebKit doesn't clip touch targets
            for overflow:hidden containers that have transition-all applied */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            authType === "code"
              ? "max-h-[160px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="pt-1 flex flex-col gap-3">
            <p className="text-[13px] font-medium text-text-secondary">
              Set a 6-digit code
            </p>
            <div className="flex gap-2">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    pinRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  className="min-w-0 flex-1 h-[64px] rounded-input border border-border bg-surface text-center text-xl font-medium text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download permission */}
      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-text-secondary">
          Can guests download photos?
        </p>
        <div className="flex gap-2">
          {(
            [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ] as const
          ).map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              {...touchHandler(setAllowDownload, opt.value)}
              className={`flex-1 h-[44px] rounded-pill text-[13px] font-medium transition-colors ${toggleButton(allowDownload === opt.value)}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expiry */}
      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-text-secondary">
          Stash closes in
        </p>
        <div className="flex gap-1.5">
          {EXPIRY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              {...touchHandler(setExpiry, opt.value)}
              className={`flex-1 h-[44px] rounded-pill text-[13px] font-medium transition-colors ${toggleButton(expiry === opt.value)}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-[13px] text-destructive">{error}</p>
      )}

      {/* Submit */}
      <button
        type="button"
        disabled={!name.trim() || isPending}
        onClick={handleSubmit}
        onTouchEnd={(e) => { e.preventDefault(); handleSubmit(); }}
        className="h-[52px] w-full rounded-pill bg-accent text-white text-[16px] font-medium flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Creating...
          </>
        ) : (
          "Create stash"
        )}
      </button>
    </div>
  );
}
