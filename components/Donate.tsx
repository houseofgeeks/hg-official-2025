'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Login from './Login';
import Signup from './Signup';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

interface DonatePageProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = 'login' | 'signup' | 'donate';

const DonatePage: React.FC<DonatePageProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, loading, logout } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const presetAmounts = [100, 500, 1000, 2500, 5000];

  useEffect(() => {
    if (user && userProfile) {
      setAuthView('donate');
    } else if (!user && !loading) {
      setAuthView('login');
    }
  }, [user, userProfile, loading]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const donationAmount = selectedPreset || parseFloat(amount);

    if (!donationAmount || donationAmount < 1) {
      setError('Please enter a valid amount (minimum ₹1)');
      return;
    }

    if (!userProfile) {
      setError('User profile not found');
      return;
    }

    try {
      setDonating(true);

      // Create order
      const orderResponse = await fetch('/api/donations/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createOrder',
          amount: donationAmount,
          userId: user?.uid,
          email: user?.email,
          name: userProfile.name,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        setError(orderData.message || 'Failed to create order');
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load payment gateway');
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'House of Geeks',
        description: 'Support House of Geeks',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/donations/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verifyPayment',
                orderId: orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId: user?.uid,
                amount: donationAmount,
                email: user?.email,
                name: userProfile.name,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setSuccess(true);
              setMessage(`Thank you for donating ₹${donationAmount}! Your contribution helps us make a difference.`);
              setAmount('');
              setSelectedPreset(null);
              setTimeout(() => {
                onClose();
              }, 3000);
            } else {
              setError(verifyData.message || 'Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification error');
            console.error(err);
          }
        },
        prefill: {
          email: user?.email,
          contact: '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      setError(err.message || 'Donation failed');
      console.error(err);
    } finally {
      setDonating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] rounded-lg shadow-2xl w-full max-w-lg border border-indigo-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-indigo-500/10">
            <div>
              <h2 className="text-3xl font-bold text-white font-teko">Support Us</h2>
              <p className="text-gray-400 text-sm">Help House of Geeks grow</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

          {/* Body */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : !user ? (
                <div>
                  <AnimatePresence mode="wait">
                    {authView === 'login' ? (
                      <Login
                        key="login"
                        onSuccess={() => setAuthView('donate')}
                        onSwitchToSignup={() => setAuthView('signup')}
                      />
                    ) : (
                      <Signup
                        key="signup"
                        onSuccess={() => setAuthView('donate')}
                        onSwitchToLogin={() => setAuthView('login')}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <form onSubmit={handleDonate} className="space-y-6">
                  {/* User Info */}
                  <div className="bg-[#0c0c0c] rounded-lg p-4 border border-indigo-500/10">
                    <p className="text-gray-400 text-sm">Donation by</p>
                    <p className="text-white font-semibold">{userProfile?.name}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>

                  {/* Preset Amounts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Quick Amount Selection
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setSelectedPreset(preset);
                            setAmount('');
                          }}
                          className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                            selectedPreset === preset
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                              : 'bg-[#0c0c0c] border border-indigo-500/30 text-gray-300 hover:border-indigo-500'
                          }`}
                        >
                          ₹{preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setSelectedPreset(null);
                      }}
                      className="w-full px-4 py-2 bg-[#0c0c0c] border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Enter amount"
                      min="1"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Success */}
                  {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg text-sm">
                      {message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={donating || success}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                  >
                    {donating ? 'Processing...' : `Donate ₹${selectedPreset || amount || '0'}`}
                  </button>

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await logout();
                        onClose();
                      } catch (err) {
                        console.error('Logout error:', err);
                      }
                    }}
                    className="w-full py-2 text-gray-400 hover:text-gray-300 transition-all text-sm"
                  >
                    Logout
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DonatePage;
