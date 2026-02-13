
import Link from "next/link";
import Image from "next/image";
import { getEvents } from "@/lib/eventsService";
import Navbar from "@/components/Navbar";

// Optimize Cloudinary URL for small circular thumbnails
const optimizeImageUrl = (url: string): string => {
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // Add transformations: width=50, height=50, crop=fill, quality=auto:low, format=auto
      return `${parts[0]}/upload/w_50,h_50,c_fill,g_face,q_auto:low,f_auto/${parts[1]}`;
    }
  }
  return url;
};

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <main className="px-8 py-8 w-full margin-auto min-h-screen">
      <Navbar />
      <div className="px-6 md:px-16 py-10">
        <h1 className="font-teko text-4xl md:text-5xl text-themecolor mb-8">
          Events
        </h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, eventIndex) => (
            <Link
              key={event.id}
              href={`/events/${event.eventurl}`}
              className="block h-full"
            >
              <div className="interactive-element flex flex-col text-white hover:border-themecolor rounded-2xl p-6 gap-4 group hover:scale-103 transition-all duration-300 border border-transparent hover:bg-gray-900 h-full">
                
                {/* Overlapping Images Section */}
                {event.images && event.images.length > 0 && (
                  <div className="flex items-center mb-2 h-12">
                    <div className="flex -space-x-2">
                      {event.images.slice(0, 5).map((img, idx) => (
                        <div
                          key={img.public_id || idx}
                          className="relative w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden hover:scale-110 hover:z-10 transition-transform duration-200 shadow-lg bg-gray-800"
                          style={{ zIndex: 5 - idx }}
                        >
                          <Image
                            src={optimizeImageUrl(img.url)}
                            alt={`${event.title} image ${idx + 1}`}
                            fill
                            sizes="40px"
                            className="object-cover"
                            priority={eventIndex < 6}
                            quality={60}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQA=="
                          />
                        </div>
                      ))}
                      {event.images.length > 5 && (
                        <div
                          className="relative w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center font-bold shadow-lg text-white"
                          style={{
                            fontSize: '0.75rem',
                            zIndex: 0,
                            backgroundColor: [
                              '#f472b6', '#a78bfa', '#38bdf8', '#facc15', 
                              '#34d399', '#f87171', '#60a5fa'
                            ][event.images[0]?.public_id?.length % 7 || 0] || '#f472b6',
                          }}
                        >
                          +{event.images.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Title */}
                <h2 className="font-teko text-2xl text-white group-hover:text-themecolor transition-colors">
                  {event.title}
                </h2>

                {/* Date and Category */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full bg-themecolor/20 text-themecolor font-montserrat">
                    {event.date}
                  </span>
                  <span className="text-gray-400 font-montserrat">
                    {event.category}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-themecolor" />

                {/* Description */}
                <p className="font-montserrat text-gray-300 text-sm leading-relaxed line-clamp-3 grow">
                  {event.description}
                </p>

                {/* View More Link */}
                <div className="mt-auto pt-2">
                  <span className="text-themecolor font-montserrat text-sm group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
