import { NextResponse } from 'next/server';
import { addImagesToEvent, getEvents } from '@/lib/eventsService';
import { cookies } from 'next/headers';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const { isAdminFromCookies } = await import('@/lib/adminAuth');
    const isAuth = isAdminFromCookies(cookieStore);
    if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { images } = await req.json();
    if (!Array.isArray(images) || images.length === 0) return NextResponse.json({ message: 'No images provided' }, { status: 400 });

    // validate shape
    for (const img of images) {
      if (!img.public_id || !img.url) return NextResponse.json({ message: 'Invalid image payload' }, { status: 400 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    // log id for debugging
    console.debug('Adding images to event id=', id);

    const ev = await addImagesToEvent(id, images);
    return NextResponse.json(ev, { status: 200 });
  } catch (err: any) {
    console.error('add images error', err);
    return NextResponse.json({ message: err.message || 'Failed to add images' }, { status: 500 });
  }
}
