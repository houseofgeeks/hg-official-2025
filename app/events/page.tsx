
import Link from "next/link";
import { getEvents } from "@/lib/eventsService";
import Navbar from "@/components/Navbar";

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <main className="px-8 py-8 w-full margin-auto min-h-screen">
      <Navbar />
      <div className="px-6 md:px-16 py-10">
        <h1 className="font-teko text-4xl md:text-5xl text-themecolor mb-8">
          Events
        </h1>
        <div className="space-y-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.eventurl}`}
              className="block border rounded-lg p-5 hover:border-themecolor transition interactive-element"
            >
              {event.images && event.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 justify-start">
                  {event.images.slice(0, 4).map((img, idx) => (
                    <img
                      key={img.public_id || idx}
                      src={img.url}
                      alt={event.title + ' image ' + (idx + 1)}
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full border-2 border-white shadow"
                    />
                  ))}
                  {event.images.length > 4 && (
                    <div
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border-2 border-white shadow text-white font-bold"
                      style={{
                        fontSize: 'clamp(0.7rem, 2vw, 1.1rem)',
                        backgroundColor: event.images[0]?.public_id
                          ? [
                              '#f472b6', // pink-400
                              '#a78bfa', // purple-400
                              '#38bdf8', // sky-400
                              '#facc15', // yellow-400
                              '#34d399', // green-400
                              '#f87171', // red-400
                              '#60a5fa', // blue-400
                            ][event.images[0].public_id.length % 7]
                          : '#f472b6', // fallback pink
                      }}
                    >
                      +{event.images.length - 4}
                    </div>
                  )}
                </div>
              )}
              <h2 className="font-teko text-2xl text-themecolor">
                {event.title}
              </h2>
              <p className="font-montserrat text-sm text-white">
                {event.date} • {event.category}
              </p>
              <p className="font-montserrat text-gray-300 mt-2">
                {event.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
