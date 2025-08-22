import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/apiResponse';
import { termsRepository } from '../repositories/terms.repository';

export const listTerms = asyncHandler(async (_req: Request, res: Response) => {
  const items = await termsRepository.list();
  sendSuccess(res, items, 'Terms list fetched');
});

export const getTermsById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await termsRepository.getById(id);
  sendSuccess(res, item, 'Terms fetched');
});

export const getCurrentTerms = asyncHandler(async (_req: Request, res: Response) => {
  const item = await termsRepository.getCurrent();
  sendSuccess(res, item, 'Current terms fetched');
});

export const createTerms = asyncHandler(async (req: Request, res: Response) => {
  const created = await termsRepository.create(req.body);
  sendCreated(res, created, 'Terms created');
});

export const updateTerms = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await termsRepository.update(id, req.body);
  sendSuccess(res, updated, 'Terms updated');
});

export const deleteTerms = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await termsRepository.remove(id);
  sendNoContent(res);
});
