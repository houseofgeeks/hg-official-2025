import React from 'react';
import { Lead } from '../lib/customobjects';
import TeamMemberCard from './TeamMemberCard';
import CoordinatorCircle from './CoordinatorCircle';

interface DomainTeamProps {
  wingName?: string;
  leads: Lead[];
  cordinators: Lead[];
}

const DomainTeam: React.FC<DomainTeamProps> = ({ wingName, leads, cordinators }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-20">
      {/* Wing Name */}
      {wingName && (
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-wider">
            {wingName}
          </h1>
        </div>
      )}

      {/* Leads Section */}
      {leads && leads.length > 0 ? (
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-teko font-bold text-themecolor uppercase tracking-wide inline-block relative pb-3">
              Leads
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-themecolor"></span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 w-full">
            {leads.map((lead, index) => (
              <TeamMemberCard 
                key={index} 
                member={lead} 
                position="Domain Lead"
                size="large"
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Coordinators Section */}
      {cordinators && cordinators.length > 0 ? (
        <div>
          <div className="text-center mt-12 mb-12">
            <h2 className="text-4xl md:text-5xl font-teko font-bold text-themecolor uppercase tracking-wide inline-block relative pb-3">
              Coordinators
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-themecolor"></span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cordinators.map((coord, index) => (
              <CoordinatorCircle key={index} member={coord} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DomainTeam;