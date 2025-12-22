import { FaTrophy, FaRegCalendarAlt } from "react-icons/fa";

type EventCardProps = {
  date: string;
  category: string;
  title: string;
  description: string;
};

export default function EventCard({
  date,
  category,
  title,
  description,
}: EventCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center py-4">
      {/* Left Card */}
      <div className="relative h-56 rounded-2xl bg-gradient-to-br from-[#1a0b12] to-black border border-white/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-pink-500">
          <FaTrophy size={36} />
          <span className="text-xs tracking-widest text-white/60">
            EVENT GALLERY
          </span>
        </div>
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
        <h3 className="text-2xl font-semibold text-white">
          {title}
        </h3>

        {/* Divider */}
        <div className="w-12 h-[2px] bg-pink-500" />

        {/* Description */}
        <p className="text-white/60 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
}
