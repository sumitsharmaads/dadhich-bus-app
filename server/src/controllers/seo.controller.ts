import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/apiResponse';
import { seoRepository } from '../repositories/seo.repository';

export const listSeo = asyncHandler(async (_req: Request, res: Response) => {
  const docs = await seoRepository.list();
  sendSuccess(res, docs, 'SEO entries');
});

export const getSeoById = asyncHandler(async (req: Request, res: Response) => {
  const doc = await seoRepository.getById(req.params.id);
  sendSuccess(res, doc, 'SEO fetched');
});

export const getSeoByRoute = asyncHandler(async (req: Request, res: Response) => {
  const { routePath } = req.query as { routePath: string };
  const doc = await seoRepository.getByRoute(routePath);
  sendSuccess(res, doc, 'SEO by route fetched');
});

export const createSeo = asyncHandler(async (req: Request, res: Response) => {
  const created = await seoRepository.create(req.body);
  sendCreated(res, created, 'SEO created');
});

export const updateSeo = asyncHandler(async (req: Request, res: Response) => {
  const updated = await seoRepository.update(req.params.id, req.body);
  sendSuccess(res, updated, 'SEO updated');
});

export const deleteSeo = asyncHandler(async (req: Request, res: Response) => {
  await seoRepository.remove(req.params.id);
  sendNoContent(res);
});
