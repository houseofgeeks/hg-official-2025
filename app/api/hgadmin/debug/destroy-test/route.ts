import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  // Dev-only diagnostic — never expose secrets in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const publicId = body?.publicId;
    if (!publicId) return NextResponse.json({ message: 'publicId required' }, { status: 400 });

    function parseCloudinaryUrl(url?: string) {
      if (!url) return null;
      const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
      if (!m) return null;
      return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
    }

    const _parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
    const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || _parsed?.apiKey;
    const API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || _parsed?.apiSecret;
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || _parsed?.cloudName;

    if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
      return NextResponse.json({ message: 'Cloudinary env vars missing', hasApiKey: !!API_KEY, hasApiSecret: !!API_SECRET, cloudName: CLOUD_NAME || null }, { status: 500 });
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
    const params = new URLSearchParams();
    params.append('public_id', publicId);

    const resp = await axios.post(url, params, {
      auth: { username: API_KEY, password: API_SECRET },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      validateStatus: () => true, // return even on 4xx/5xx so we can inspect response body
    });

    // Return Cloudinary's status and body so we can diagnose the issue (no secrets)
    return NextResponse.json({ status: resp.status, data: resp.data });
  } catch (err: any) {
    return NextResponse.json({ message: err.message, status: err?.response?.status, data: err?.response?.data }, { status: 500 });
  }
}
