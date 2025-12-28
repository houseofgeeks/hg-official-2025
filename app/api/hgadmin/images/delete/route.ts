
import { NextResponse } from 'next/server';
import { deleteImages } from '@/lib/cloudinaryDelete';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const { isAdminFromCookies } = await import('@/lib/adminAuth');
    const isAuth = isAdminFromCookies(cookieStore);
    if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const publicIds = body?.publicIds;
    const eventId = body?.eventId;
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json({ message: 'Invalid payload: publicIds required' }, { status: 400 });
    }

    const results = await deleteImages(publicIds);

    let removalError: string | null = null;
    if (eventId) {
      // Remove successfully deleted images from the event
      const toRemove = results.filter(r => r.ok).map(r => r.id);
      if (toRemove.length > 0) {
        try {
          const { removeImagesFromEvent } = await import('@/lib/eventsService');
          await removeImagesFromEvent(eventId, toRemove);
        } catch (err: any) {
          removalError = err.message || String(err);
        }
      }
    }

    return NextResponse.json({ results, removalError });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Failed to delete images' }, { status: 500 });
  }
}

