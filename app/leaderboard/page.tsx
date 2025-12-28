'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ParticlesContainer from '@/components/ParticlesContainer';
import Image from 'next/image';
import Link from 'next/link';
import { firestore } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';

interface Donor {
  id: string;
  name: string;
  donatedAmount: number;
  photoURL?: string;
  lastDonationDate?: any;
}

const rankMeta = [
  { icon: '👑', label: '1st', color: 'text-yellow-400' },
  { icon: '🥈', label: '2nd', color: 'text-gray-300' },
  { icon: '🥉', label: '3rd', color: 'text-orange-400' },
];

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHasDonated, setUserHasDonated] = useState(false);

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);

      const donorsQuery = query(
        collection(firestore, 'users'),
        orderBy('donatedAmount', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(donorsQuery);
      const list: Donor[] = [];

      snapshot.forEach((d) => {
        const data = d.data();
        if (data.donatedAmount > 0) {
          list.push({
            id: d.id,
            name: data.name || 'Anonymous',
            donatedAmount: data.donatedAmount,
            photoURL: data.photoURL,
          });
        }
      });

      setDonors(list);

      const recentQuery = query(
        collection(firestore, 'users'),
        orderBy('lastDonationDate', 'desc'),
        limit(5)
      );

      const recentSnap = await getDocs(recentQuery);
      const recent: Donor[] = [];

      recentSnap.forEach((d) => {
        const data = d.data();
        if (data.donatedAmount > 0 && data.lastDonationDate) {
          recent.push({
            id: d.id,
            name: data.name || 'Anonymous',
            donatedAmount: data.donatedAmount,
            photoURL: data.photoURL,
            lastDonationDate: data.lastDonationDate,
          });
        }
      });

      setRecentDonors(recent);
      setLoading(false);
    };

    fetchDonors();
  }, []);

  useEffect(() => {
    const checkDonation = async () => {
      if (!user?.uid) return;
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        setUserHasDonated(userDoc.data().donatedAmount > 0);
      }
    };
    checkDonation();
  }, [user?.uid]);

  const formatDate = (ts?: any) => {
    try {
      return ts?.toDate().toLocaleString();
    } catch {
      return '';
    }
  };

  const topThree = donors.slice(0, 3);
  const rest = donors.slice(3);

  return (
    <>
      <ParticlesContainer />
      <main className="px-4 md:px-8 py-8 min-h-screen text-white">
        <Navbar />

        <div className="container mx-auto mt-12">
          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl font-teko font-bold">
              LEADERBOARD
            </h1>
            <h2 className="text-3xl md:text-5xl font-teko text-themecolor underline">
              TOP DONORS
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-themecolor rounded-full" />
            </div>
          ) : (
            <>
              {/* ================= MOBILE TOP 3 ================= */}
              <div className="md:hidden space-y-4 mb-10">
                {topThree.map((donor, index) => (
                  <div
                    key={donor.id}
                    className="interactive-element flex items-center gap-4 p-4 rounded-xl border-2 bg-[#121212]"
                  >
                    <div className={`text-2xl ${rankMeta[index].color}`}>
                      {rankMeta[index].icon}
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
                          ({rankMeta[index].label})
                        </span>
                      </h3>
                      <p className="text-themecolor font-bold">
                        ₹{donor.donatedAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ================= DESKTOP PODIUM ================= */}
              <div className="hidden md:flex justify-center items-end gap-8 mb-16">
                {topThree.map((donor, index) => (
                  <div
                    key={donor.id}
                    className={`interactive-element flex flex-col items-center ${
                      index === 0
                        ? 'order-2'
                        : index === 1
                        ? 'order-1'
                        : 'order-3'
                    }`}
                  >
                    <div className="mb-2 text-3xl">
                      {rankMeta[index].icon}{' '}
                      <span className={`text-sm ${rankMeta[index].color}`}>
                        {rankMeta[index].label}
                      </span>
                    </div>

                    <div
                      className={`rounded-full border-4 flex items-center justify-center ${
                        index === 0
                          ? 'w-48 h-48 border-yellow-400'
                          : 'w-40 h-40 border-gray-500'
                      }`}
                    >
                      {donor.photoURL ? (
                        <img
                          src={donor.photoURL}
                          className="rounded-full w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-linear-to-br from-themecolor to-purple-600 flex items-center justify-center text-4xl font-bold">
                          {donor.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-bold">{donor.name}</h3>
                    <p className="text-themecolor text-2xl font-semibold">
                      ₹{donor.donatedAmount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* ================= REST ================= */}
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

                    <div className="font-bold text-themecolor">
                      ₹{donor.donatedAmount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* ================= CTA ================= */}
              <div className="max-w-md mx-auto mt-10 text-center">
                <p className="text-gray-300 mb-4">
                  {userHasDonated
                    ? 'Want to climb higher on the leaderboard?'
                    : 'Want to get featured on the leaderboard?'}
                </p>
                <Link href="/donate">
                  <button className="cursor-pointer active:scale-95 w-full py-3 bg-themecolor rounded-xl font-bold transition interactive-element ">
                    {userHasDonated ? 'Donate More' : 'Donate Now'}
                  </button>
                </Link>
              </div>

              {/* ================= RECENT DONORS ================= */}
              {recentDonors.length > 0 && (
                <div className="mt-14">
                  <h3 className="text-2xl font-teko mb-4">Recent Donors</h3>

                  <div className="flex gap-4 overflow-x-auto flex-nowrap pb-2">
                    {recentDonors.map((r) => (
                      <div
                        key={r.id}
                        className="interactive-element min-w-[260px] flex gap-3 items-center bg-[#0f0f0f] p-4 rounded-lg"
                      >
                        {r.photoURL ? (
                          <Image
                            src={r.photoURL}
                            alt={r.name}
                            width={44}
                            height={44}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-linear-to-br from-themecolor to-purple-600 flex items-center justify-center font-bold">
                            {r.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-sm text-gray-400">
                            ₹{r.donatedAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(r.lastDonationDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default LeaderboardPage;
