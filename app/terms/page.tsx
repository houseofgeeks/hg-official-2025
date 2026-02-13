'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import SpaceBackground from '@/components/SpaceBackground';
import { FaExclamationTriangle } from 'react-icons/fa';

const TermsAndConditions = () => {
  return (
    <>
      <SpaceBackground />
      <Navbar />
      <main className="min-h-screen text-white px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-teko font-bold text-white mb-4">
              HOUSE OF GEEKS <span className="text-themecolor">TERMS AND CONDITIONS</span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-themecolor to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-teko font-bold text-themecolor mb-4">1. Introduction</h2>
              <p className="text-gray-300 font-montserrat leading-relaxed">
                Welcome to House of Geeks (HoG). By accessing our website and making donations, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding with any donation.
              </p>
            </section>

            {/* Donations */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-teko font-bold text-themecolor mb-4">2. Donations</h2>
              <ul className="text-gray-300 font-montserrat leading-relaxed space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>All donations made to House of Geeks are voluntary contributions to support our community initiatives, workshops, hackathons, and student development programs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>The minimum donation amount is ₹500 (Indian Rupees).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>Donations are processed securely through Razorpay payment gateway with 256-bit SSL encryption.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>By making a donation, you confirm that you are authorized to use the payment method provided.</span>
                </li>
              </ul>
            </section>

            {/* Refund Policy */}
            <section className="bg-themecolor/10 backdrop-blur-sm border border-themecolor/30 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-teko font-bold text-themecolor mb-4">3. Refund Policy</h2>
              <div className="text-gray-300 font-montserrat leading-relaxed space-y-4">
                <p className="font-semibold text-white">
                  Please read this section carefully before making any donation.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 font-semibold flex items-center gap-2">
                    <FaExclamationTriangle className="text-xl" /> NO REFUNDS WILL BE GRANTED AFTER DONATIONS ARE MADE.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-themecolor mt-1">•</span>
                    <span>All donations are final and non-refundable once the payment has been successfully processed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-themecolor mt-1">•</span>
                    <span>We strongly encourage donors to review the donation amount carefully before confirming the payment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-themecolor mt-1">•</span>
                    <span>In case of duplicate transactions due to technical issues, please contact us at our official email within 24 hours with transaction details for review.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-themecolor mt-1">•</span>
                    <span>House of Geeks reserves the right to make the final decision on any refund requests for duplicate transactions.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Use of Donations */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-teko font-bold text-themecolor mb-4">4. Use of Donations</h2>
              <p className="text-gray-300 font-montserrat leading-relaxed mb-4">
                Your donations will be used to support:
              </p>
              <ul className="text-gray-300 font-montserrat leading-relaxed space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>Technical workshops and learning events for students</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>Hackathon participation and travel expenses for students</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>Software, hardware, and cloud resources for student projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>Community building and mentorship programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>Infrastructure and operational costs of House of Geeks</span>
                </li>
              </ul>
            </section>

            {/* Donor Recognition */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-teko font-bold text-themecolor mb-4">5. Donor Recognition</h2>
              <ul className="text-gray-300 font-montserrat leading-relaxed space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>Donors may appear on our public leaderboard with their name, profile photo, and donation amount.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>By making a donation, you consent to your information being displayed on the leaderboard unless you specifically request otherwise.</span>
                </li>
              </ul>
            </section>

            {/* Privacy */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-teko font-bold text-themecolor mb-4">6. Privacy</h2>
              <ul className="text-gray-300 font-montserrat leading-relaxed space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>We collect only necessary information for processing donations and maintaining donor records.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>Your payment information is securely handled by Razorpay and is not stored on our servers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-themecolor mt-1">•</span>
                  <span>We will not share your personal information with third parties without your consent.</span>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-teko font-bold text-themecolor mb-4">7. Contact Us</h2>
              <p className="text-gray-300 font-montserrat leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us through our official channels or reach out to the House of Geeks team at IIIT Ranchi.
              </p>
            </section>

            {/* Last Updated */}
            <p className="text-center text-gray-500 font-montserrat text-sm">
              Last updated: December 2025
            </p>

            {/* Back to Contribute */}
            <div className="text-center pt-8">
              <Link href="/donate">
                <button className="interactive-element px-8 py-3 bg-themecolor hover:bg-themecolor/90 text-white font-bold rounded-xl transition-all duration-300 font-montserrat">
                  Back to Contribute
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default TermsAndConditions;
