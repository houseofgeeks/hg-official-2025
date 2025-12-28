import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/eventsService';

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}
