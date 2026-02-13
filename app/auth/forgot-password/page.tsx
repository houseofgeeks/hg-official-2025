'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ParticlesContainer from '@/components/ParticlesContainer';
import Navbar from '@/components/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset link sent! Check your inbox.');
        setMessageType('success');
        setEmail(''); // Clear email field on success
      } else {
        setMessage(data.error || 'Failed to send reset email');
        setMessageType('error');
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
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
        >
          <h1 className="text-3xl font-bold text-white text-center mb-2">Forgot Password</h1>
          <p className="text-gray-400 text-center mb-6">Enter your email to reset your password</p>

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-center ${messageType === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-themecolor"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-themecolor hover:bg-themecolor/80 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-6">
            Remember your password? <Link href="/auth/login" className="text-themecolor hover:underline">Login</Link>
          </p>
        </motion.div>
      </main>
    </>
  );
}
