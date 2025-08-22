import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/apiResponse';
import { busRepository } from '../repositories/bus.repository';

export const createBus = asyncHandler(async (req: Request, res: Response) => {
  const created = await busRepository.create(req.body);
  sendCreated(res, created, 'Bus created successfully');
});

export const updateBus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await busRepository.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Bus not found' });
  }
  sendSuccess(res, updated, 'Bus updated successfully');
});

export const deleteBus = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await busRepository.softDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Bus not found' });
  }
  sendNoContent(res);
});

export const getBusById = asyncHandler(async (req: Request, res: Response) => {
  const bus = await busRepository.getById(req.params.id);
  if (!bus) {
    return res.status(404).json({ success: false, message: 'Bus not found' });
  }
  sendSuccess(res, bus, 'Bus details retrieved');
});

export const listBusesAdmin = asyncHandler(async (req: Request, res: Response) => {
  const result = await busRepository.adminList(req.query);
  const totalCount = await busRepository.getTotalCount(req.query);

  sendSuccess(
    res,
    {
      buses: result,
      pagination: {
        page: Number(req.query.page) || 1,
        items: Number(req.query.items) || 20,
        total: totalCount,
        totalPages: Math.ceil(totalCount / (Number(req.query.items) || 20)),
      },
    },
    'Buses retrieved successfully',
  );
});

export const getBusStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await busRepository.getBusStats();
  sendSuccess(res, stats, 'Bus statistics retrieved');
});

export const bulkUpdateBuses = asyncHandler(async (req: Request, res: Response) => {
  const { busIds, updates } = req.body;
  const results = await busRepository.bulkUpdate(busIds, updates);
  sendSuccess(res, results, 'Buses updated in bulk');
});

export const bulkDeleteBuses = asyncHandler(async (req: Request, res: Response) => {
  const { busIds } = req.body;
  const results = await busRepository.bulkDelete(busIds);
  sendSuccess(res, results, 'Buses deleted in bulk');
});

export const updateBusStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const updated = await busRepository.updateStatus(id, isActive);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Bus not found' });
  }
  sendSuccess(res, updated, 'Bus status updated successfully');
});

export const getBusSeatLayout = asyncHandler(async (req: Request, res: Response) => {
  const bus = await busRepository.getById(req.params.id);
  if (!bus) {
    return res.status(404).json({ success: false, message: 'Bus not found' });
  }
  sendSuccess(res, bus.seatLayout, 'Bus seat layout retrieved');
});

export const updateBusSeatLayout = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { seatLayout } = req.body;
  const updated = await busRepository.updateSeatLayout(id, seatLayout);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Bus not found' });
  }
  sendSuccess(res, updated, 'Bus seat layout updated successfully');
});
