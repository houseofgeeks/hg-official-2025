'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import OtpInput from 'react-otp-input';
import Link from 'next/link';
import ParticlesContainer from '@/components/ParticlesContainer';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
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
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('otp');
        setMessage('OTP sent to your email');
        setMessageType('success');
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
    try {
      // Verify OTP
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, isSignup: true, name }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setMessage(data.message || 'Invalid OTP');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create Firestore user document
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        name,
        email,
        photoURL: null,
        donatedAmount: 0,
        featured: false,
        createdAt: new Date(),
      });

      setMessage('Account created! Redirecting...');
      setMessageType('success');
      setTimeout(() => router.push('/donate'), 1500);
    } catch (err: any) {
      setMessage(err.message || 'Signup failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ParticlesContainer />
      <main className="min-h-screen flex items-center justify-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-white/10"
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
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-themecolor"
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-themecolor"
              />
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
                    <input {...props} className="!w-12 !h-12 mx-1 text-center text-xl bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-themecolor" />
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-themecolor hover:bg-themecolor/80 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              <button type="button" onClick={() => setStep('form')} className="w-full text-gray-400 hover:text-white">
                ← Back
              </button>
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
