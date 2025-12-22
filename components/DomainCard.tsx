'use client'
import { IconType } from 'react-icons'
import Link from 'next/link'
import { Lead } from '@/lib/customobjects'
type DomainCardProps = {
    icon : IconType;
    id:number;
    title : string;
    url:string;
    description : string;
    slug?: string;
    leads?:Lead[]
    cords?:Lead[]
    useModal:boolean;
    
}

const DomainCard = ({icon : Icon, title, description,url,useModal} : DomainCardProps) => {
  
  return useModal ? (
    <Link href={`/community/${url}`} className='block w-full h-full'>
      <div className='interactive-element domain-card flex flex-col items-start text-white hover:border-themecolor rounded-2xl p-10 gap-5 group hover:scale-103 transition-all duration-300 hover:border border-transparent hover:bg-gray-900 h-full'>
        <Icon size={50} className='text-themecolor font-bold border border-themecolor rounded-md p-2' />
        <h1 className='text-2xl font-montserrat group-hover:text-themecolor'>{title}</h1>
        <p>{description}</p>
      </div>
    </Link>) :
    (<a href={`/community/${url}`} className='block w-full h-full'>
      <div className='interactive-element domain-card flex flex-col items-start text-white hover:border-themecolor rounded-2xl p-10 gap-5 group hover:scale-103 transition-all duration-300 hover:border border-transparent hover:bg-gray-900 h-full'>
        <Icon size={50} className='text-themecolor font-bold border border-themecolor rounded-md p-2' />
        <h1 className='text-2xl font-montserrat group-hover:text-themecolor'>{title}</h1>
        <p>{description}</p>
      </div>
    </a>)
  }

export default DomainCard