import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setThumbnailToEvent } from '@/lib/eventsService';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const { isAdminFromCookies } = await import('@/lib/adminAuth');
    const isAuth = isAdminFromCookies(cookieStore);
    if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { eventId, public_id } = await req.json();
    if (!eventId || !public_id) return NextResponse.json({ message: 'eventId and public_id required' }, { status: 400 });
    const event = await setThumbnailToEvent(eventId, public_id);
    return NextResponse.json({ event });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Failed to set thumbnail' }, { status: 500 });
  }
}
