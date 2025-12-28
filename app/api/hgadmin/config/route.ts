import { NextResponse } from 'next/server';

export async function GET() {
  function parseCloudinaryUrl(url?: string) {
    if (!url) return null;
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (!m) return null;
    return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  const _parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
  const hasCloudinarySecrets = !!(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || _parsed?.apiKey) && !!(process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || _parsed?.apiSecret) && !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || _parsed?.cloudName);
  return NextResponse.json({ cloudinaryDeleteEnabled: hasCloudinarySecrets });
}
