'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';
import ParticlesContainer from '@/components/ParticlesContainer';
import Navbar from '@/components/Navbar';
import { doc, setDoc, increment, collection, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firestore, auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

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
  const [photoURL, setPhotoURL] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const presetAmounts = [500, 1000, 2500, 5000];

  // Fetch user's photo from Firestore
  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.photoURL) {
              setPhotoURL(userData.photoURL);
            }
          }
        } catch (error) {
          console.error('Error fetching user photo:', error);
        }
      }
    };
    fetchUserPhoto();
  }, [user?.uid]);

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
        <Navbar />
        <ParticlesContainer />
        <main className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="border border-white/20 rounded-2xl p-8 text-center">
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

    if (amount < 500) {
      setMessage('Minimum donation amount is ₹500');
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
          name: user.displayName || 'Donor',
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
            console.log('Verify response:', verifyData);
            if (verifyData.success) {
              // Update Firestore on client side
              if (user.uid) {
                const userRef = doc(firestore, 'users', user.uid);
                
                // Check if user document exists
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                  // Update existing document
                  await setDoc(userRef, {
                    donatedAmount: increment(amount),
                    photoURL: photoURL || user.photoURL,
                    lastDonationDate: serverTimestamp(),
                  }, { merge: true });
                } else {
                  // Create new document
                  await setDoc(userRef, {
                    name: user.displayName || 'Anonymous',
                    email: user.email,
                    donatedAmount: amount,
                    photoURL: photoURL || user.photoURL,
                    lastDonationDate: serverTimestamp(),
                    createdAt: serverTimestamp(),
                  });
                }

                // Add donation record
                await addDoc(collection(firestore, 'donations'), {
                  userId: user.uid,
                  email: user.email,
                  name: user.displayName || 'Anonymous',
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
              console.error('Payment verification failed:', verifyData);
              setMessage(verifyData.message || 'Payment verification failed');
              setMessageType('error');
            }
          } catch (error) {
            console.error('Error in payment handler:', error);
            setMessage('Error verifying payment');
            setMessageType('error');
          }
          setLoading(false);
        },
        prefill: {
          email: user.email,
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage('Payment cancelled');
            setMessageType('error');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setLoading(false);
        setMessage('Payment failed. Please try again.');
        setMessageType('error');
      });
      rzp.open();
    } catch (error) {
      setMessage('Error initiating donation');
      setMessageType('error');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ParticlesContainer />
      <main className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="border border-white/20 rounded-2xl p-10 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-teko font-bold text-white mb-3">SUPPORT US</h1>
              <p className="text-gray-300 font-montserrat">Your contribution helps us grow</p>
              <div className="h-1 w-24 bg-gradient-to-r from-themecolor to-purple-600 mx-auto rounded-full mt-5"></div>
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

            <div className="space-y-8">
              {/* Profile Photo Upload */}
              <div className="text-center">
                <label className="block text-gray-300 font-montserrat font-semibold mb-4">
                  Profile Photo (Optional)
                </label>
                {photoURL && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={photoURL}
                      alt="Profile"
                      className="w-40 h-40 rounded-full border-2 border-themecolor object-cover"
                    />
                  </div>
                )}
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                  onSuccess={async (result: any) => {
                    const newPhotoURL = result.info.secure_url;
                    setPhotoURL(newPhotoURL);
                    // Update Firestore immediately when photo is uploaded
                    if (user?.uid) {
                      try {
                        const userRef = doc(firestore, 'users', user.uid);
                        await setDoc(userRef, {
                          photoURL: newPhotoURL,
                        }, { merge: true });
                        setMessage('Profile photo updated!');
                        setMessageType('success');
                      } catch (error) {
                        console.error('Error updating photo:', error);
                      }
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full py-2 px-4 text-themecolor hover:text-white font-semibold rounded-lg transition-all duration-300 font-montserrat underline"
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
                          ? 'bg-themecolor text-white'
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
                className="w-full py-4 px-6 bg-themecolor hover:bg-themecolor/90 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-themecolor/30 hover:shadow-themecolor/50 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
              >
                {loading ? 'Processing...' : `Donate ₹${customAmount || selectedAmount}`}
              </button>

              {/* Info */}
              <p className="text-center text-gray-400 text-sm font-montserrat">
                Your donation is secure and encrypted. You'll appear on our leaderboard! 🎉
              </p>

              {/* Logout Button */}
              <button
                onClick={() => signOut(auth)}
                className="w-full py-3 px-6 border-2 border-white/30 hover:border-themecolor hover:bg-themecolor/10 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-300 font-montserrat mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default DonatePage;
