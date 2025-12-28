import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getEvents } from '@/lib/eventsService';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const { isAdminFromCookies } = await import('@/lib/adminAuth');
    const isAuth = isAdminFromCookies(cookieStore);
    if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id, title, description, date, category } = await req.json();
    if (!id) return NextResponse.json({ message: 'Event id required' }, { status: 400 });
    const events = await getEvents();
    const idx = events.findIndex(e => String(e.id) === String(id));
    if (idx === -1) return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    if (title) events[idx].title = title;
    if (description !== undefined) events[idx].description = description;
    if (date !== undefined) events[idx].date = date;
    if (category !== undefined) events[idx].category = category;
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
    return NextResponse.json({ event: events[idx] });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Failed to update event' }, { status: 500 });
  }
}
