import { z } from 'zod';

export const inquiryEmailSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export const contactUsSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5).optional(),
  message: z.string().min(10),
});

export const localBusRentalSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  city: z.string().min(2),
  date: z.coerce.date(),
  hours: z.coerce.number().int().positive(),
  passengers: z.coerce.number().int().positive(),
  notes: z.string().optional(),
});

export const outstationBusRentalSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  fromCity: z.string().min(2),
  toCity: z.string().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  passengers: z.coerce.number().int().positive(),
  notes: z.string().optional(),
});

export const tourInquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5).optional(),
  tourId: z.string().min(1),
  tourName: z.string().min(2),
  route: z.string().min(1),
  approxDate: z.coerce.date().optional(),
  passengers: z.coerce.number().int().positive().optional(),
  message: z.string().min(5).optional(),
});

export const planTourHelpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  fromCity: z.string().min(2),
  toCity: z.string().min(2),
  days: z.coerce.number().int().positive(),
  budget: z.coerce.number().positive().optional(),
  preferences: z.array(z.string()).optional(),
});

export const quickConnectSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(5),
  preferredTime: z.string().optional(),
  message: z.string().min(5).optional(),
});

export const customTourPlanningSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(5),
  from: z.string().min(2),
  departureDate: z.string().optional(),
  days: z.string().optional(),
  adults: z.string().optional(),
  children: z.string().optional(),
  message: z.string().optional(),
});

export const helpWidgetSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  adults: z.string().min(1),
  children: z.string().min(0),
  destination: z.string().optional(),
});
