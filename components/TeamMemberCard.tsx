import React from 'react';
import { Lead } from '../lib/customobjects';

interface TeamMemberCardProps {
  member: Lead;
  position: string; // e.g., "Domain Lead" or "Coordinator"
  showDomain?: boolean;
  size?: 'small' | 'large';
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, position, showDomain = true, size = 'large' }) => {
  const isSmall = size === 'small';

  return (
    <div className={`interactive-element domain-card flex flex-col items-center text-white border-2 border-themecolor/50 hover:border-themecolor rounded-2xl ${isSmall ? 'p-4 w-52' : 'p-8 w-72'} gap-4 group hover:scale-105 transition-all duration-300 bg-transparent backdrop-blur-sm hover:bg-white/5 hover:shadow-[0_0_30px_rgba(240,66,124,0.3)] h-full`}>
      {/* Photo */}
      <div className={`${isSmall ? 'w-24 h-24' : 'w-36 h-36'} rounded-full overflow-hidden mb-2 transition-all duration-500 group-hover:scale-110`}>
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-4xl text-zinc-500 font-bold">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      
      {/* Name */}
      <h3 className={`${isSmall ? 'text-lg' : 'text-2xl'} font-bold text-white text-center leading-tight group-hover:text-themecolor transition-colors duration-300`}>
        {member.name}
      </h3>
      
      {/* Position */}
      <div className="text-center">
        <span className={`text-themecolor ${isSmall ? 'text-xs' : 'text-sm'} uppercase tracking-widest font-semibold`}>
          {position}
        </span>
        {showDomain && member.domain && (
          <>
            <span className="text-white text-sm uppercase tracking-wider mx-1">•</span>
            <span className="text-themecolor text-sm uppercase tracking-wider">
              {member.domain}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
