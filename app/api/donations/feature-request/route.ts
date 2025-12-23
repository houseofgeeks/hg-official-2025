import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 400 }
      );
    }

    // Create a feature request document
    const featureRequestRef = admin
      .firestore()
      .collection('featureRequests')
      .doc();

    await featureRequestRef.set({
      userId,
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      approved: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Featured request submitted for admin review',
    });
  } catch (error) {
    console.error('Feature request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
