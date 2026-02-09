'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import OtpInput from 'react-otp-input';
import Link from 'next/link';
import ParticlesContainer from '@/components/ParticlesContainer';
import Navbar from '@/components/Navbar';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  const handleSendOtp = async (e?: React.FormEvent, isResend = false) => {
    if (e) e.preventDefault();
    if (!name || !email || !password) {
      setMessage('Please fill all fields');
      setMessageType('error');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, action: 'send' }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('otp');
        setMessage(isResend ? 'New OTP sent to your email!' : 'OTP sent to your email');
        setMessageType('success');
        // Start 60 second countdown for resend
        setResendTimer(60);
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setMessage(data.message || 'Failed to send OTP');
        setMessageType('error');
      }
    } catch {
      setMessage('Error sending OTP');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage('Enter valid 6-digit OTP');
      setMessageType('error');
      return;
    }

    setLoading(true);
    console.log('Starting signup process...');
    
    try {
      // Verify OTP
      console.log('Verifying OTP...');
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, action: 'verify', isSignup: true, name }),
      });
      const data = await res.json();
      console.log('OTP verification response:', data);
      
      if (!data.success) {
        setMessage(data.message || 'Invalid OTP');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // Create Firebase Auth user
      console.log('Creating Firebase Auth user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user.uid);
      
      // Try to create Firestore document, but don't fail signup if it fails
      console.log('Creating Firestore document...');
      console.log('Firestore instance:', firestore);
      
      try {
        const userDocRef = doc(firestore, 'users', userCredential.user.uid);
        console.log('Document reference created:', userDocRef.path);
        
        // Set a timeout for the Firestore operation
        const firestoreTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore operation timed out')), 5000)
        );
        
        const firestoreWrite = setDoc(userDocRef, {
          name,
          email,
          photoURL: null,
          donatedAmount: 0,
          featured: false,
          createdAt: new Date(),
        });
        
        await Promise.race([firestoreWrite, firestoreTimeout]);
        
        console.log('Firestore document created successfully');
      } catch (firestoreError: any) {
        console.error('Firestore error (non-fatal):', firestoreError);
        console.error('Error code:', firestoreError?.code);
        console.error('Error message:', firestoreError?.message);
        console.warn('Continuing with signup despite Firestore error - document can be created later');
        // Don't throw - allow signup to continue
      }

      // Redirect immediately - auth state will update on the donate page
      console.log('Redirecting to donate page...');
      window.location.href = '/donate';
      
    } catch (err: any) {
      console.error('Signup error:', err);
      setLoading(false);
      setRedirecting(false);
      
      if (err.code === 'auth/email-already-in-use') {
        setMessage('Email already registered. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setMessage('Password is too weak');
      } else {
        setMessage(err.message || 'Signup failed');
      }
      setMessageType('error');
    }
  };

  return (
    <>
      <Navbar />
      <ParticlesContainer />
      <main className="min-h-screen flex items-center justify-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          suppressHydrationWarning
        >
          <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
          <p className="text-gray-400 text-center mb-6">Join House of Geeks</p>

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-center ${messageType === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-themecolor"
                suppressHydrationWarning
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-themecolor"
                suppressHydrationWarning
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-themecolor"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-themecolor hover:bg-themecolor/80 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndSignup} className="space-y-4">
              <p className="text-gray-300 text-center">Enter OTP sent to {email}</p>
              <div className="flex justify-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => (
                    <input {...props} className="w-12! h-12! mx-1 text-center text-xl bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-themecolor" />
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={loading || redirecting}
                className="w-full py-3 bg-themecolor hover:bg-themecolor/80 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : redirecting ? 'Redirecting...' : 'Create Account'}
              </button>
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => handleSendOtp(undefined, true)}
                  disabled={loading || resendTimer > 0}
                  className="flex-1 py-2 text-sm text-themecolor hover:text-themecolor/80 disabled:opacity-50 disabled:cursor-not-allowed transition border border-themecolor/30 rounded-lg hover:bg-themecolor/10"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setOtp('');
                    setMessage('');
                  }}
                  className="flex-1 py-2 text-sm text-gray-400 hover:text-white transition border border-gray-400/30 rounded-lg hover:bg-white/10"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          <p className="text-gray-400 text-center mt-6">
            Already have an account? <Link href="/auth/login" className="text-themecolor hover:underline">Login</Link>
          </p>
        </motion.div>
      </main>
    </>
  );
}
