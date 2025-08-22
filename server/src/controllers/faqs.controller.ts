import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/apiResponse';
import { faqsRepository } from '../repositories/faqs.repository';

export const listFAQs = asyncHandler(async (_req: Request, res: Response) => {
  const items = await faqsRepository.list();
  sendSuccess(res, items, 'FAQs list fetched');
});

export const getCurrentFAQs = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const item = await faqsRepository.getCurrent();
    if (item) {
      sendSuccess(res, item, 'Current FAQs fetched');
    } else {
      // No FAQs exist, return empty response
      res.status(200).json({
        success: true,
        data: null,
        message: 'No FAQs found',
      });
    }
  } catch (error) {
    console.error('Error getting current FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      code: 'FETCH_ERROR',
    });
  }
});

export const getFAQsCount = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const count = await faqsRepository.getCount();
    sendSuccess(res, { count }, 'FAQ count fetched');
  } catch (error) {
    console.error('Error getting FAQ count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ count',
      code: 'COUNT_ERROR',
    });
  }
});

export const initializeFAQs = asyncHandler(async (_req: Request, res: Response) => {
  try {
    // First clean up any corrupted documents
    await faqsRepository.cleanupCorruptedFAQs();

    const faqs = await faqsRepository.initializeWithDefaults();
    sendSuccess(res, faqs, 'FAQs initialized with defaults');
  } catch (error) {
    console.error('Error initializing FAQs:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to initialize FAQs',
      code: 'INIT_ERROR',
    });
  }
});

export const cleanupFAQs = asyncHandler(async (_req: Request, res: Response) => {
  try {
    await faqsRepository.cleanupCorruptedFAQs();
    res.status(200).json({
      success: true,
      message: 'FAQ cleanup completed',
      code: 'CLEANUP_SUCCESS',
    });
  } catch (error) {
    console.error('Error cleaning up FAQs:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to cleanup FAQs',
      code: 'CLEANUP_ERROR',
    });
  }
});

export const getFAQsById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await faqsRepository.getById(id);
  sendSuccess(res, item, 'FAQ fetched');
});

export const createFAQs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const created = await faqsRepository.create(req.body);
    sendCreated(res, created, 'FAQs created');
  } catch (error) {
    console.error('Error creating FAQs:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create FAQs',
      code: 'CREATE_ERROR',
    });
  }
});

export const updateFAQs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await faqsRepository.update(id, req.body);
  sendSuccess(res, updated, 'FAQs updated');
});

export const updateCurrentFAQs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const updated = await faqsRepository.updateCurrent(req.body);
    if (updated) {
      sendSuccess(res, updated, 'Current FAQs updated');
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update FAQs',
        code: 'UPDATE_FAILED',
      });
    }
  } catch (error) {
    console.error('Error updating current FAQs:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update FAQs',
      code: 'UPDATE_ERROR',
    });
  }
});

export const deleteFAQs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await faqsRepository.remove(id);
  sendNoContent(res);
});
