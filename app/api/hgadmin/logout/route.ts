import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('hgadmin_auth', '', { path: '/hgadmin', expires: new Date(0) });
  return res;
}
