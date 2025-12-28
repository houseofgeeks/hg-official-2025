import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const allowedEmail = process.env.HGADMIN_EMAIL || 'houseofgeeks@iiitranchi.ac.in';
    const allowedPassword = process.env.HGADMIN_PASSWORD;

    if (email !== allowedEmail) {
      return NextResponse.json({ message: 'Invalid email.' }, { status: 401 });
    }
    if (!allowedPassword || password !== allowedPassword) {
      return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    // Set cookie at root so API routes can read it (login and admin API paths differ)
    res.cookies.set('hgadmin_auth', '1', { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
  } catch (err) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}
