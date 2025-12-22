import EventCard from "@/components/EventCard";
import { eventsData } from "@/lib/customobjects";
const Events = () => {
  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center pb-18">
        {/* Wrapper */}
        <div className="relative inline-block">
          <h1 className="text-7xl font-teko text-white pt-30 text-center">
            Events & <span className="text-themecolor">Hackathons</span>
          </h1>

          {/* Underline */}
          <div className="h-1 w-full bg-gradient-to-r from-themecolor via-purple-500 to-themecolor rounded-full mt-2" />
        </div>
      </div>
      {eventsData.map((event) => (
            <EventCard
            key={event.id}
            date={event.date}
            category={event.category}
            title={event.title}
            description={event.description}
        />
      ))}


    </section>
  );
};

export default Events;
