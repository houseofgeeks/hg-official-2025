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
  const [showQRMode, setShowQRMode] = useState(false);

  const presetAmounts = [500, 1000, 2500, 5000];
  
  // Check if Razorpay is enabled via environment variable
  const isRazorpayEnabled = process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === 'true';
  const googleFormLink = process.env.NEXT_PUBLIC_DONATION_FORM_LINK || 'https://forms.google.com/your-form-link';

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

  // Load Razorpay script only if enabled
  useEffect(() => {
    if (!isRazorpayEnabled) {
      console.log('Razorpay is disabled - QR mode active');
      return;
    }
    
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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isRazorpayEnabled]);

  if (!user) {
    return (
      <>
        <Navbar />
        <ParticlesContainer />
        <main className="min-h-screen w-full px-4 py-8 relative">
          {/* Hero Section for Non-logged in users */}
          <motion.section
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center pt-24 pb-12 max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-teko font-bold text-white mb-4">
              SUPPORT <span className="text-themecolor">HOUSE OF GEEKS</span>
            </h1>
            <p className="text-xl text-gray-300 font-montserrat max-w-2xl mx-auto mb-6">
              Your contribution empowers the next generation of tech innovators at IIIT Ranchi.
              Every contribution makes a difference!
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-themecolor to-purple-600 mx-auto rounded-full"></div>
          </motion.section>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto mb-16 mt-16"
          >
            <div className="bg-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-themecolor/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-themecolor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-teko font-bold text-white mb-3">READY TO CONTRIBUTE?</h2>
              <p className="text-gray-300 mb-6 font-montserrat">
                Please login to continue with your contribution. Your profile will appear on our contributions page!
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/auth/login">
                  <button className="interactive-element w-full py-3 px-6 bg-themecolor hover:bg-themecolor/90 text-white font-bold rounded-xl transition-all duration-300 font-montserrat">
                    Login
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="interactive-element w-full py-3 px-6 border border-white/20 text-white font-bold rounded-xl hover:bg-themecolor/10 hover:border-themecolor transition-all duration-300 font-montserrat">
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

    if (amount < 500) {
      setMessage('Minimum contribution amount is ₹500');
      setMessageType('error');
      return;
    }

    // If Razorpay is disabled, show QR code donation method
    if (!isRazorpayEnabled) {
      console.log('Razorpay disabled - switching to QR mode');
      setShowQRMode(true);
      return;
    }

    // Razorpay payment flow
    if (!razorpayLoaded || !window.Razorpay) {
      setMessage('Payment gateway not loaded. Please refresh the page.');
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

              setMessage('Contribution successful! Thank you for your support!');
              setMessageType('success');
              setTimeout(() => router.push('/contribution'), 2000);
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
      setMessage('Error initiating contribution');
      setMessageType('error');
      setLoading(false);
    }
  };

  const impactStats = [
    { icon: '🎓', value: '1500+', label: 'Students Impacted' },
    { icon: '🚀', value: '50+', label: 'Events Organized' },
    { icon: '💻', value: '100+', label: 'Projects Built' },
    { icon: '🏆', value: '30+', label: 'Hackathons Organized' },
  ];

  const whyDonate = [
    {
      icon: '📚',
      title: 'Fund Workshops & Events',
      description: 'Support hands-on learning experiences and technical workshops for students.',
    },
    {
      icon: '🎯',
      title: 'Enable Hackathon Participation',
      description: 'Help students travel to and compete in national and international hackathons.',
    },
    {
      icon: '🔧',
      title: 'Provide Resources & Tools',
      description: 'Fund essential software, hardware, and cloud resources for student projects.',
    },
    {
      icon: '🌟',
      title: 'Build The Future',
      description: 'Invest in the next generation of tech leaders and innovators from IIIT Ranchi.',
    },
  ];

  return (
    <>
      <Navbar />
      <ParticlesContainer />
      <main className="min-h-screen w-full px-4 py-2 relative">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-24 pb-12 max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-7xl font-teko font-bold text-white mb-4">
            SUPPORT <span className="text-themecolor">HOUSE OF GEEKS</span>
          </h1>
          <p className="text-xl text-gray-300 font-montserrat max-w-2xl mx-auto mb-6">
            Your contribution empowers the next generation of tech innovators at IIIT Ranchi.
            Every contribution makes a difference!
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-themecolor to-purple-600 mx-auto rounded-full"></div>
        </motion.section>

        

        {/* Main Content - Two Column Layout (Donate 60% | Why 40%) */}
        <div className="max-w-5xl mx-auto lg:ml-60 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 mb-16 px-4">
          {/* Donation Form - Now on Left */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className=""
          >
            <div className="bg-black/1 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-10 sticky top-24 shadow-[0_0_30px_rgba(240,66,124,0.3)]">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-teko font-bold text-white mb-2">MAKE A CONTRIBUTION</h2>
                <p className="text-gray-400 font-montserrat text-sm">
                  {isRazorpayEnabled ? 'Secure payment via Razorpay' : 'UPI QR Code Payment'}
                </p>
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

              {/* Show QR Code Mode only when showQRMode is true */}
              {showQRMode ? (
                <div className="space-y-6">
                  {/* Amount Display */}
                  <div className="bg-gradient-to-r from-themecolor/20 to-purple-600/20 rounded-lg p-4 border border-themecolor/30 text-center">
                    <p className="text-gray-300 text-sm mb-1">Your Contribution Amount</p>
                    <p className="text-3xl font-bold text-white">₹{(customAmount || selectedAmount).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">(Minimum: ₹500)</p>
                  </div>

                  {/* Instructions */}
                  <div className="bg-[#0c0c0c] rounded-lg p-4 border border-themecolor/10">
                    <h3 className="text-white font-semibold mb-3 font-montserrat">Payment Instructions:</h3>
                    <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside font-montserrat">
                      <li>Scan the QR code below using any UPI app</li>
                      <li>Pay your contribution amount: <strong className="text-white">₹{(customAmount || selectedAmount).toLocaleString()}</strong></li>
                      <li>Take a screenshot of payment confirmation</li>
                      <li>Submit payment details via Google Form</li>
                    </ol>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center p-6 bg-white rounded-lg">
                    <img 
                      src="/donation-qr.jpeg" 
                      alt="Payment QR Code" 
                      className="w-64 h-64 object-contain"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <a 
                      href={googleFormLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 px-6 bg-themecolor hover:bg-themecolor/90 text-white font-bold rounded-xl text-center transition-all duration-300 font-montserrat"
                    >
                      Submit Payment Details (Google Form) →
                    </a>
                    
                    <button
                      onClick={() => {
                        setShowQRMode(false);
                        setCustomAmount('');
                        setSelectedAmount(500);
                      }}
                      className="w-full py-3 bg-transparent border border-white/20 text-gray-300 font-semibold rounded-xl hover:border-themecolor transition-all font-montserrat"
                    >
                      ← Change Amount
                    </button>
                  </div>

                  {/* Note */}
                  <p className="text-xs text-gray-400 text-center font-montserrat">
                    After submitting the form, our team will verify your payment and update the contributions within 24-48 hours.
                  </p>

                  {/* Logout Button */}
                  <button
                    onClick={() => signOut(auth)}
                    className="w-full py-2.5 px-6 border border-white/20 hover:border-themecolor hover:bg-themecolor/10 text-gray-400 hover:text-white font-medium rounded-xl transition-all duration-300 font-montserrat text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-6">{/* Razorpay Payment Form */}
                {/* Profile Photo Upload */}
                <div className="text-center">
                  <label className="block text-gray-300 font-montserrat font-semibold mb-3 text-sm">
                    Profile Photo (Optional - for Contributions Page)
                  </label>
                  {photoURL && (
                    <div className="mb-3 flex justify-center">
                      <img
                        src={photoURL}
                        alt="Profile"
                        className="w-36 h-36 rounded-full border-2 border-themecolor object-cover"
                      />
                    </div>
                  )}
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                    onSuccess={async (result: any) => {
                      const newPhotoURL = result.info.secure_url;
                      setPhotoURL(newPhotoURL);
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
                        className="py-2 px-4 text-themecolor hover:text-white font-semibold rounded-lg transition-all duration-300 font-montserrat underline text-sm"
                      >
                        {photoURL ? 'Change Photo' : 'Upload Photo'}
                      </button>
                    )}
                  </CldUploadWidget>
                </div>

                {/* Preset Amounts */}
                <div>
                  <label className="block text-gray-300 font-montserrat font-semibold mb-2 text-sm">
                    Select Amount
                  </label>
                  <p className="text-gray-400 text-xs font-montserrat mb-3">
                    Minimum contribution amount is ₹500
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`py-3 px-4 rounded-xl font-bold transition-all duration-300 font-montserrat ${
                          selectedAmount === amount && customAmount === ''
                            ? 'bg-themecolor text-white shadow-lg shadow-themecolor/30'
                            : 'bg-transparent text-white border border-white/20 hover:border-themecolor/60'
                        }`}
                      >
                        ₹{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Or Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="text-gray-500 font-montserrat text-sm">or</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-gray-300 font-montserrat font-semibold mb-3 text-sm">
                    Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-montserrat">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        if (e.target.value) {
                          setSelectedAmount(0);
                        }
                      }}
                      placeholder="Enter amount (min ₹500)"
                      className="w-full pl-8 pr-4 py-4 bg-transparent border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-themecolor transition-all font-montserrat"
                    />
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={() => handleDonate(customAmount ? parseInt(customAmount) : selectedAmount)}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-themecolor hover:bg-themecolor/90 text-white font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Contribute ₹{(customAmount || selectedAmount).toLocaleString()} <span className="text-xl">💜</span>
                    </span>
                  )}
                </button>

                {/* Terms and Conditions */}
                <p className="text-center text-gray-500 text-xs font-montserrat">
                  By donating you agree to our{' '}
                  <Link href="/terms" className="text-themecolor hover:underline">
                    Terms and Conditions
                  </Link>
                </p>

                {/* Logout Button */}
                <button
                  onClick={() => signOut(auth)}
                  className="w-full py-2.5 px-6 border border-white/20 hover:border-themecolor hover:bg-themecolor/10 text-gray-400 hover:text-white font-medium rounded-xl transition-all duration-300 font-montserrat text-sm"
                >
                  Logout
                </button>
              </div>
              )}
            </div>
          </motion.section>

          {/* Why Donate Section - Now on Right */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className=""
          >
            <h2 className="text-5xl font-montserrat font-bold text-white mb-8">
              WHY <span className="text-themecolor">CONTRIBUTE?</span>
            </h2>
            <div className="space-y-5">
              {whyDonate.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="interactive-element bg-transparent rounded-xl p-6 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-start w-full gap-4 text-white">
                    <div className="w-12 h-12 rounded-lg bg-themecolor/20 flex items-center justify-center shrink-0">
                      <span className="text-themecolor text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold text-white mb-2 group-hover:text-themecolor">{item.title}</h3>
                      <p className="text-sm text-gray-400 font-montserrat leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            

            {/* Testimonial */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="interactive-element mt-6 bg-transparent rounded-xl p-6"
            >
              <p className="text-gray-300 font-montserrat italic mb-4 leading-relaxed">
                "House of Geeks transformed my college experience. The workshops and mentorship helped me land my dream internship. Supporting HoG is supporting the future of tech!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-themecolor flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="text-white font-montserrat font-semibold text-sm">Alumni Member</p>
                  <p className="text-gray-500 text-xs font-montserrat">IIIT Ranchi, Batch 2023</p>
                </div>
              </div>
            </motion.div> */}
          </motion.section>
        </div>
        {/* Impact Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="interactive-element rounded-xl p-6 text-center hover:bg-white/5 transition-all duration-300 group"
              >
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                <p className="text-3xl font-teko font-bold text-themecolor mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400 font-montserrat">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="max-w-4xl mx-auto text-center pb-16"
        >
          <div className="bg-transparent rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-teko font-bold text-white mb-4">
              EVERY CONTRIBUTION <span className="text-themecolor">COUNTS</span>
            </h2>
            <p className="text-gray-400 font-montserrat mb-8 max-w-2xl mx-auto">
              Whether big or small, your contribution directly impacts student lives. Join our community of supporters.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/community" className="interactive-element inline-flex items-center gap-2 px-6 py-3 bg-themecolor hover:bg-themecolor/90 text-white font-montserrat font-semibold rounded-xl transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View Community
              </Link>
              <Link href="/contribution" className="interactive-element inline-flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-white/5 text-white font-montserrat font-semibold rounded-xl transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                View Contributions
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
};

export default DonatePage;
