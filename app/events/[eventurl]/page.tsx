import { notFound } from "next/navigation";
import { getEventByUrl } from "@/lib/eventsService";
import Navbar from "@/components/Navbar";
import EventGallery from "@/components/EventGallery"

type Props = {
  params: Promise<{
    eventurl: string;
  }>;
};

export default async function EventDetailsPage({ params }: Props) {
  const { eventurl } = await params; // ✅ unwrap params

  const event = await getEventByUrl(eventurl);

  if (!event) {
    notFound();
  }

  return (
    <main className="px-8 py-8 w-full margin-auto min-h-screen">
        <Navbar />
    <div className="px-6 md:px-16 py-10">

      {/* EVENT HEADER */}
      <h1 className="text-4xl md:text-5xl font-montserrat font-semibold text-themecolor" style={{ color: '#ffffff' }}>
        {event.title}
      </h1>

      <p className="font-montserrat text-white mt-2">
        {event.date} • {event.category}
      </p>

      {/* DESCRIPTION */}
      <div className="mt-8 w-full max-w-6xl">
        <p className="font-montserrat text-white leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* GALLERY */}
      <section className="mt-14">
        <h2 className="font-teko text-3xl font-bold text-themecolor mb-6">
          Event Gallery
        </h2>

        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {event.images && event.images.length > 0 ? (
            event.images.map((img) => (
              <div key={img.public_id} className="aspect-square rounded-lg overflow-hidden">
                <img src={img.url} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="text-white/70">No photos added for this event yet.</div>
          )}
        </div> */}
        <EventGallery images={event.images} />
      </section>

    </div>
    </main>
  );
}
