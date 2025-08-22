import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/apiResponse';
import { placeRepository } from '../repositories/place.repository';

// Country
export const createCountry = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.createCountry(req.body);
  sendCreated(res, doc, 'Country created');
});
export const updateCountry = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.updateCountry(req.params.id, req.body);
  sendSuccess(res, doc, 'Country updated');
});
export const deleteCountry = asyncHandler(async (req: Request, res: Response) => {
  await placeRepository.deleteCountry(req.params.id);
  sendNoContent(res);
});
export const getCountry = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.getCountry(req.params.id);
  sendSuccess(res, doc, 'Country fetched');
});
export const listCountries = asyncHandler(async (_req: Request, res: Response) => {
  const docs = await placeRepository.listCountries();
  sendSuccess(res, docs, 'Countries');
});

// State
export const createState = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.createState(req.body);
  sendCreated(res, doc, 'State created');
});
export const updateState = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.updateState(req.params.id, req.body);
  sendSuccess(res, doc, 'State updated');
});
export const deleteState = asyncHandler(async (req: Request, res: Response) => {
  await placeRepository.deleteState(req.params.id);
  sendNoContent(res);
});
export const getState = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.getState(req.params.id);
  sendSuccess(res, doc, 'State fetched');
});
export const listStates = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.query.countryId ? { countryId: req.query.countryId } : {};
  const docs = await placeRepository.listStates(filter as any);
  sendSuccess(res, docs, 'States');
});

// City
export const createCity = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.createCity(req.body);
  sendCreated(res, doc, 'City created');
});
export const updateCity = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.updateCity(req.params.id, req.body);
  sendSuccess(res, doc, 'City updated');
});
export const deleteCity = asyncHandler(async (req: Request, res: Response) => {
  await placeRepository.deleteCity(req.params.id);
  sendNoContent(res);
});
export const getCity = asyncHandler(async (req: Request, res: Response) => {
  const doc = await placeRepository.getCity(req.params.id);
  sendSuccess(res, doc, 'City fetched');
});
export const listCities = asyncHandler(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.query.countryId) filter.countryId = req.query.countryId;
  if (req.query.stateId) filter.stateId = req.query.stateId;
  const docs = await placeRepository.listCities(filter);
  sendSuccess(res, docs, 'Cities');
});
