import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const { isAdminFromCookies } = await import('@/lib/adminAuth');
  if (!isAdminFromCookies(cookieStore)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  function parseCloudinaryUrl(url?: string) {
    if (!url) return null;
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (!m) return null;
    return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  const _parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
  const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || _parsed?.apiKey;
  const API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || _parsed?.apiSecret;
  const CLOUD_NAME_FINAL = CLOUD_NAME || _parsed?.cloudName;

  const masked = (s?: string) => {
    if (!s) return null;
    if (s.length <= 6) return '*****';
    return s.substring(0, 3) + '...' + s.substring(s.length - 3);
  };

  const crypto = await import('crypto');

  const hash = (s?: string) => {
    if (!s) return null;
    return crypto.createHash('sha256').update(s).digest('hex');
  };

  const result: any = {
    cloudName: CLOUD_NAME_FINAL || null,
    apiKeySet: !!API_KEY,
    apiSecretSet: !!API_SECRET,
    apiKeyPreview: masked(API_KEY),
    apiSecretPreview: masked(API_SECRET),
    apiKeyHash: hash(API_KEY),
    apiSecretHash: hash(API_SECRET),
  };

  // Try a lightweight Cloudinary check (destroy a made-up ID) so we can see Cloudinary's response
  if (CLOUD_NAME_FINAL && API_KEY && API_SECRET) {
    try {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME_FINAL}/image/destroy`;
      const params = new URLSearchParams();
      params.append('public_id', 'hg-debug-nonexistent-id');
      const resp = await axios.post(url, params, { auth: { username: API_KEY, password: API_SECRET }, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 });
      result.cloudinary = { status: resp.status, data: resp.data };
    } catch (err: any) {
      result.cloudinary = { status: err.response?.status || 'error', data: err.response?.data || err.message };
    }
  } else {
    result.cloudinary = { status: 'skipped', data: 'API key/secret/cloud name not fully configured' };
  }

  return NextResponse.json(result);
}
