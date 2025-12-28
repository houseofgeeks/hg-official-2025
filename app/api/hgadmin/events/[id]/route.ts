import { NextResponse } from 'next/server';
import { deleteEvent, getEvents } from '@/lib/eventsService';
import { cookies } from 'next/headers';
import { deleteImages } from '@/lib/cloudinaryDelete';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const { isAdminFromCookies } = await import('@/lib/adminAuth');
    const isAuth = isAdminFromCookies(cookieStore);
    if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const events = await getEvents();
    const event = events.find(e => String(e.id) === String(id));
    if (!event) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // delete images from cloudinary (best-effort)
    if (event.images && event.images.length > 0) {
      try {
        await deleteImages(event.images.map((img: any) => img.public_id));
      } catch (err) {
        console.error('failed to destroy images', err);
      }
    }

    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('delete event error', err);
    return NextResponse.json({ message: 'Failed to delete event' }, { status: 500 });
  }
}
