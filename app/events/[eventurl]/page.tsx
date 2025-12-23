import { notFound } from "next/navigation";
import { eventsData } from "@/lib/customobjects";
import Navbar from "@/components/Navbar";

type Props = {
  params: Promise<{
    eventurl: string;
  }>;
};

export default async function EventDetailsPage({ params }: Props) {
  const { eventurl } = await params; // ✅ unwrap params

  const event = eventsData.find(
    (e) => e.eventurl === eventurl
  );

  if (!event) {
    notFound();
  }

  return (
    <main className="px-8 py-8 w-full margin-auto min-h-screen">
        <Navbar />
    <div className="px-6 md:px-16 py-10">

      {/* EVENT HEADER */}
      <h1 className="font-teko text-4xl md:text-5xl text-themecolor">
        {event.title}
      </h1>

      <p className="font-montserrat text-white mt-2">
        {event.date} • {event.category}
      </p>

      {/* DESCRIPTION */}
      <div className="mt-8 max-w-3xl">
        <p className="font-montserrat text-gray-300 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* GALLERY PLACEHOLDER */}
      <section className="mt-14">
        <h2 className="font-teko text-3xl text-themecolor mb-6">
          Event Gallery
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border-2 border-dashed border-themecolor/40 rounded-lg flex items-center justify-center"
            >
              <span className="font-montserrat text-sm text-themecolor/60">
                Photo
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
    </main>
  );
}
