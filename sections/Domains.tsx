import DomainCard from "@/components/DomainCard"
import ShinyText from "@/components/ShinyText"
import { domains } from "@/lib/customobjects"



const Domains = () => {
  return (
    <section>
        <div className="flex justify-center items-center flex-col pb-20">
            <h1 className="text-7xl font-teko text-white pt-30 text-center underline">Our Technical <span className="text-themecolor underline">Domains</span></h1>
            <ShinyText text="Seven specialized wings driving innovation and technical excellence" className='text-2xl font-montserrat text-center'></ShinyText>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain,index) => (
                <DomainCard key={index} title={domain.title} description={domain.description}  icon={domain.icon} />
            ))}
        </div>
    </section>
  )
}

export default Domains