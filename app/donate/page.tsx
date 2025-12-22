'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';
import ParticlesContainer from '@/components/ParticlesContainer';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const DonatePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const presetAmounts = [500, 1000, 2500, 5000];

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setMessage('Failed to load payment gateway');
      setMessageType('error');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!user) {
    return (
      <>
        <ParticlesContainer />
        <main className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="bg-black/40 backdrop-blur-md border border-themecolor/30 rounded-2xl p-8 shadow-2xl text-center">
              <h1 className="text-4xl font-teko font-bold text-white mb-4">DONATE</h1>
              <p className="text-gray-300 mb-6 font-montserrat">Please login to continue with donation</p>
              <div className="flex flex-col gap-3">
                <Link href="/auth/login">
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-themecolor to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 font-montserrat">
                    Login
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="w-full py-3 px-6 border-2 border-themecolor text-themecolor font-bold rounded-lg hover:bg-themecolor/10 transition-all duration-300 font-montserrat">
                    Create Account
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </>
    );
  }

  const handleDonate = async (amount: number) => {
    if (!user?.email) {
      setMessage('User email not found');
      setMessageType('error');
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      setMessage('Payment gateway not loaded. Please refresh the page.');
      setMessageType('error');
      return;
    }

    if (amount < 1) {
      setMessage('Please enter a valid amount');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          email: user.email,
          name: user.name || 'Donor',
          photoURL,
        }),
      });

      const data = await response.json();

      if (!data.orderId) {
        setMessage('Failed to create order');
        setMessageType('error');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Hackgrounds',
        description: 'Support Hackgrounds Initiative',
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/donations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: user.email,
                amount,
                photoURL,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              // Update Firestore on client side
              if (user.uid) {
                const userRef = doc(firestore, 'users', user.uid);
                await updateDoc(userRef, {
                  donatedAmount: increment(amount),
                  photoURL: photoURL || user.photoURL,
                  lastDonationDate: serverTimestamp(),
                });

                // Add donation record
                await addDoc(collection(firestore, 'donations'), {
                  userId: user.uid,
                  email: user.email,
                  name: user.name || 'Anonymous',
                  amount,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  photoURL,
                  createdAt: serverTimestamp(),
                  status: 'completed',
                });
              }

              setMessage('Donation successful! Thank you for your support!');
              setMessageType('success');
              setTimeout(() => router.push('/leaderboard'), 2000);
            } else {
              setMessage('Payment verification failed');
              setMessageType('error');
            }
          } catch (error) {
            setMessage('Error verifying payment');
            setMessageType('error');
          }
          setLoading(false);
        },
        prefill: {
          email: user.email,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setMessage('Error initiating donation');
      setMessageType('error');
      setLoading(false);
    }
  };

  return (
    <>
      <ParticlesContainer />
      <main className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-black/40 backdrop-blur-md border border-themecolor/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-teko font-bold text-white mb-2">SUPPORT US</h1>
              <p className="text-gray-300 font-montserrat">Your contribution helps us grow</p>
              <div className="h-1 w-20 bg-gradient-to-r from-themecolor to-purple-600 mx-auto rounded-full mt-4"></div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg mb-6 text-sm font-montserrat ${
                  messageType === 'success'
                    ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border border-red-500/50 text-red-400'
                }`}
              >
                {message}
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="text-center">
                <label className="block text-gray-300 font-montserrat font-semibold mb-3">
                  Profile Photo (Optional)
                </label>
                {photoURL && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={photoURL}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-2 border-themecolor object-cover"
                    />
                  </div>
                )}
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                  onSuccess={(result: any) => {
                    setPhotoURL(result.info.secure_url);
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full py-2 px-4 border-2 border-themecolor text-themecolor font-semibold rounded-lg hover:bg-themecolor/10 transition-all duration-300 font-montserrat"
                    >
                      {photoURL ? 'Change Photo' : 'Upload Photo'}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              {/* Preset Amounts */}
              <div>
                <label className="block text-gray-300 font-montserrat font-semibold mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-4 rounded-lg font-bold transition-all duration-300 font-montserrat ${
                        selectedAmount === amount && customAmount === ''
                          ? 'bg-gradient-to-r from-themecolor to-purple-600 text-white'
                          : 'bg-white/10 text-white border border-themecolor/30 hover:border-themecolor/60'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-gray-300 font-montserrat font-semibold mb-3">
                  Or Enter Custom Amount
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (e.target.value) {
                      setSelectedAmount(0);
                    }
                  }}
                  placeholder="Enter amount in ₹"
                  className="w-full px-4 py-3 bg-white/10 border border-themecolor/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-themecolor transition-all font-montserrat"
                />
              </div>

              {/* Donate Button */}
              <button
                onClick={() => handleDonate(customAmount ? parseInt(customAmount) : selectedAmount)}
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-themecolor to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
              >
                {loading ? 'Processing...' : `Donate ₹${customAmount || selectedAmount}`}
              </button>

              {/* Info */}
              <p className="text-center text-gray-400 text-sm font-montserrat">
                Your donation is secure and encrypted. You'll appear on our leaderboard! 🎉
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Load Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </>
  );
};

export default DonatePage;
