import { NextResponse } from 'next/server';
import { destroyImage } from '@/lib/cloudinaryAdmin';
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
    const force = !!body?.force;

    console.debug('delete images request', { publicIds, eventId, force });

    if (!Array.isArray(publicIds) || publicIds.length === 0) return NextResponse.json({ message: 'Invalid payload: publicIds required' }, { status: 400 });

    const results: Array<{ id: string; ok: boolean; error?: string }> = [];

    // Attempt Cloudinary delete for each id (but continue on errors)
    for (const id of publicIds) {
      try {
        await destroyImage(id);
        results.push({ id, ok: true });
      } catch (err: any) {
        // Log Cloudinary response detail if available
        console.error('Cloudinary destroy error detail', err.response?.data || err.message || String(err));
        results.push({ id, ok: false, error: err.response?.data?.error?.message || err.message || String(err) });
      }
    }

    // If an eventId was provided, remove successful deletions from the event record
    // Also if force=true, remove all requested publicIds from event regardless of cloudinary result
    let removalError: string | null = null;
    if (eventId) {
      const toRemove = force ? publicIds : results.filter(r => r.ok).map(r => r.id);
      if (toRemove.length > 0) {
        try {
          const { removeImagesFromEvent } = await import('@/lib/eventsService');
          await removeImagesFromEvent(eventId, toRemove);
        } catch (err: any) {
          console.error('failed to remove image refs from event', err);
          removalError = err.message || String(err);
        }
      }
    }

    return NextResponse.json({ results, removalError, forced: force });
  } catch (err: any) {
    console.error('images delete fatal error', err);
    return NextResponse.json({ message: err.message || 'Failed to delete images' }, { status: 500 });
  }
}
