import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find the reset token in Firestore
    const resetSnapshot = await adminDb
      .collection('passwordResets')
      .where('token', '==', token)
      .where('used', '==', false)
      .limit(1)
      .get();

    if (resetSnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const resetDoc = resetSnapshot.docs[0];
    const resetData = resetDoc.data();

    // Check if token has expired
    if (resetData.expiresAt < Date.now()) {
      // Mark as used even though expired
      await resetDoc.ref.update({ used: true });
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Update the user's password in Firebase Auth
    const uid = resetDoc.id;
    await adminAuth.updateUser(uid, {
      password: newPassword,
    });

    // Mark token as used
    await resetDoc.ref.update({
      used: true,
      usedAt: Date.now(),
    });

    return NextResponse.json(
      { message: 'Password has been successfully reset' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
