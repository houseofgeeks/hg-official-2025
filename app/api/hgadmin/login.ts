import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const allowedEmail = process.env.HGADMIN_EMAIL || 'houseofgeeks@iiitranchi.ac.in';
  const allowedPassword = process.env.HGADMIN_PASSWORD;

  if (email !== allowedEmail) {
    return NextResponse.json({ message: 'Invalid email.' }, { status: 401 });
  }
  if (!allowedPassword || password !== allowedPassword) {
    return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
  }

  // Set a simple cookie for session (for demo, use JWT or secure session in prod)
  const res = NextResponse.json({ success: true });
  // Set cookie at root so API routes can read it
  res.cookies.set('hgadmin_auth', '1', { httpOnly: true, path: '/', sameSite: 'lax' });
  return res;
}
