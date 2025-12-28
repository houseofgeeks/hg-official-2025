import { NextResponse } from 'next/server';

export async function GET() {
  // Dev-only diagnostic — never expose secrets in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  function parseCloudinaryUrl(url?: string) {
    if (!url) return null;
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (!m) return null;
    return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }

  const _parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
  const hasApiKey = !!(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || _parsed?.apiKey);
  const hasApiSecret = !!(process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || _parsed?.apiSecret);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || _parsed?.cloudName || null;
  const apiKeyLength = (process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || _parsed?.apiKey || '').length;
  const secretLength = (process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || _parsed?.apiSecret || '').length;

  return NextResponse.json({
    cloudName,
    hasApiKey,
    hasApiSecret,
    apiKeyLength,
    secretLength,
  });
}
