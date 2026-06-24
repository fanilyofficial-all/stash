"use client";

import { useState, useRef, useTransition, useEffect } from "react";
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

function pillClass(active: boolean) {
  return `stash-pill flex-1 h-[44px] rounded-pill text-[13px] font-medium border ${
    active
      ? "bg-accent border-accent text-white"
      : "border-[#141414] bg-transparent text-text-primary"
  }`;
}

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pinFlash, setPinFlash] = useState(false);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pinComplete = pin.every((d) => d !== "");
  const isDisabled = !name.trim() || isPending || (authType === "code" && !pinComplete);

  // Brief accent flash on all PIN boxes when code is complete
  useEffect(() => {
    if (pinComplete && authType === "code") {
      setPinFlash(true);
      const t = setTimeout(() => setPinFlash(false), 500);
      return () => clearTimeout(t);
    }
  }, [pinComplete, authType]);

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
    if (isDisabled) return;
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

  // iOS Safari: touchend fires before scroll-detection can cancel the gesture.
  // e.preventDefault() suppresses the synthetic click to avoid double-firing.
  function touchHandler<T>(action: (v: T) => void, value: T) {
    return {
      onClick: () => action(value),
      onTouchEnd: (e: React.TouchEvent) => { e.preventDefault(); action(value); },
    };
  }

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

      {/* Advanced options — toggle + collapsible section */}
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="stash-more-options self-start mb-4"
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? "Fewer options ↑" : "More options ↓"}
        </button>

        {/* CSS grid trick: animate grid-template-rows 0fr → 1fr for smooth height */}
        <div
          className="stash-advanced-section"
          style={{ gridTemplateRows: showAdvanced ? "1fr" : "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col gap-6 pb-1">

              {/* Who can upload */}
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-medium text-text-secondary">Who can upload?</p>
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
                      className={pillClass(authType === opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* PIN reveal — slides down when "Link + access code" is selected */}
                <div
                  className="stash-pin-reveal"
                  style={{
                    gridTemplateRows: authType === "code" ? "1fr" : "0fr",
                    opacity: authType === "code" ? 1 : 0,
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="pt-3 flex flex-col gap-3"
                      style={{ pointerEvents: authType === "code" ? "auto" : "none" }}
                    >
                      <p className="text-[13px] font-medium text-text-secondary">Set a 6-digit code</p>
                      <div className="flex gap-2">
                        {pin.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => { pinRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handlePinChange(i, e.target.value)}
                            onKeyDown={(e) => handlePinKeyDown(i, e)}
                            className={`stash-pin-input min-w-0 flex-1 h-[64px] rounded-input border bg-surface text-center text-xl font-medium text-text-primary focus:outline-none ${
                              pinFlash ? "border-accent" : "border-border focus:border-accent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Can guests download photos */}
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-medium text-text-secondary">Can guests download photos?</p>
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
                      className={pillClass(allowDownload === opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stash closes in */}
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-medium text-text-secondary">Stash closes in</p>
                <div className="flex gap-1.5">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      {...touchHandler(setExpiry, opt.value)}
                      className={pillClass(expiry === opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-[13px] text-destructive">{error}</p>
      )}

      {/* Submit */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleSubmit}
        onTouchEnd={(e) => { e.preventDefault(); handleSubmit(); }}
        className="stash-submit h-[52px] w-full rounded-pill bg-accent text-white text-[16px] font-medium flex items-center justify-center"
        style={{ opacity: isDisabled ? 0.4 : 1 }}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          "Create stash"
        )}
      </button>
    </div>
  );
}
