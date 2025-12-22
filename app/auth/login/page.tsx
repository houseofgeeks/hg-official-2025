'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ParticlesContainer from '@/components/ParticlesContainer';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please enter email and password');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful! Redirecting...');
      setMessageType('success');
      setTimeout(() => router.push('/donate'), 1500);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setMessage('User not found. Please sign up first.');
      } else if (err.code === 'auth/wrong-password') {
        setMessage('Wrong password');
      } else if (err.code === 'auth/invalid-credential') {
        setMessage('Invalid email or password');
      } else {
        setMessage(err.message || 'Login failed');
      }
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
          <h1 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-center mb-6">Login to House of Geeks</p>

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-center ${messageType === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-themecolor"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-themecolor"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-themecolor hover:bg-themecolor/80 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-6">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-themecolor hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </main>
    </>
  );
}
