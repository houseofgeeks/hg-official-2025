import { ReadonlyRequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export function isAdminFromCookies(cookieStore: ReadonlyRequestCookies | { get?: any; getAll?: any; }) {
  try {
    // cookieStore may be a Promise<ReadonlyRequestCookies> in some contexts
    // Caller should await cookies() and pass the result
    const get = (cookieStore as any).get?.bind(cookieStore);
    const hg = get ? get('hgadmin_auth')?.value === '1' : false;
    if (hg) return true;

    const token = get ? get('hgadmin_token')?.value : undefined;
    if (!token) return false;

    // quick decode JWT payload (no verification) - acceptable for local dev convenience
    const parts = token.split('.');
    if (parts.length < 2) return false;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload?.email === process.env.HGADMIN_EMAIL;
  } catch (err) {
    return false;
  }
}
