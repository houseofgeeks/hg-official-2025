import AboutCard from "@/components/AboutCard"
import { HiOutlineUserGroup,HiOutlineLightBulb,HiOutlineCodeBracket } from "react-icons/hi2";
const AboutUs = () => {
  return (
    <section className='text-white flex items-center justify-center pt-40 flex-col gap-5'>
        <div className='flex flex-col items-center '>
            <h1 className='text-center text-7xl font-teko font-bold'>ABOUT</h1>
            <h2 className='text-center font-semibold font-teko text-5xl text-themecolor'>HOUSE OF GEEKS</h2>
        </div>
        
        <div className='max-w-2xl'>
            <p className='text-center text-2xl font-montserrat'>
                <span className='text-themecolor font-semibold'>House of Geeks</span> is the official technical society of <span className='font-semibold'>IIIT Ranchi</span>, dedicated to fostering a culture of innovation, collaboration, and technical excellence. We bring together passionate minds to explore emerging technologies, build impactful projects, and grow as future engineers and leaders.</p> 
        </div>


        <div className="flex flex-col gap-5">
          <div className="flex">
            <AboutCard icon={HiOutlineUserGroup} text="Community of developers, designers, and problem solvers" />
            <AboutCard icon={HiOutlineLightBulb} text="Focus on learning, building, and real-world impact" />
          </div>
          <AboutCard icon={HiOutlineCodeBracket} text="Workshops, hackathons, tech talks, and collaborative projects" classname="justify-center" />
            
        </div>

    </section>
  )
}

export default AboutUs