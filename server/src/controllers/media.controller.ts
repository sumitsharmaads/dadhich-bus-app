import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess, sendError } from '../utils/apiResponse';
import { deleteByPublicId, renamePublicId, uploadBuffer, uploadMany } from '../lib/cloudinary';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;

  if (!file) {
    return sendError(res, {
      statusCode: 400,
      message: 'No image file provided',
    });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return sendError(res, {
      statusCode: 400,
      message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed',
    });
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return sendError(res, {
      statusCode: 400,
      message: 'File size too large. Maximum size is 10MB',
    });
  }

  const folder = (req.body?.folder as string) || 'general';

  try {
    const result = await uploadBuffer(file.buffer, folder);

    // Enhanced response with additional metadata
    const response = {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      folder: folder,
    };

    sendCreated(res, response, 'Image uploaded successfully');
  } catch (error) {
    console.error('Image upload error:', error);
    return sendError(res, {
      statusCode: 500,
      message: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req as any).files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    return sendError(res, {
      statusCode: 400,
      message: 'No image files provided',
    });
  }

  if (files.length > 10) {
    return sendError(res, {
      statusCode: 400,
      message: 'Too many files. Maximum 10 images can be uploaded at once',
    });
  }

  // Validate each file
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  for (const file of files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return sendError(res, {
        statusCode: 400,
        message: `Invalid file type for ${file.originalname}. Only JPEG, PNG, GIF, and WebP images are allowed`,
      });
    }

    if (file.size > maxSize) {
      return sendError(res, {
        statusCode: 400,
        message: `File ${file.originalname} is too large. Maximum size is 10MB`,
      });
    }
  }

  const folder = (req.body?.folder as string) || 'general';

  try {
    const buffers = files.map((f) => f.buffer);
    const results = await uploadMany(buffers, folder);

    // Enhanced response with additional metadata
    const enhancedResults = results.map((result) => ({
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      folder: folder,
    }));

    sendCreated(
      res,
      {
        count: enhancedResults.length,
        results: enhancedResults,
      },
      'Images uploaded successfully',
    );
  } catch (error) {
    console.error('Multiple images upload error:', error);
    return sendError(res, {
      statusCode: 500,
      message: `Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.body as { publicId: string };

  if (!publicId || typeof publicId !== 'string') {
    return sendError(res, {
      statusCode: 400,
      message: 'Valid publicId is required',
    });
  }

  try {
    const ok = await deleteByPublicId(publicId);
    sendSuccess(res, { ok }, ok ? 'Image deleted successfully' : 'Image not found');
  } catch (error) {
    console.error('Image deletion error:', error);
    return sendError(res, {
      statusCode: 500,
      message: `Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

export const renameImage = asyncHandler(async (req: Request, res: Response) => {
  const { fromPublicId, toPublicId } = req.body as { fromPublicId: string; toPublicId: string };

  if (
    !fromPublicId ||
    !toPublicId ||
    typeof fromPublicId !== 'string' ||
    typeof toPublicId !== 'string'
  ) {
    return sendError(res, {
      statusCode: 400,
      message: 'Both fromPublicId and toPublicId are required as strings',
    });
  }

  try {
    const result = await renamePublicId(fromPublicId, toPublicId);
    sendSuccess(res, result, 'Image renamed successfully');
  } catch (error) {
    console.error('Image rename error:', error);
    return sendError(res, {
      statusCode: 500,
      message: `Failed to rename image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});
