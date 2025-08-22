import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadBuffer(buffer: Buffer, folder?: string) {
  return new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve({ public_id: result.public_id, secure_url: result.secure_url as string });
      },
    );
    uploadStream.end(buffer);
  });
}

export async function uploadMany(buffers: Buffer[], folder?: string) {
  const results = [] as { public_id: string; secure_url: string }[];
  for (const b of buffers) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await uploadBuffer(b, folder));
  }
  return results;
}

export async function deleteByPublicId(publicId: string) {
  const res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  return res.result === 'ok' || res.result === 'not found';
}

export async function renamePublicId(fromPublicId: string, toPublicId: string) {
  const res = await cloudinary.uploader.rename(fromPublicId, toPublicId, { overwrite: true });
  return { public_id: res.public_id, secure_url: res.secure_url as string };
}
