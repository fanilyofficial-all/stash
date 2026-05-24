"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { verifyCode } from "@/actions/verify-code";

export default function CodeGate({ slug }: { slug: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

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
    if (e.key === "Enter" && pin.every((d) => d !== "")) {
      handleSubmit();
    }
  }

  function handleSubmit() {
    const code = pin.join("");
    if (code.length !== 6) return;

    setError(false);
    startTransition(async () => {
      const { valid } = await verifyCode(slug, code);

      if (!valid) {
        setShake(true);
        setError(true);
        setPin(["", "", "", "", "", ""]);
        setTimeout(() => {
          setShake(false);
          pinRefs.current[0]?.focus();
        }, 400);
        return;
      }

      // Set auth cookie for 7 days
      document.cookie = `stash-auth-${slug}=true; max-age=${60 * 60 * 24 * 7}; path=/; samesite=lax`;
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <header className="px-6 md:px-10 pt-6">
        <span
          className="font-sans font-medium text-text-primary text-[15px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          stash
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 pb-16">
        <div className="w-full max-w-[360px] flex flex-col gap-6">
          <div>
            <h1 className="font-display text-[36px] font-light leading-tight text-text-primary">
              This stash is private.
            </h1>
            <p
              className={`mt-2 text-[15px] transition-colors ${
                error ? "text-destructive" : "text-text-secondary"
              }`}
            >
              {error
                ? "Wrong code. Try again."
                : "Enter the code to see the photos."}
            </p>
          </div>

          {/* PIN inputs */}
          <div
            className="flex gap-2"
            style={
              shake
                ? { animation: "shake 350ms cubic-bezier(0.16, 1, 0.3, 1)" }
                : {}
            }
          >
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

          <button
            onClick={handleSubmit}
            disabled={pin.some((d) => !d) || isPending}
            className="h-[52px] w-full rounded-pill bg-accent text-white text-[16px] font-medium flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Checking...
              </>
            ) : (
              "Enter"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
