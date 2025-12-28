import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteImages(publicIds: string[]): Promise<{ id: string, ok: boolean, error?: string }[]> {
  const results = [];
  for (const id of publicIds) {
    try {
      const res = await cloudinary.uploader.destroy(id);
      if (res.result === 'ok' || res.result === 'not_found') {
        results.push({ id, ok: true });
      } else {
        results.push({ id, ok: false, error: res.result });
      }
    } catch (err: any) {
      results.push({ id, ok: false, error: err.message });
    }
  }
  return results;
}
