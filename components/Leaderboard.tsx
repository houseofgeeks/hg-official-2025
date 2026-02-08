'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { firestore } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import DonatePage from './Donate';

interface Donor {
  id: string;
  name: string;
  photoURL?: string;
  featured?: boolean;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDonors();
    }
  }, [isOpen]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      // Fetch top donors from Firestore
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

  const requestFeatured = async (donorId: string) => {
    if (!user) {
      setMessage('Please login to request featured');
      return;
    }

    try {
      setRequesting(true);
      // Create a featured request in Firestore
      // This would typically send an approval request to admins
      const response = await fetch('/api/donations/feature-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: donorId }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Featured request submitted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to submit request');
      }
    } catch (error) {
      setMessage('Error submitting request');
      console.error(error);
    } finally {
      setRequesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '-100vh' }}
        animate={{ y: 0 }}
        exit={{ y: '-100vh' }}
        className="bg-linear-to-br from-[#1a1a1a] to-[#0c0c0c] text-white rounded-lg shadow-xl w-full max-w-2xl border border-themecolor/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold font-teko">Top Contributors</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-themecolor"></div>
              </div>
            ) : donors.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No contributors yet. Be the first to support us!</p>
            ) : (
              donors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-linear-to-r from-[#1a1a1a] to-[#0c0c0c] rounded-lg border border-themecolor/10 hover:border-themecolor/30 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-2xl font-bold text-themecolor min-w-8">
                      {index + 1}
                    </span>
                    {donor.photoURL && (
                      <img
                        src={donor.photoURL}
                        alt={donor.name}
                        className="w-12 h-12 rounded-full border border-themecolor/30"
                      />
                    )}
                    <div className="flex-1">
                       <h3 className="text-lg font-semibold">{donor.name}</h3>
                    </div>
                    {donor.featured && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-themecolor/20 rounded-full border border-themecolor/50">
                        <span className="text-themecolor text-sm font-semibold">⭐ Featured</span>
                      </div>
                    )}
                  </div>
                  {user?.uid === donor.id && !donor.featured && (
                    <button
                      onClick={() => requestFeatured(donor.id)}
                      disabled={requesting}
                      className="ml-2 px-4 py-2 bg-themecolor hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-all whitespace-nowrap"
                    >
                      {requesting ? 'Requesting...' : 'Get Featured'}
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </div>

          <div className="border-t border-themecolor/10 pt-6">
            <p className="text-center text-gray-300 mb-4 font-montserrat">Want to get featured in our contributions?</p>
            <button
              onClick={() => setIsDonateOpen(true)}
              className="w-full py-3 px-6 bg-linear-to-r from-themecolor to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all font-montserrat"
            >
              Donate Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
    <DonatePage isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </>
  );
};

export default Leaderboard;