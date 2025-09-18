import nodemailer, { Transporter } from 'nodemailer';
import { env } from './env';
import { WebsiteDocument } from '../models/website.model';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporter) return transporter;
  if (!env.SMTP_HOST) throw new Error('SMTP is not configured');
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: (env.SMTP_PORT || 587) === 465,
    auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  return transporter;
}

export function buildBrandedHtml(
  website: Pick<WebsiteDocument, 'branding' | 'contact' | 'socials' | 'domains' | 'files'>,
  title: string,
  contentHtml: string,
) {
  const brand = website.branding?.brandName || 'Our Travel Co.';
  const logoUrl = website.branding?.logo?.url;
  const primaryDomain = website.domains?.primary || '';
  const supportEmail = website.contact?.emails?.supportEmail || '';
  const brochureUrl = (website as any).files?.brochureUrl || '';
  const socials = (website as any).socials || {};
  const socialsRow = Object.entries(socials)
    .filter(([, v]) => !!v)
    .map(
      ([k, v]) =>
        `<a href="${v as string}" style="color:#666;margin-right:10px;text-decoration:none">${k}</a>`,
    )
    .join('');
  const footer = `
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
    <div style="font-size:12px;color:#666">
      <div>${brand} • <a href="https://${primaryDomain}" style="color:#666;text-decoration:none">${primaryDomain}</a></div>
      <div>Support: <a href="mailto:${supportEmail}" style="color:#666">${supportEmail}</a>${brochureUrl ? ` • <a href="${brochureUrl}" style="color:#666">Brochure</a>` : ''}</div>
      <div style="margin-top:6px">${socialsRow}</div>
    </div>`;
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title></head>
   <body style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#fafafa;padding:24px;color:#111">
     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden">
       <tr><td style="padding:16px 20px;border-bottom:1px solid #eee">
         <div style="display:flex;align-items:center;gap:12px">
           ${logoUrl ? `<img src="${logoUrl}" alt="${brand}" height="28"/>` : ''}
           <strong style="font-size:16px">${brand}</strong>
         </div>
       </td></tr>
       <tr><td style="padding:20px">${contentHtml}</td></tr>
       <tr><td style="padding:16px 20px;background:#fafafa">${footer}</td></tr>
     </table>
   </body></html>`;
}

// Templates are always in server/src/views/email - NO FALLBACK
const INTERNAL_TEMPLATES_DIR = path.join(__dirname, '..', 'views', 'email');

export async function renderTemplate(
  templateFile: string,
  data: Record<string, unknown>,
): Promise<string> {
  const fullPath = path.join(INTERNAL_TEMPLATES_DIR, templateFile);

  console.log('🔍 Looking for template:', templateFile);
  console.log('📁 Template path:', fullPath);

  try {
    await fs.promises.access(fullPath, fs.constants.R_OK);
    console.log('✅ Template found at:', fullPath);
    const tpl = await fs.promises.readFile(fullPath, 'utf8');
    const rendered = ejs.render(tpl, data);
    console.log('✅ Template rendered successfully');
    return rendered;
  } catch (error) {
    console.log('❌ Template not found at:', fullPath, (error as Error).message);
    throw new Error(`Template not found: ${templateFile}`);
  }
}

export async function sendBrandedMail(
  website: Pick<WebsiteDocument, 'branding' | 'contact' | 'socials' | 'domains' | 'files'>,
  subject: string,
  html: string,
  to: string[],
) {
  const from =
    env.SMTP_FROM ||
    `${website.branding?.brandName || 'Website'} <no-reply@${website.domains.primary}>`;
  const t = getTransporter();
  await t.sendMail({
    from,
    to: to.join(','),
    subject,
    html,
    headers: {
      'X-Entity-Ref-ID': `${Date.now()}`,
      'List-Unsubscribe': `<mailto:${website.contact?.emails?.supportEmail}>`,
    },
  });
}
