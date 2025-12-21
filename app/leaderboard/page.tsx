'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { donors } from '@/lib/customobjects';
import Navbar from '@/components/Navbar';
import ParticlesContainer from '@/components/ParticlesContainer';
import Image from 'next/image';

const LeaderboardPage: React.FC = () => {
  const sortedDonors = donors.sort((a, b) => b.amount - a.amount);
  const topThree = sortedDonors.slice(0, 3);
  const rest = sortedDonors.slice(3);

  return (
    <>
      <Navbar />
      <ParticlesContainer />
      <main className="px-8 py-8 w-full min-h-screen text-white">
        <div className="container mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-7xl font-teko font-bold text-white">
              LEADERBOARD
            </h1>
            <h2 className="text-5xl font-teko font-semibold text-themecolor underline">
              TOP DONORS
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <div className="flex justify-center items-end gap-8 mb-16">
              {topThree.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                  className={`leaderboard-card-top flex flex-col items-center ${
                    index === 0
                      ? 'order-2'
                      : index === 1
                      ? 'order-1'
                      : 'order-3'
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`interactive-element rounded-full bg-gray-800 border-4 ${
                        index === 0
                          ? 'w-48 h-48 border-yellow-400'
                          : 'w-40 h-40 border-gray-500'
                      } flex items-center justify-center text-center p-4`}
                    >
                      <Image
                        src={donor.image}
                        alt={donor.name}
                        width={200}
                        height={200}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute -top-5 left-1/2 -translate-x-1/2 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl ${
                        index === 0
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="text-center mt-4">
                      <h3
                        className={`font-bold ${
                          index === 0 ? 'text-2xl' : 'text-xl'
                        }`}
                      >
                        {donor.name}
                      </h3>
                      <p
                        className={`text-themecolor font-semibold ${
                          index === 0 ? 'text-3xl' : 'text-2xl'
                        }`}
                      >
                        ${donor.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {rest.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="interactive-element leaderboard-card flex items-center p-6 bg-[#1a1a1a] rounded-xl shadow-lg border-2 border-transparent hover:border-themecolor transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <span className="text-4xl font-bold text-gray-400">
                      #{index + 4}
                    </span>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Image
                      src={donor.image}
                      alt={donor.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-6 flex-grow">
                    <h3 className="text-2xl font-montserrat font-bold">
                      {donor.name}
                    </h3>
                  </div>
                  <div className="text-3xl font-montserrat font-semibold text-themecolor">
                    ${donor.amount.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default LeaderboardPage;
