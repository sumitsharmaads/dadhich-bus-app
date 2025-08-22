import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { websiteRepository } from '../repositories/website.repository';
import { buildBrandedHtml, renderTemplate, sendBrandedMail } from '../lib/mailer';
import { sendCreated } from '../utils/apiResponse';

function getInfoEmails(website: any): string[] {
  const list = website?.contact?.emails?.infoEmails || [];
  const support = website?.contact?.emails?.supportEmail
    ? [website.contact.emails.supportEmail]
    : [];
  return [...list, ...support].filter(Boolean);
}

export const inquiryEmail = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { email, name, subject, message } = req.body as any;
  const data = { email, name, subject, message, website };
  const htmlTpl =
    (await renderTemplate('inquery_template.html', data)) ||
    buildBrandedHtml(
      website,
      `Inquiry: ${subject}`,
      `<p style="margin:0 0 12px">New inquiry submitted from the website.</p>
       <p style="margin:0 0 8px"><strong>Name:</strong> ${name}</p>
       <p style="margin:0 0 8px"><strong>Email:</strong> ${email}</p>
       <p style="margin:0 0 8px"><strong>Subject:</strong> ${subject}</p>
       <p style="white-space:pre-wrap;margin:12px 0 0">${message}</p>`,
    );
  await sendBrandedMail(website, `Inquiry: ${subject}`, htmlTpl, to);
  sendCreated(res, { ok: true }, 'Inquiry email sent');
});

export const contactUs = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { name, email, phone, message } = req.body as any;
  const data = { name, email, phone, message, website };
  const htmlTpl =
    (await renderTemplate('contact_template.html', data)) ||
    buildBrandedHtml(
      website,
      'Contact Us',
      `<p style="margin:0 0 12px">A visitor submitted the contact form.</p>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone || '-'}</p>
       <p style="white-space:pre-wrap;margin:12px 0 0">${message}</p>`,
    );
  await sendBrandedMail(website, 'Contact Us', htmlTpl, to);
  sendCreated(res, { ok: true }, 'Contact submitted');
});

export const localBusRental = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { name, email, phone, city, date, hours, passengers, notes } = req.body as any;
  const data = { name, email, phone, city, date, hours, passengers, notes, website };
  const htmlTpl =
    (await renderTemplate('local_bus_rental_template.html', data)) ||
    buildBrandedHtml(
      website,
      'Local Bus Rental Inquiry',
      `<p>Local rental inquiry</p>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>City:</strong> ${city}</p>
       <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
       <p><strong>Hours:</strong> ${hours}</p>
       <p><strong>Passengers:</strong> ${passengers}</p>
       <p style="white-space:pre-wrap;margin:12px 0 0">${notes || ''}</p>`,
    );
  await sendBrandedMail(website, 'Local Bus Rental Inquiry', htmlTpl, to);
  sendCreated(res, { ok: true }, 'Local rental inquiry sent');
});

export const outstationBusRental = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { name, email, phone, fromCity, toCity, startDate, endDate, passengers, notes } =
    req.body as any;
  const data = {
    name,
    email,
    phone,
    fromCity,
    toCity,
    startDate,
    endDate,
    passengers,
    notes,
    website,
  };
  const htmlTpl =
    (await renderTemplate('outstation_bus_rental_template.html', data)) ||
    buildBrandedHtml(
      website,
      'Outstation Bus Rental Inquiry',
      `<p>Outstation rental inquiry</p>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Route:</strong> ${fromCity} → ${toCity}</p>
       <p><strong>Dates:</strong> ${new Date(startDate).toDateString()} - ${new Date(
         endDate,
       ).toDateString()}</p>
       <p><strong>Passengers:</strong> ${passengers}</p>
       <p style="white-space:pre-wrap;margin:12px 0 0">${notes || ''}</p>`,
    );
  await sendBrandedMail(website, 'Outstation Bus Rental Inquiry', htmlTpl, to);
  sendCreated(res, { ok: true }, 'Outstation rental inquiry sent');
});

