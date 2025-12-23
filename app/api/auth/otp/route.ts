import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const otpStore: Map<string, { code: string; expiresAt: number; name?: string }> = new Map();

// Create transporter once
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, name, isSignup } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
    }

    // Send OTP
    if (!otp) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(email, { 
        code: generatedOtp, 
        expiresAt: Date.now() + 10 * 60 * 1000,
        name 
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'House of Geeks - OTP Verification',
        html: `<h2 style="color: #f0427c;">Your OTP: ${generatedOtp}</h2><p>Valid for 10 minutes</p>`,
      });

      return NextResponse.json({ success: true, message: 'OTP sent to your email' });
    }

    // Verify OTP
    const stored = otpStore.get(email);
    
    if (!stored) {
      return NextResponse.json({ success: false, message: 'OTP not found. Please request a new one.' }, { status: 400 });
    }

    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
    }

    if (stored.code !== otp) {
      return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
    }

    otpStore.delete(email);

    // For signup, return success - user is verified
    if (isSignup && name) {
      return NextResponse.json({ success: true, message: 'Account created!', email, name });
    }

    return NextResponse.json({ success: true, message: 'OTP verified' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('OTP API Error:', errorMessage);
    return NextResponse.json({ success: false, message: `Error: ${errorMessage}` }, { status: 500 });
  }
}
