'use client'
import { IconType } from 'react-icons'
type Props = {
  icon: IconType;
  classname?: string;
  text : string
};
const AboutCard = ({classname,icon:Icon,text} : Props) => {
  return (
    <div className={`text-white  hover:shadow-md hover:shadow-themecolor transition-all duration-150 bg-gray-900 rounded-2xl flex items-center group p-4 gap-3 ${classname}`}>
        <Icon size={45} className="text-themecolor border rounded-xl group-hover:border-themecolor p-2 "/>
        
        <p className="text-lg font-montserrat text-center">
            {text}
        </p>
    </div>
  )
}

export default AboutCard