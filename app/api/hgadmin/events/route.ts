import { NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/eventsService';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    // accept either hgadmin_auth cookie or hgadmin_token JWT (local dev convenience)
    const { isAdminFromCookies } = await import('@/lib/adminAuth');
    const isAuth = isAdminFromCookies(cookieStore);
    if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, description, date, category, eventurl, images } = body;
    if (!title || !eventurl) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

    // ensure unique eventurl
    const existing = (await getEvents()).find(e => e.eventurl === eventurl);
    if (existing) return NextResponse.json({ message: 'Event URL already in use' }, { status: 400 });

    const event = await createEvent({ title, description, date, category, eventurl, images: images || [] });

    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
  }
}
