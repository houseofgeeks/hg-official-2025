import Link from "next/link";
import { FaTrophy, FaRegCalendarAlt } from "react-icons/fa";

type EventCardProps = {
  date: string;
  category: string;
  title: string;
  description: string;
  eventurl: string;
  imageUrl?: string;
};

export default function EventCard({
  date,
  category,
  title,
  description,
  eventurl,
  imageUrl,
}: EventCardProps) {
  return (
     <Link href={`/events/${eventurl}`} >
    <div className="w-full rounded-2xl p-10 group hover:scale-103 transition-all duration-300 border border-transparent hover:border-themecolor interactive-element grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
      {/* Left Card */}
      {/* <div className="relative h-56 rounded-2xl bg-linear-to-br from-[#1a0b12] to-black border border-white/10 flex items-center justify-center"> */}
      <div className="relative h-56 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            {/* Black box overlay, covers full image box */}
            <div className="absolute inset-0 bg-black/70 bg-opacity-10 z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <span className="text-lg md:text-xl font-bold text-white drop-shadow-lg mb-2">Event Gallery</span>
              <span className="mt-1">
                <span className="bg-themecolor text-white px-4 py-1 rounded-full font-semibold shadow-lg hover:bg-pink-600 transition cursor-pointer text-sm">View Event</span>
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-pink-500">
            <FaTrophy size={36} />
            <span className="text-xs tracking-widest text-white/60">
              EVENT GALLERY
            </span>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="lg:col-span-2 space-y-4">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400">
            <FaRegCalendarAlt size={14} />
            {date}
          </span>
          <span>{category}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl text-white font-montserrat group-hover:text-themecolor">
          {title}
        </h3>

        {/* Divider */}
        <div className="w-12 h-0.5 bg-pink-500" />

        {/* Description */}
        <p className="text-white leading-relaxed font-montserrat">
          {description}
        </p>
      </div>
    </div>
    </Link>
  );
}
