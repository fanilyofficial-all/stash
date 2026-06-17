import { cookies } from "next/headers";
import Link from "next/link";
import { getEvent } from "@/actions/get-event";
import type { Event } from "@/lib/types";
import EventHeader from "./event-header";
import GalleryClientShell from "./gallery-client";
import UploadFab from "./upload-fab";
import CodeGate from "./code-gate";
import ShareBanner from "./share-banner";

const WORDMARK = (
  <header className="px-6 md:px-10 pt-6">
    <Link
      href="/"
      className="font-sans font-medium text-text-primary text-[15px]"
      style={{ letterSpacing: "-0.02em" }}
    >
      stash
    </Link>
  </header>
);

function ExpiredView({ event }: { event: Event }) {
  const closed = event.expires_at
    ? new Date(event.expires_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-bg">
      {WORDMARK}
      <div className="max-w-[480px] mx-auto px-6 md:px-10 pt-16">
        <h1 className="font-display text-[36px] font-light leading-tight text-text-primary">
          {event.name}
        </h1>
        <p className="mt-3 text-[15px] text-text-secondary">
          {closed ? `This stash closed on ${closed}.` : "This stash is closed."}
        </p>
      </div>
    </main>
  );
}

export default async function EventGallery({
  slug,
  showShareBanner,
}: {
  slug: string;
  showShareBanner: boolean;
}) {
  const result = await getEvent(slug);

  if (!result) {
    return (
      <main className="min-h-screen bg-bg">
        {WORDMARK}
        <div className="max-w-[480px] mx-auto px-6 md:px-10 pt-16">
          <h1 className="font-display text-[36px] font-light leading-tight text-text-primary">
            This stash doesn&apos;t exist.
          </h1>
          <Link
            href="/create"
            className="mt-4 inline-block text-[15px] text-accent"
          >
            Create one →
          </Link>
        </div>
      </main>
    );
  }

  const { event, photos } = result;

  if (event.expires_at && new Date(event.expires_at) < new Date()) {
    return <ExpiredView event={event} />;
  }

  if (event.auth_type === "code") {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(`stash-auth-${slug}`);
    if (!authCookie || authCookie.value !== "true") {
      return <CodeGate slug={slug} />;
    }
  }

  return (
    <main className="min-h-screen bg-bg pb-32">
      {showShareBanner && <ShareBanner slug={slug} />}

      {WORDMARK}

      <EventHeader event={event} photoCount={photos.length} />

      <hr className="border-border mx-6 md:mx-10 mb-1" />

      <GalleryClientShell initialPhotos={photos} allowDownload={event.allow_download}>
        <UploadFab eventId={event.id} slug={slug} />
      </GalleryClientShell>
    </main>
  );
}
