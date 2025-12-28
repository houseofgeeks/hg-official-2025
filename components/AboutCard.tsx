'use client'
import React from 'react';

type Props = {
  icon: React.ReactNode;
  classname?: string;
  text : string
};
const AboutCard = ({classname,icon,text} : Props) => {
  return (
    <div className={`text-white relative overflow-hidden rounded-2xl flex items-center group p-6 gap-4 ${classname}`}>
        {/* Gradient Background */}
        <div className='absolute inset-0 bg-linear-to-br from-gray-800 via-gray-900 to-black opacity-80'></div>
        <div className='absolute inset-0 bg-linear-to-r from-themecolor/10 via-purple-500/10 to-themecolor/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        
        {/* Border Gradient */}
        <div className='absolute inset-0 rounded-2xl bg-linear-to-r from-themecolor/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-px'>
            <div className='absolute inset-0 bg-gray-900 rounded-2xl'></div>
        </div>
        
        {/* Content */}
        <div className='relative z-10 flex items-center gap-4 w-full'>
            <div className='shrink-0'>
                {icon}
            </div>
            <p className="text-base md:text-lg font-montserrat text-gray-100 group-hover:text-white transition-colors duration-300">
                {text}
            </p>
        </div>
        
        {/* Hover Shadow Effect */}
        <div className='absolute inset-0 rounded-2xl shadow-lg shadow-themecolor/20 group-hover:shadow-themecolor/50 transition-all duration-300'></div>
    </div>
  )
}

export default AboutCard