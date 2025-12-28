import axios from 'axios';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function parseCloudinaryUrl(url?: string) {
  if (!url) return null;
  const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) return null;
  return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
}

const _parsedCloud = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || _parsedCloud?.apiKey;
const API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || _parsedCloud?.apiSecret;
const CLOUD_NAME_FINAL = CLOUD_NAME || _parsedCloud?.cloudName;

export async function destroyImage(publicId: string): Promise<void> {
  if (!API_KEY || !API_SECRET || !CLOUD_NAME_FINAL) {
    throw new Error('Cloudinary API_KEY/SECRET/CLOUD_NAME not configured on server');
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME_FINAL}/image/destroy`;
  const params = new URLSearchParams();
  params.append('public_id', publicId);
  try {
    const resp = await axios.post(url, params, {
      auth: { username: API_KEY, password: API_SECRET },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (resp?.data?.result !== 'ok' && resp?.data?.result !== 'not_found') {
      console.error('Cloudinary destroy unexpected response', { status: resp.status, data: resp.data });
      throw new Error(`Cloudinary destroy failed: ${resp.data?.error?.message || JSON.stringify(resp.data)}`);
    }
  } catch (err: any) {
    // Log safe debug info (do not print secrets)
    console.error('Cloudinary destroy error', {
      message: err.message,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    throw new Error(err?.response?.data?.error?.message || err.message || 'Failed to contact Cloudinary');
  }
}
