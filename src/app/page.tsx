import Link from "next/link";
import { Lock, Clock, Zap, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Create your stash",
    copy: "Set it up in 30 seconds. Name it, set an expiry, add a PIN if you want.",
  },
  {
    num: "02",
    title: "Share the link",
    copy: "Send it to whoever was there. No app download, no sign up.",
  },
  {
    num: "03",
    title: "Everyone drops their shots",
    copy: "Photos appear instantly in one shared grid.",
  },
];

const features: Array<{ Icon: LucideIcon; title: string; desc: string }> = [
  {
    Icon: Lock,
    title: "Private by default",
    desc: "Only people with the link can see it. No public gallery, no indexing.",
  },
  {
    Icon: Clock,
    title: "Closes when you want",
    desc: "Set an expiry. The stash goes quiet exactly when you say.",
  },
  {
    Icon: Zap,
    title: "No account needed",
    desc: "Guests drop photos without signing up. Zero friction.",
  },
  {
    Icon: Download,
    title: "Download anytime",
    desc: "Grab the full-res originals. Yours to keep, not ours to hold.",
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* Hero fold — fills exactly the viewport on mobile so the marquee is always visible */}
      <div className="flex flex-col min-h-dvh">

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-start justify-center bg-bg px-6 md:px-10">
        <header className="absolute top-0 left-0 px-6 md:px-10 pt-6">
          <span
            className="font-sans font-medium text-[15px] text-text-primary"
            style={{ letterSpacing: "-0.02em" }}
          >
            stash
          </span>
        </header>

        <div className="w-full max-w-[700px] py-16 md:py-24">
          <h1
            className="font-display font-light text-[48px] md:text-[72px] lg:text-[88px] leading-[1.05] text-text-primary"
            style={{
              fontVariationSettings: "'opsz' 144",
              animation: "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: "0ms",
            }}
          >
            <span className="block">One night.</span>
            <span className="block italic">One place.</span>
            <span className="block">Everyone's photos.</span>
          </h1>

          <p
            className="mt-6 text-[15px] md:text-[16px] text-text-secondary leading-relaxed max-w-[380px]"
            style={{
              animation: "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: "100ms",
            }}
          >
            No accounts. No feed. Just the shots from that thing you did.
          </p>

          <div
            className="mt-8 flex flex-col items-start gap-4"
            style={{
              animation: "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: "200ms",
            }}
          >
            <Link
              href="/create"
              className="inline-block px-7 py-3.5 rounded-pill bg-accent text-white font-sans font-medium text-[15px] leading-none hover:opacity-90 active:opacity-80 transition-opacity"
            >
              Create a stash
            </Link>
            <p className="text-[13px] text-text-tertiary">No account needed. Free to use.</p>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{ background: "#141414", padding: "14px 0", overflow: "hidden", width: "100%" }}>
        <div style={{ display: "flex", animation: "marquee-scroll 8s linear infinite", willChange: "transform" }}>
          {[0, 1].map((copy) => (
            <div key={copy} style={{ display: "flex", flexShrink: 0, alignItems: "center" }}>
              {["birthdays", "weddings", "house parties", "rooftop nights", "trips", "festivals", "sunsets", "after parties"].map((item) => (
                <span key={item} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span className="font-display" style={{ fontStyle: "italic", fontWeight: 300, fontSize: "18px", color: "#F7F5F2", whiteSpace: "nowrap", padding: "0 18px" }}>{item}</span>
                  <span style={{ color: "#4A2D6F", fontSize: "18px", lineHeight: 1 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      </div>{/* end hero fold wrapper */}

      {/* How it works */}
      <section className="bg-bg border-t border-border px-6 md:px-10 py-20 md:py-28">
        <h2
          className="font-display font-normal text-[34px] md:text-[44px] leading-[1.1] text-text-primary mb-14"
          style={{ fontVariationSettings: "'opsz' 144" }}
        >
          Simple as it gets.
        </h2>

        <div className="overflow-x-auto">
          <div className="flex min-w-max md:grid md:grid-cols-3 md:min-w-0">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={[
                "w-[260px] md:w-auto",
                i > 0 ? "border-l border-border pl-8 md:pl-10" : "",
                i < 2 ? "pr-8 md:pr-10" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span
                className="block font-display font-light text-[72px] leading-none mb-5 select-none text-border"
                style={{ fontVariationSettings: "'opsz' 144" }}
              >
                {step.num}
              </span>
              <h3 className="font-sans font-medium text-[15px] text-text-primary mb-2">
                {step.title}
              </h3>
              <p className="font-sans text-[14px] text-text-secondary leading-relaxed">
                {step.copy}
              </p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-bg border-t border-border px-6 md:px-10 py-20 md:py-28">
        <h2
          className="font-display font-normal text-[34px] md:text-[44px] leading-[1.1] text-text-primary mb-14 max-w-[480px]"
          style={{ fontVariationSettings: "'opsz' 144" }}
        >
          Everything you need.
          <br />
          Nothing you don't.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-surface border border-border rounded-card p-6 flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-[10px] bg-accent-light flex items-center justify-center flex-shrink-0">
                <Icon size={18} strokeWidth={1.5} className="text-accent" />
              </div>
              <div>
                <h3 className="font-sans font-medium text-[15px] text-text-primary mb-1">
                  {title}
                </h3>
                <p className="font-sans text-[13px] text-text-secondary leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-accent px-6 md:px-10 py-20 md:py-28">
        <div className="max-w-[560px]">
          <h2
            className="font-display font-normal text-[34px] md:text-[52px] leading-[1.1] text-white mb-10"
            style={{ fontVariationSettings: "'opsz' 144" }}
          >
            Your next night out deserves a proper stash.
          </h2>
          <Link
            href="/create"
            className="inline-block px-7 py-3.5 rounded-pill border border-white text-white font-sans font-medium text-[15px] leading-none hover:bg-white hover:text-accent transition-colors"
          >
            Create a stash
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg border-t border-border px-6 md:px-10 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span
            className="font-sans font-medium text-[15px] text-text-primary"
            style={{ letterSpacing: "-0.02em" }}
          >
            stash
          </span>
          <nav className="flex gap-5">
            {["About", "Privacy", "Contact"].map((label) => (
              <a
                key={label}
                href="#"
                className="font-sans text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
          <span className="font-sans text-[13px] text-text-tertiary">
            Made with ♥ in Bangalore
          </span>
        </div>
      </footer>
    </>
  );
}
