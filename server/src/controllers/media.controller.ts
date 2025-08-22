import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { deleteByPublicId, renamePublicId, uploadBuffer, uploadMany } from '../lib/cloudinary';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) throw new Error('No file provided');
  const folder = (req.body?.folder as string) || undefined;
  const result = await uploadBuffer(file.buffer, folder);
  sendCreated(res, result, 'Image uploaded');
});

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req as any).files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) throw new Error('No files provided');
  const folder = (req.body?.folder as string) || undefined;
  const buffers = files.map((f) => f.buffer);
  const results = await uploadMany(buffers, folder);
  sendCreated(res, { count: results.length, results }, 'Images uploaded');
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.body as { publicId: string };
  if (!publicId) throw new Error('publicId required');
  const ok = await deleteByPublicId(publicId);
  sendSuccess(res, { ok }, ok ? 'Image deleted' : 'Image not found');
});

export const renameImage = asyncHandler(async (req: Request, res: Response) => {
  const { fromPublicId, toPublicId } = req.body as { fromPublicId: string; toPublicId: string };
  if (!fromPublicId || !toPublicId) throw new Error('fromPublicId/toPublicId required');
  const result = await renamePublicId(fromPublicId, toPublicId);
  sendSuccess(res, result, 'Image renamed');
});
