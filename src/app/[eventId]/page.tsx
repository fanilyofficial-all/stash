import EventGallery from "@/components/event-gallery";

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { eventId } = await params;
  const { created } = await searchParams;
  return <EventGallery slug={eventId} showShareBanner={created === "true"} />;
}
