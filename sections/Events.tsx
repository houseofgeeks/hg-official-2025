import EventCard from "@/components/EventCard";
import ShinyText from "@/components/ShinyText";
import { eventsData } from "@/lib/customobjects";
const Events = () => {
  return (
    <section className="flex flex-col items-center pb-20">
      <div className="flex flex-col items-center pb-18 gap-2">
        {/* Wrapper */}
        <div className="relative inline-block">
          <h1 className="text-7xl font-teko text-white pt-30 text-center">
            Events & <span className="text-themecolor">Hackathons</span>
          </h1>

          {/* Underline */}
            <div className="h-1 w-full bg-linear-to-r from-themecolor via-purple-500 to-themecolor rounded-full mt-2" />
        </div>
        <ShinyText
          text="Flagship technical events organized by House of Geeks"
          className="text-2xl font-montserrat text-center mt-4"
        />
      </div>
      <div className="w-full max-w-6xl space-y-6 px-4">
        {eventsData.map((event) => (
          <EventCard
            key={event.id}
            date={event.date}
            category={event.category}
            title={event.title}
            description={event.description}
            eventurl={event.eventurl}
          />
        ))}
      </div>


    </section>
  );
};

export default Events;
