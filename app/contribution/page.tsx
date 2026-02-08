'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ParticlesContainer from '@/components/ParticlesContainer';
import Image from 'next/image';
import Link from 'next/link';
import { firestore } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';

interface Donor {
  id: string;
  name: string;
  donatedAmount: number;
  photoURL?: string;
  featured?: boolean;
  lastDonationDate?: any;
}

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHasDonated, setUserHasDonated] = useState(false);

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

        // Fetch recent donors (last 5) ordered by lastDonationDate
        try {
          const recentQuery = query(
            collection(firestore, 'users'),
            orderBy('lastDonationDate', 'desc'),
            limit(5)
          );

          const recentSnapshot = await getDocs(recentQuery);
          const recentList: Donor[] = [];

          recentSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.donatedAmount > 0 && data.lastDonationDate) {
              recentList.push({
                id: doc.id,
                name: data.name || 'Anonymous',
                donatedAmount: data.donatedAmount || 0,
                photoURL: data.photoURL,
                lastDonationDate: data.lastDonationDate,
              });
            }
          });

          setRecentDonors(recentList);
        } catch (e) {
          console.error('Error fetching recent donors:', e);
        }
      } catch (error) {
        console.error('Error fetching donors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Check if current user has donated
  useEffect(() => {
    const checkUserDonation = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserHasDonated(userData.donatedAmount > 0);
          }
        } catch (error) {
          console.error('Error checking user donation:', error);
        }
      }
    };
    checkUserDonation();
  }, [user?.uid]);

  const formatDate = (ts?: any) => {
    if (!ts) return '';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleString();
    } catch {
      return '';
    }
  };

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
              CONTRIBUTIONS
            </h1>
            <h2 className="text-5xl font-teko font-semibold text-themecolor underline">
              TOP CONTRIBUTORS
            </h2>
          </motion.div>
         
          {/* MOBILE: Provided code for small screens */}
          <div className="md:hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-themecolor rounded-full" />
              </div>
            ) : (
              <>
                {/* Top 3 Donors - Mobile */}
                <div className="space-y-4 mb-10">
                  {topThree.map((donor, index) => (
                    <div
                      key={donor.id}
                      className="interactive-element flex items-center gap-4 p-4 rounded-xl border-2 bg-[#121212]"
                    >
                      <div className={`text-2xl ${['text-yellow-400','text-gray-300','text-orange-400'][index]}`}>
                        {['👑','🥈','🥉'][index]}
                      </div>
                      {donor.photoURL ? (
                        <Image
                          src={donor.photoURL}
                          alt={donor.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-themecolor to-purple-600 flex items-center justify-center font-bold">
                          {donor.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {donor.name}{' '}
                          <span className="text-sm text-gray-400">
                            ({['1st','2nd','3rd'][index]})
                          </span>
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Rest of Donors - Mobile */}
                <div className="space-y-4">
                  {rest.map((donor, index) => (
                    <div
                      key={donor.id}
                      className="interactive-element flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl"
                    >
                      <span className="text-xl font-bold text-gray-400">
                        #{index + 4}
                      </span>
                      {donor.photoURL ? (
                        <Image
                          src={donor.photoURL}
                          alt={donor.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-themecolor to-purple-600 flex items-center justify-center font-bold">
                          {donor.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{donor.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* DESKTOP: Original code for md+ screens */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden md:block max-w-5xl mx-auto"
          >
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-themecolor"></div>
              </div>
            ) : donors.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-300 text-xl font-montserrat">No contributors yet. Be the first to support us!</p>
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
                            <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-themecolor to-purple-600 rounded-full text-white text-4xl font-bold">
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
                      <div className="shrink-0">
                        <span className="text-4xl font-bold text-gray-400">
                          #{index + 4}
                        </span>
                      </div>
                      <div className="shrink-0 ml-4">
                        {donor.photoURL ? (
                          <Image
                            src={donor.photoURL}
                            alt={donor.name}
                            width={60}
                            height={60}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br from-themecolor to-purple-600 rounded-full text-white text-2xl font-bold">
                            {donor.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-6 grow">
                        <h3 className="text-2xl font-montserrat font-bold">
                          {donor.name}
                        </h3>
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
            className="max-w-2xl mx-auto mt-5 p-8 rounded-xl bg-transparent "
          >
            <p className="text-center text-gray-300 text-lg mb-6 font-montserrat">
              {userHasDonated 
                ? "Thank you for your support! Want to climb higher?" 
                : "Want to get featured in our contributions?"}
            </p>
            <Link href="/donate">
              <button className="interactive-element w-full py-4 px-8 bg-themecolor hover:bg-themecolor/90 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-themecolor/30 hover:shadow-themecolor/50 font-montserrat">
                {userHasDonated ? "Contribute More" : "Contribute Now"}
              </button>
            </Link>
          </motion.div>
            {recentDonors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.45 }}
                className="max-w-2xl mx-auto mt-6 mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-teko font-semibold text-white">Recent Contributors</h3>
                  <p className="text-sm text-gray-400">Latest 5 contributors</p>
                </div>

                <div className="recent-donors-scroll space-y-4">
                  {recentDonors.map((r) => (
                      <div key={r.id} className="recent-donor-card flex items-center gap-4 p-3 bg-[#0f0f0f] rounded-lg">
                        <div className="shrink-0">
                        {r.photoURL ? (
                          <Image src={r.photoURL} alt={r.name} width={56} height={56} className="rounded-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-themecolor to-purple-600 rounded-full text-white text-xl font-bold">
                            {r.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="grow">
                        <h4 className="font-semibold text-lg">{r.name}</h4>
                        <p className="text-gray-500 text-xs mt-1">{formatDate(r.lastDonationDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          
        </div>
      </main>
    </>
  );
};

export default LeaderboardPage;