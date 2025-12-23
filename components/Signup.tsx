'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { uploadToCloudinary } from '@/lib/cloudinaryUtils';
import { motion } from 'framer-motion';

interface SignupProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const sendOtp = async () => {
    setError('');
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'send' }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Error sending OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, action: 'verify' }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpVerified(true);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Error verifying OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpVerified) {
      setError('Please verify your email with OTP first');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!name || !gender) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      let photoURL = '';

      if (photoFile) {
        photoURL = await uploadToCloudinary(photoFile);
      }

      await signup(email, password, {
        name,
        gender,
        photoURL,
        verified: true,
        donatedAmount: 0,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] rounded-lg p-8 border border-indigo-500/20">
        <h2 className="text-3xl font-bold text-white mb-2 font-teko">Create Account</h2>
        <p className="text-gray-400 text-sm mb-6">Join House of Geeks</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email and OTP Section */}
          {!otpVerified && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent}
                  className="w-full px-4 py-2 bg-[#0c0c0c] border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full px-4 py-2 bg-[#0c0c0c] border border-indigo-500/30 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-indigo-500"
                    placeholder="000000"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading}
                    className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}
            </div>
          )}

          {otpVerified && (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0c0c0c] border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0c0c0c] border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-[#0c0c0c] border border-indigo-500/30 rounded-lg text-gray-400 focus:outline-none focus:border-indigo-500 file:mr-2 file:py-1 file:px-3 file:border-0 file:rounded file:bg-indigo-600 file:text-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0c0c0c] border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="••••••"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0c0c0c] border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          )}
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Signup;
