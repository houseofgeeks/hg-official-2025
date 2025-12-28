import DomainCard from "@/components/DomainCard"
import ShinyText from "@/components/ShinyText"
import { domains } from "@/lib/customobjects"

type DomainProp={
  useModal:boolean;
}

const Domains = ({useModal}:DomainProp) => {
  return (
    <section>
        <div className="flex justify-center items-center flex-col pb-20">
          <div className="relative inline-block">
            <h1 className="text-7xl font-teko text-white pt-30 text-center">
            Our Technical <span className="text-themecolor">Domains</span>
            </h1>

            {/* Underline */}
            <div className="h-1 w-full bg-linear-to-r from-themecolor via-purple-500 to-themecolor rounded-full " />
          </div>

            <ShinyText
              text="Seven specialized wings driving innovation and technical excellence"
              className="text-2xl font-montserrat text-center mt-4"
            />
        </div>


        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain,index) => (
                <DomainCard
                  key={index}
                  url={domain.url}
                  title={domain.title}
                  description={domain.description}
                  id={domain.id}
                  icon={<domain.icon size={50} className="text-themecolor font-bold border border-themecolor rounded-md p-2" />}
                  leads={domain.leads}
                  cords={domain.cordinators}
                  useModal={useModal}
                />
            ))}
        </div>
    </section>
  )
}

export default Domains