import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/apiResponse';
import { tourRepository } from '../repositories/tour.repository';

// Admin
export const createTour = asyncHandler(async (req: Request, res: Response) => {
  const created = await tourRepository.create(req.body);
  sendCreated(res, created, 'Tour created');
});

export const updateTour = asyncHandler(async (req: Request, res: Response) => {
  const updated = await tourRepository.update(req.params.id, req.body);
  sendSuccess(res, updated, 'Tour updated');
});

export const publishTour = asyncHandler(async (req: Request, res: Response) => {
  const updated = await tourRepository.setStatus(req.params.id, 'published');
  sendSuccess(res, updated, 'Tour published');
});

export const draftTour = asyncHandler(async (req: Request, res: Response) => {
  const updated = await tourRepository.setStatus(req.params.id, 'draft');
  sendSuccess(res, updated, 'Tour moved to draft');
});

export const deleteTour = asyncHandler(async (req: Request, res: Response) => {
  await tourRepository.softDelete(req.params.id);
  sendNoContent(res);
});

export const listToursAdmin = asyncHandler(async (req: Request, res: Response) => {
  const result = await tourRepository.adminList(req.query);
  sendSuccess(res, result, 'Tours admin list');
});

// Get tour by ID for admin
export const getTourById = asyncHandler(async (req: Request, res: Response) => {
  const tour = await tourRepository.getById(req.params.id);
  sendSuccess(res, tour, 'Tour details');
});

// Toggle tour active status
export const toggleTourActive = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.body;
  const updated = await tourRepository.toggleActive(req.params.id, isActive);
  sendSuccess(res, updated, `Tour ${isActive ? 'activated' : 'deactivated'}`);
});

// Get admin tour statistics
export const getAdminTourStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await tourRepository.adminStats();
  sendSuccess(res, stats, 'Tour statistics');
});

// Bulk operations
export const bulkPublishTours = asyncHandler(async (req: Request, res: Response) => {
  const { tourIds } = req.body;
  const result = await tourRepository.bulkSetStatus(tourIds, 'published');
  sendSuccess(res, result, 'Tours published in bulk');
});

export const bulkDraftTours = asyncHandler(async (req: Request, res: Response) => {
  const { tourIds } = req.body;
  const result = await tourRepository.bulkSetStatus(tourIds, 'draft');
  sendSuccess(res, result, 'Tours moved to draft in bulk');
});

export const bulkDeleteTours = asyncHandler(async (req: Request, res: Response) => {
  const { tourIds } = req.body;
  const result = await tourRepository.bulkSoftDelete(tourIds);
  sendSuccess(res, result, 'Tours deleted in bulk');
});

// Export tours
export const exportTours = asyncHandler(async (req: Request, res: Response) => {
  const { format, filters } = req.body;
  const result = await tourRepository.exportTours(format, filters);
  sendSuccess(res, result, 'Tours exported successfully');
});

// Import tours
export const importTours = asyncHandler(async (req: Request, res: Response) => {
  const result = await tourRepository.importTours(req.file);
  sendSuccess(res, result, 'Tours imported successfully');
});

// Public
export const listToursPublic = asyncHandler(async (req: Request, res: Response) => {
  const result = await tourRepository.searchPublic(req.query);
  sendSuccess(res, result, 'Tours');
});

export const getTourPublic = asyncHandler(async (req: Request, res: Response) => {
  const doc = await tourRepository.getPublicById(req.params.id);
  sendSuccess(res, doc, 'Tour details');
});

export const upcomingTours = asyncHandler(async (_req: Request, res: Response) => {
  const docs = await tourRepository.upcoming(4);
  sendSuccess(res, docs, 'Upcoming tours');
});

export const priceRange = asyncHandler(async (_req: Request, res: Response) => {
  const range = await tourRepository.priceRange();
  sendSuccess(res, range, 'Price range');
});

export const facets = asyncHandler(async (_req: Request, res: Response) => {
  const f = await tourRepository.facets();
  sendSuccess(res, f, 'Facets');
});

export const stateBreakup = asyncHandler(async (_req: Request, res: Response) => {
  const breakup = await tourRepository.stateBreakup();
  sendSuccess(res, breakup, 'State breakup');
});

export const tourStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await tourRepository.tourStats();
  sendSuccess(res, stats, 'Tour statistics');
});

// Get available buses for tour assignment
export const getAvailableBuses = asyncHandler(async (_req: Request, res: Response) => {
  const buses = await tourRepository.getAvailableBuses();
  sendSuccess(res, buses, 'Available buses');
});

// Get available captains for tour assignment
export const getAvailableCaptains = asyncHandler(async (_req: Request, res: Response) => {
  const captains = await tourRepository.getAvailableCaptains();
  sendSuccess(res, captains, 'Available captains');
});

// Get tour categories
export const getTourCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await tourRepository.getTourCategories();
  sendSuccess(res, categories, 'Tour categories');
});

// Get tour types
export const getTourTypes = asyncHandler(async (_req: Request, res: Response) => {
  const types = await tourRepository.getTourTypes();
  sendSuccess(res, types, 'Tour types');
});

// Download tour template for bulk upload
export const downloadTourTemplate = asyncHandler(async (_req: Request, res: Response) => {
  const XLSX = require('xlsx');

  // Create template data structure
  const templateData = [
    {
      'Tour Name*': 'Sample Tour Name',
      Description: 'Sample tour description',
      'Duration (Days)*': '3',
      'Price (INR)*': '5000',
      'Source City*': 'Mumbai',
      'Destination City*': 'Goa',
      Category: 'Adventure',
      Type: 'Group',
      'Max Group Size': '20',
      'Min Age': '18',
      Inclusions: 'Hotel, Meals, Transport',
      Exclusions: 'Personal expenses, Tips',
      Highlights: 'Beach, Water sports, Local cuisine',
      'Itinerary Day 1': 'Arrival and check-in',
      'Itinerary Day 2': 'Sightseeing and activities',
      'Itinerary Day 3': 'Departure',
      'Terms & Conditions': 'Standard terms apply',
      'Cancellation Policy': '50% refund if cancelled 7 days before',
      Status: 'draft',
    },
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Set column widths
  const columnWidths = [
    { wch: 20 }, // Tour Name
    { wch: 30 }, // Description
    { wch: 15 }, // Duration
    { wch: 15 }, // Price
    { wch: 20 }, // Source City
    { wch: 20 }, // Destination City
    { wch: 15 }, // Category
    { wch: 15 }, // Type
    { wch: 15 }, // Max Group Size
    { wch: 15 }, // Min Age
    { wch: 30 }, // Inclusions
    { wch: 30 }, // Exclusions
    { wch: 30 }, // Highlights
    { wch: 30 }, // Itinerary Day 1
    { wch: 30 }, // Itinerary Day 2
    { wch: 30 }, // Itinerary Day 3
    { wch: 40 }, // Terms & Conditions
    { wch: 40 }, // Cancellation Policy
    { wch: 15 }, // Status
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tour Template');

  // Create buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  // Set response headers
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', 'attachment; filename="tour_bulk_template.xlsx"');

  // Send buffer
  res.send(buffer);
});
