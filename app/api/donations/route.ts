import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Create order request
    if (data.amount && data.email && !data.razorpay_order_id) {
      const { amount } = data;

      if (!amount || amount < 100) {
        return NextResponse.json(
          { success: false, message: 'Invalid amount (minimum ₹1)' },
          { status: 400 }
        );
      }

      // Create Razorpay order using REST API
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      
      if (!keyId || !keySecret) {
        console.error('Razorpay keys not configured');
        return NextResponse.json(
          { success: false, message: 'Payment gateway not configured' },
          { status: 500 }
        );
      }

      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      
      const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amount, // amount is already in paise from client
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('Razorpay order creation failed:', errorData);
        return NextResponse.json(
          { success: false, message: 'Failed to create payment order' },
          { status: 500 }
        );
      }

      const order = await orderResponse.json();

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }
    // Verify payment request
    else if (data.razorpay_order_id && data.razorpay_payment_id) {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = data;

      // Verify Razorpay signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, message: 'Invalid signature' },
          { status: 400 }
        );
      }

      // Payment verified - client will update Firestore
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully!',
        verified: true,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
