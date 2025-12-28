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


