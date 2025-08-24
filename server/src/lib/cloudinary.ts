import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadBuffer(buffer: Buffer, folder?: string) {
  return new Promise<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  }>((resolve, reject) => {
    if (!buffer || buffer.length === 0) {
      reject(new Error('Invalid buffer: Buffer is empty or undefined'));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
      },
      (err, result) => {
        if (err) {
          reject(new Error(`Cloudinary upload failed: ${err.message}`));
          return;
        }
        if (!result) {
          reject(new Error('Cloudinary upload failed: No result returned'));
          return;
        }

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url as string,
          width: result.width || 0,
          height: result.height || 0,
          format: result.format || '',
          bytes: result.bytes || 0,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

export async function uploadMany(buffers: Buffer[], folder?: string) {
  if (!buffers || buffers.length === 0) {
    throw new Error('No buffers provided for upload');
  }

  if (buffers.length > 10) {
    throw new Error('Maximum 10 images can be uploaded at once');
  }

  const results = [] as Array<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  }>;

  // Use Promise.all for concurrent uploads (better performance)
  const uploadPromises = buffers.map((buffer) => uploadBuffer(buffer, folder));

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(
      `Batch upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function deleteByPublicId(publicId: string) {
  if (!publicId || typeof publicId !== 'string') {
    throw new Error('Invalid public ID provided');
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    return res.result === 'ok' || res.result === 'not found';
  } catch (error) {
    throw new Error(
      `Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function renamePublicId(fromPublicId: string, toPublicId: string) {
  if (!fromPublicId || !toPublicId) {
    throw new Error('Both fromPublicId and toPublicId are required');
  }

  try {
    const res = await cloudinary.uploader.rename(fromPublicId, toPublicId, { overwrite: true });
    return {
      public_id: res.public_id,
      secure_url: res.secure_url as string,
    };
  } catch (error) {
    throw new Error(
      `Failed to rename image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
