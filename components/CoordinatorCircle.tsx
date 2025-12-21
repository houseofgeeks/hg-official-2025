import React from 'react';
import { Lead } from '../lib/customobjects';

interface CoordinatorCircleProps {
  member: Lead;
}

const CoordinatorCircle: React.FC<CoordinatorCircleProps> = ({ member }) => {
  return (
    <div className="flex flex-col items-center justify-center group cursor-pointer w-full">
      {/* Circular Photo */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(240,66,124,0.4)]">
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover rounded-full" 
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl text-zinc-500 font-bold">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      
      {/* Name */}
      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white text-center px-1 leading-tight group-hover:text-themecolor transition-colors duration-300">
        {member.name}
      </h3>
    </div>
  );
};

export default CoordinatorCircle;

