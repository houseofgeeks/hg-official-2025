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
          {/* Render coordinators in rows of up to 5. If the last row has 1 or 2 items and there are more than 5 total, center them. */}
          {(() => {
            const cols = 4;
            const rows: Lead[][] = [];
            for (let i = 0; i < cordinators.length; i += cols) {
              rows.push(cordinators.slice(i, i + cols));
            }

            return (
              <div>
                {rows.map((row, rowIndex) => {
                  const isLast = rowIndex === rows.length - 1;
                  const shouldCenterLast = isLast && cordinators.length > cols && row.length <= 2;

                  // Increase vertical spacing for row 1 and row 2
                  const extraBottom = rowIndex === 0 ? 'mb-10' : rowIndex === 1 ? 'mb-8' : '';

                  if (shouldCenterLast) {
                    return (
                      <div key={rowIndex} className={`flex justify-center gap-8 mt-6 ${extraBottom}`}>
                        {row.map((coord, idx) => (
                          <div key={idx} className="px-3">
                            <CoordinatorCircle member={coord} className="w-auto" />
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <div key={rowIndex} className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-4 ${extraBottom}`}>
                      {row.map((coord, idx) => (
                        <CoordinatorCircle key={idx} member={coord} />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      ) : null}
    </div>
  );
};

export default DomainTeam;