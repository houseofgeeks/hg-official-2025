import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { sendPasswordResetLink } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists in Firebase Auth
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Store token in Firestore
    await adminDb.collection('passwordResets').doc(userRecord.uid).set({
      email: email,
      token: resetToken,
      expiresAt: resetTokenExpiry,
      createdAt: Date.now(),
      used: false,
    });

    // Get user name from Firestore if available
    let userName = '';
    try {
      const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
      if (userDoc.exists) {
        userName = userDoc.data()?.name || '';
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }

    // Send password reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    await sendPasswordResetLink(email, resetUrl, userName);

    return NextResponse.json(
      { message: 'If an account exists with this email, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
