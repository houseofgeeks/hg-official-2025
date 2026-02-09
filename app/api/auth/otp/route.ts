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
    const { email, otp, code, action, name, isSignup } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
    }

    // Handle both 'send' action and when no otp/code is provided
    if (action === 'send' || (!otp && !code)) {
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
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">House of Geeks</h2>
            <h1 style="color: #f0427c; font-size: 32px; margin: 20px 0;">Your OTP: ${generatedOtp}</h1>
            <p style="color: #666; font-size: 16px;">This OTP is valid for 10 minutes.</p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">If you didn't request this OTP, please ignore this email.</p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, message: 'OTP sent to your email' });
    }

    // Verify OTP - handle both 'otp' and 'code' field names
    const otpCode = otp || code;
    if (action === 'verify' || otpCode) {
      const stored = otpStore.get(email);
      
      if (!stored) {
        return NextResponse.json({ success: false, message: 'OTP not found. Please request a new one.' }, { status: 400 });
      }

      if (stored.expiresAt < Date.now()) {
        otpStore.delete(email);
        return NextResponse.json({ success: false, message: 'OTP expired. Please request a new one.' }, { status: 400 });
      }

      if (stored.code !== otpCode) {
        return NextResponse.json({ success: false, message: 'Invalid OTP. Please check and try again.' }, { status: 400 });
      }

      otpStore.delete(email);

      // For signup, return success - user is verified
      if (isSignup && name) {
        return NextResponse.json({ success: true, message: 'Account created!', email, name });
      }

      return NextResponse.json({ success: true, message: 'OTP verified successfully!' });
    }

    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('OTP API Error:', errorMessage);
    return NextResponse.json({ success: false, message: `Error: ${errorMessage}` }, { status: 500 });
  }
}
