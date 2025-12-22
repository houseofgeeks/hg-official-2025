'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ParticlesContainer from '@/components/ParticlesContainer';
import Image from 'next/image';
import Link from 'next/link';
import { firestore } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface Donor {
  id: string;
  name: string;
  donatedAmount: number;
  photoURL?: string;
  featured?: boolean;
}

const LeaderboardPage: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const donorsQuery = query(
          collection(firestore, 'users'),
          orderBy('donatedAmount', 'desc'),
          limit(20)
        );

        const querySnapshot = await getDocs(donorsQuery);
        const donorsList: Donor[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.donatedAmount > 0) {
            donorsList.push({
              id: doc.id,
              name: data.name || 'Anonymous',
              donatedAmount: data.donatedAmount || 0,
              photoURL: data.photoURL,
              featured: data.featured || false,
            });
          }
        });

        setDonors(donorsList);
      } catch (error) {
        console.error('Error fetching donors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const sortedDonors = donors;
  const topThree = sortedDonors.slice(0, 3);
  const rest = sortedDonors.slice(3);

  return (
    <>
      <ParticlesContainer />
      <main className="px-8 py-8 w-full min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto mt-12">
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
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-themecolor"></div>
              </div>
            ) : donors.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-300 text-xl font-montserrat">No donors yet. Be the first to support us!</p>
              </div>
            ) : (
              <>
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
                          {donor.photoURL ? (
                            <img
                              src={donor.photoURL}
                              alt={donor.name}
                              width={200}
                              height={200}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-themecolor to-purple-600 rounded-full text-white text-4xl font-bold">
                              {donor.name.charAt(0).toUpperCase()}
                            </div>
                          )}
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
                            ₹{donor.donatedAmount.toLocaleString()}
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
                        {donor.photoURL ? (
                          <Image
                            src={donor.photoURL}
                            alt={donor.name}
                            width={60}
                            height={60}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-themecolor to-purple-600 rounded-full text-white text-2xl font-bold">
                            {donor.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-6 flex-grow">
                        <h3 className="text-2xl font-montserrat font-bold">
                          {donor.name}
                        </h3>
                      </div>
                      <div className="text-3xl font-montserrat font-semibold text-themecolor">
                        ₹{donor.donatedAmount.toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="max-w-2xl mx-auto mt-16 p-8 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] border border-themecolor/20"
          >
            <p className="text-center text-gray-300 text-lg mb-6 font-montserrat">
              Want to get featured on the leaderboard?
            </p>
            <Link href="/donate">
              <button className="w-full py-4 px-8 bg-gradient-to-r from-themecolor to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 font-montserrat">
                Donate Now
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default LeaderboardPage;
