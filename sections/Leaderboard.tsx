'use client';
import React, { useState } from 'react';
import Leaderboard from '../components/Leaderboard';
import Button from '@/components/Button';

const LeaderboardSection: React.FC = () => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const openLeaderboard = () => setIsLeaderboardOpen(true);
  const closeLeaderboard = () => setIsLeaderboardOpen(false);

  return (
    <section className="relative py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Top Donors Leaderboard</h2>
          <p className="text-lg text-gray-400 mb-8">
            Check out the top donors who have contributed to our cause.
          </p>
          <Button text="Open Leaderboard" onClick={openLeaderboard} />
        </div>
      </div>
      <Leaderboard isOpen={isLeaderboardOpen} onClose={closeLeaderboard} />
    </section>
  );
};

export default LeaderboardSection;
