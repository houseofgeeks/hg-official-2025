'use client'
import React from 'react';
import Link from 'next/link'
import { Lead } from '@/lib/customobjects'
import Image from 'next/image'

type DomainCardProps = {
    icon : React.ReactNode;
    id:number;
    title : string;
    url:string;
    description : string;
    slug?: string;
    leads?:Lead[]
    cords?:Lead[]
    useModal:boolean;
    
}

const DomainCard = ({icon, title, description, url, useModal, leads = [], cords = []} : DomainCardProps) => {
  // Combine leads and coordinators, limit to show max 6 avatars
  const allMembers = [...leads, ...cords];
  const displayMembers = allMembers.slice(0, 6);
  const remainingCount = allMembers.length - 6;

  const CardContent = () => (
    <div className='interactive-element domain-card flex flex-col items-start text-white hover:border-themecolor rounded-2xl p-10 gap-5 group hover:scale-103 transition-all duration-300 hover:border border-transparent hover:bg-gray-900 h-full'>
      {icon}
      <h1 className='text-2xl font-montserrat group-hover:text-themecolor'>{title}</h1>
      <p>{description}</p>
      
      {/* Team Members Avatars */}
      {displayMembers.length > 0 && (
        <div className="flex items-center mt-auto pt-4">
          <div className="flex -space-x-3">
            {displayMembers.map((member, index) => (
              <div
                key={index}
                className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-gray-800 hover:scale-110 hover:z-10 transition-transform duration-200"
                title={member.name}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-themecolor">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="relative w-8 h-8 rounded-full border-2 border-background bg-themecolor/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-themecolor">+{remainingCount}</span>
              </div>
            )}
          </div>
          <span className="ml-3 text-xs text-gray-400 font-montserrat">
            {allMembers.length} member{allMembers.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
  
  return useModal ? (
    <Link href={`/community/${url}`} className='block w-full h-full'>
      <CardContent />
    </Link>
  ) : (
    <a href={`/community/${url}`} className='block w-full h-full'>
      <CardContent />
    </a>
  );
}

export default DomainCard