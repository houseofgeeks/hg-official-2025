import { heads } from "@/lib/customobjects"
import Image from "next/image"

const CommunityLead = () => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-16 w-full py-12">
      {heads.map((head, index) => (
        <div key={index} className="flex flex-col items-center group">
            {/* Image Circle */}
            <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-themecolor shadow-lg transition-transform duration-300 group-hover:scale-105 interactive-element">
                <Image 
                    src={head.image} 
                    alt={head.name} 
                    fill
                    className="object-cover"
                />
            </div>
            
            {/* Name and Position */}
            <div className="text-center mt-6">
                <h3 className="text-4xl font-teko font-bold text-white uppercase tracking-wide group-hover:text-themecolor transition-colors">{head.name}</h3>
                <p className="text-xl font-montserrat text-gray-300 font-medium uppercase tracking-widest">{head.position}</p>
            </div>
        </div>
      ))}
    </div>
  )
}

export default CommunityLead