export const tourInquiry = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { name, email, phone, tourId, tourName, route, approxDate, passengers, message } =
    req.body as any;
  const data = {
    name,
    email,
    phone,
    tourId,
    tourName,
    route,
    approxDate,
    passengers,
    message,
    website,
  };
  const htmlTpl =
    (await renderTemplate('tour_inquiry_template.html', data)) ||
    buildBrandedHtml(
      website,
      'Tour Inquiry',
      `<p>Tour inquiry</p>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone || '-'}</p>
       <p><strong>Tour ID:</strong> ${tourId || '-'}</p>
       <p><strong>Tour:</strong> ${tourName}</p>
       <p><strong>Route:</strong> <a href="${route || '#'}">${route || '-'}</a></p>
       <p><strong>Approx Date:</strong> ${approxDate ? new Date(approxDate).toDateString() : '-'}</p>
       <p><strong>Passengers:</strong> ${passengers || '-'}</p>
       <p style="white-space:pre-wrap;margin:12px 0 0">${message || ''}</p>`,
    );
  await sendBrandedMail(website, 'Tour Inquiry', htmlTpl, to);
  sendCreated(res, { ok: true }, 'Tour inquiry sent');
});

export const planTourHelp = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { name, email, phone, fromCity, toCity, days, budget, preferences } = req.body as any;
  const data = { name, email, phone, fromCity, toCity, days, budget, preferences, website };
  const htmlTpl =
    (await renderTemplate('plan_tour_help_template.html', data)) ||
    buildBrandedHtml(
      website,
      'Help Plan Tour',
      `<p>Help me plan a tour</p>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Route:</strong> ${fromCity} → ${toCity}</p>
       <p><strong>Days:</strong> ${days}</p>
       <p><strong>Budget:</strong> ${budget || '-'}</p>
       <p><strong>Preferences:</strong> ${(preferences || []).join(', ')}</p>`,
    );
  await sendBrandedMail(website, 'Help Plan Tour', htmlTpl, to);
  sendCreated(res, { ok: true }, 'Plan tour inquiry sent');
});

export const quickConnect = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { name, email, phone, preferredTime, message } = req.body as any;
  const data = { name, email, phone, preferredTime, message, website };
  const htmlTpl =
    (await renderTemplate('quick_connect_template.html', data)) ||
    buildBrandedHtml(
      website,
      'Quick Connect',
      `<p>Quick connect request</p>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email || '-'}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Preferred Time:</strong> ${preferredTime || '-'}</p>
       <p style="white-space:pre-wrap;margin:12px 0 0">${message || ''}</p>`,
    );
  await sendBrandedMail(website, 'Quick Connect', htmlTpl, to);
  sendCreated(res, { ok: true }, 'Quick connect sent');
});

export const customTourPlanning = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { name, email, phone, from, departureDate, days, adults, children, message } =
    req.body as any;
  const data = {
    name,
    email,
    phone,
    from,
    departureDate,
    days,
    adults,
    children,
    message,
    website,
  };

  const htmlTpl =
    (await renderTemplate('custom_tour_planning_template.html', data)) ||
    buildBrandedHtml(
      website,
      'Custom Tour Planning Request',
      `<p><strong>Custom Tour Planning Request</strong></p>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email || '-'}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Travelling From:</strong> ${from}</p>
       <p><strong>Departure Date:</strong> ${departureDate || '-'}</p>
       <p><strong>Duration:</strong> ${days ? `${days} days` : '-'}</p>
       <p><strong>Adults:</strong> ${adults || '-'}</p>
       <p><strong>Children:</strong> ${children || '-'}</p>
       <p><strong>Special Requests:</strong> ${message || '-'}</p>`,
    );
  await sendBrandedMail(website, 'Custom Tour Planning Request', htmlTpl, to);
  sendCreated(res, { ok: true }, 'Custom tour planning request sent');
});

export const helpWidget = asyncHandler(async (req: Request, res: Response) => {
  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  if (!website) throw new Error('Website not configured');
  const to = getInfoEmails(website);
  if (to.length === 0) throw new Error('Recipient list is empty');

  const { name, email, phone, adults, children, destination } = req.body as any;
  const data = {
    name,
    email,
    phone,
    adults,
    children,
    destination,
    website,
  };

  const htmlTpl =
    (await renderTemplate('help_widget_template.html', data)) ||
    buildBrandedHtml(
      website,
      'Help Widget Inquiry',
      `<p><strong>Help Widget Inquiry</strong></p>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Adults:</strong> ${adults}</p>
       <p><strong>Children:</strong> ${children}</p>
       <p><strong>Preferred Destination:</strong> ${destination || '-'}</p>`,
    );
  await sendBrandedMail(website, 'Help Widget Inquiry', htmlTpl, to);
  sendCreated(res, { ok: true }, 'Help widget inquiry sent');
});
