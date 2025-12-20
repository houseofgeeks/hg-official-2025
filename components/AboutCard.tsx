'use client'
import { HiOutlineUserGroup } from "react-icons/hi2";
const AboutCard = () => {
  return (
    <div className="text-white  hover:shadow-sm hover:shadow-themecolor transition-all duration-150 bg-gray-900 rounded-2xl flex items-center">
        <HiOutlineUserGroup size={40} className="text-themecolor mb-4 border rounded-xl hover:border-themecolor"/>
        
        <p className="text-lg font-montserrat text-center">
            Community of developers, designers, and problem solvers
        </p>
    </div>
  )
}

export default AboutCard