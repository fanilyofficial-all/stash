import Link from "next/link";
import CreateEventForm from "@/components/create-event-form";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="px-6 md:px-10 pt-6">
        <Link
          href="/"
          className="font-sans font-medium text-text-primary text-[15px] hover:opacity-70 transition-opacity"
          style={{ letterSpacing: "-0.02em" }}
        >
          stash
        </Link>
      </header>

      <div className="max-w-[480px] mx-auto px-6 md:px-10 pt-12 pb-24">
        <h1 className="font-display text-[36px] font-light leading-[1.15] text-text-primary">
          Create your stash
        </h1>
        <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">
          Set it up. Share the link. Get everyone&apos;s shots.
        </p>
        <div className="mt-8">
          <CreateEventForm />
        </div>
      </div>
    </main>
  );
}
