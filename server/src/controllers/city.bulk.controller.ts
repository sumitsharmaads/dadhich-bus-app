import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as XLSX from 'xlsx';
import { Country } from '../models/country.model';
import { State } from '../models/state.model';
import { City } from '../models/city.model';

function toBool(v: any): boolean | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  const s = String(v).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

function slugify(str: string): string {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const bulkUploadCities = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const results: { row: number; status: 'ok' | 'error'; message?: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2; // account for header
    const r = rows[i];
    try {
      const countryCode = String(r.countryCode || '').toUpperCase();
      const stateName = String(r.stateName || '').trim();
      const cityName = String(r.cityName || '').trim();
      if (!countryCode || !stateName || !cityName) {
        results.push({ row: rowNum, status: 'error', message: 'Missing required fields' });
        continue;
      }
      const country = await Country.findOne({ code: countryCode, isDeleted: false }).exec();
      if (!country) {
        results.push({
          row: rowNum,
          status: 'error',
          message: `Country not found: ${countryCode}`,
        });
        continue;
      }
      const state = await State.findOne({
        name: stateName,
        countryId: country._id,
        isDeleted: false,
      }).exec();
      if (!state) {
        results.push({ row: rowNum, status: 'error', message: `State not found: ${stateName}` });
        continue;
      }
      const citySlug = String(r.citySlug || slugify(cityName));
      const lat = r.lat !== '' ? Number(r.lat) : undefined;
      const lng = r.lng !== '' ? Number(r.lng) : undefined;
      const isPublished = toBool(r.isPublished);

      const cityData: any = {
        name: cityName,
        slug: citySlug,
        countryId: country._id,
        stateId: state._id,
        isPublished: isPublished ?? true,
      };
      if (lat !== undefined && lng !== undefined) {
        cityData.location = { type: 'Point', coordinates: [lng, lat] };
      }

      if (r.description)
        cityData.content = { ...(cityData.content || {}), description: String(r.description) };
      if (r.longDescription)
        cityData.content = {
          ...(cityData.content || {}),
          longDescription: String(r.longDescription),
        };
      if (r.tags)
        cityData.content = {
          ...(cityData.content || {}),
          tags: String(r.tags)
            .split(';')
            .map((s: string) => s.trim())
            .filter(Boolean),
        };
      if (r.categories)
        cityData.content = {
          ...(cityData.content || {}),
          categories: String(r.categories)
            .split(';')
            .map((s: string) => s.trim())
            .filter(Boolean),
        };
      if (r.bestTime)
        cityData.visitInfo = { ...(cityData.visitInfo || {}), bestTime: String(r.bestTime) };
      if (r.averageVisitDurationMins)
        cityData.visitInfo = {
          ...(cityData.visitInfo || {}),
          averageVisitDurationMins: Number(r.averageVisitDurationMins),
        };

      const existing = await City.findOne({
        stateId: state._id,
        slug: citySlug,
        isDeleted: false,
      }).exec();
      if (existing) {
        // update
        await City.updateOne({ _id: existing._id }, { $set: cityData }).exec();
        results.push({ row: rowNum, status: 'ok', message: 'Updated' });
      } else {
        await City.create(cityData);
        results.push({ row: rowNum, status: 'ok', message: 'Created' });
      }
    } catch (err: any) {
      results.push({ row: rowNum, status: 'error', message: err?.message || 'Unknown error' });
    }
  }

  res.json({ success: true, message: 'Processed', results });
});

export const downloadCityBulkTemplate = asyncHandler(async (_req: Request, res: Response) => {
  const headers = [
    'countryCode',
    'stateName',
    'cityName',
    'citySlug',
    'lat',
    'lng',
    'isPublished',
    'description',
    'longDescription',
    'tags',
    'categories',
    'bestTime',
    'averageVisitDurationMins',
  ];

  const sample = [
    [
      'IN',
      'Rajasthan',
      'Jaipur',
      'jaipur',
      '26.9124',
      '75.7873',
      'true',
      'Heritage city',
      'Long description here',
      'heritage;pink city',
      'tourism;india',
      'Oct-Mar',
      '180',
    ],
  ];

  const aoa = [headers, ...sample];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(wb, ws, 'cities');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', 'attachment; filename="city_bulk_template.xlsx"');
  res.send(buf);
});
