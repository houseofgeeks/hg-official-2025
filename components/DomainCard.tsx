'use client'
import { IconType } from 'react-icons'

type DomainCardProps = {
    icon : IconType;
    title : string;
    description : string;
}

const DomainCard = ({icon : Icon, title, description} : DomainCardProps) => {
  return (
    <div className='flex flex-col items-start text-white hover:border-themecolor rounded-2xl p-10 gap-5 group hover:scale-103 transition-all duration-300 hover:border border-transparent hover:bg-gray-900'>
        <Icon size={50} className='text-themecolor font-bold border border-themecolor rounded-md p-2' />
        <h1 className='text-2xl font-montserrat group-hover:text-themecolor'>{title}</h1>
        <p>{description}</p>
    </div>
  )
}

export default DomainCard