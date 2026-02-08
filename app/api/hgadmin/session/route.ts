import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const list = cookieStore.getAll().map(c => ({ name: c.name, value: c.value }));
  return NextResponse.json({ cookies: list });
}
