import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg flex items-center justify-center">
      {/* Wordmark — out of flow so it doesn't shift the center */}
      <header className="absolute top-0 left-0 px-6 md:px-10 pt-6">
        <span
          className="font-sans font-medium text-text-primary text-[15px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          stash
        </span>
      </header>

      {/* Centered content */}
      <div className="w-full px-6 md:px-10 md:max-w-[640px] md:text-center">
          <h1
            className="font-display text-[48px] font-light leading-[1.1] text-text-primary"
            style={{ animation: "fade-up 0.5s ease both", animationDelay: "0ms" }}
          >
            Drop your shots.{" "}
            <br className="hidden sm:block" />
            Everyone gets the good ones.
          </h1>

          <p
            className="mt-5 text-[15px] text-text-secondary leading-relaxed"
            style={{ animation: "fade-up 0.5s ease both", animationDelay: "120ms" }}
          >
            Create a private photo album for any moment. Share a link. Done.
          </p>

          <div
            className="mt-8"
            style={{ animation: "fade-up 0.5s ease both", animationDelay: "240ms" }}
          >
            <Link
              href="/create"
              className="inline-block px-7 py-3.5 rounded-pill bg-[#4A2D6F] text-white font-sans font-medium text-[15px] leading-none hover:opacity-90 active:opacity-80 transition-opacity"
            >
              Create a stash
            </Link>
            <p className="mt-4 text-[13px] text-text-tertiary">No account needed. Free to use.</p>
          </div>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
