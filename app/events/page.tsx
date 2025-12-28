import Link from "next/link";
import { eventsData } from "@/lib/customobjects";
import Navbar from "@/components/Navbar";
import { getEvents } from "@/lib/eventsService";


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
