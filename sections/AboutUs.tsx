import AboutCard from "@/components/AboutCard"
import { HiOutlineUserGroup,HiOutlineLightBulb,HiOutlineCodeBracket } from "react-icons/hi2";
const AboutUs = () => {
  return (
    <section id="about" className='text-white flex items-center justify-center pt-20 pb-20 flex-col mt-5 gap-12 px-4 md:px-8'>
        {/* Header Section with Enhanced Styling */}
        <div className='flex flex-col items-center max-w-3xl animate-fadeIn'>
            <div className='relative'>
                <h1 className='relative text-center text-6xl md:text-7xl font-teko font-bold text-white drop-shadow-lg'>ABOUT</h1>
            </div>
            <h2 className='text-center font-semibold font-teko text-4xl md:text-6xl text-themecolor drop-shadow-lg'>HOUSE OF GEEKS</h2>
            <div className='h-1 w-24 bg-linear-to-r from-themecolor via-purple-500 to-themecolor rounded-full'></div>
        </div>
        
        {/* Description Section */}
        <div className='max-w-3xl mb-8'>
            <p className='text-center text-lg md:text-xl font-montserrat leading-relaxed text-gray-200'>
                <span className='text-themecolor font-bold text-2xl'>House of Geeks</span> is the official technical society of <span className='font-semibold text-themecolor'>IIIT Ranchi</span>, dedicated to fostering a culture of innovation, collaboration, and technical excellence. We bring together passionate minds to explore emerging technologies, build impactful projects, and grow as future engineers and leaders.
            </p> 
        </div>

        {/* Features Cards with Enhanced Grid */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className='transform hover:scale-105 transition-transform duration-300 interactive-element'>
              <AboutCard icon={<HiOutlineUserGroup size={50} className="text-themecolor drop-shadow-lg"/>} text="Community of developers, designers, and problem solvers" />
            </div>
            <div className='transform hover:scale-105 transition-transform duration-300 interactive-element'>
              <AboutCard icon={<HiOutlineLightBulb size={50} className="text-themecolor drop-shadow-lg"/>} text="Focus on learning, building, and real-world impact" />
            </div>
          </div>
          <div className='transform hover:scale-105 transition-transform duration-300 interactive-element'>
            <AboutCard icon={<HiOutlineCodeBracket size={50} className="text-themecolor drop-shadow-lg"/>} text="Workshops, hackathons, tech talks, and collaborative projects" classname="justify-center" />
          </div>
        </div>

    </section>
  )
}

export default AboutUs