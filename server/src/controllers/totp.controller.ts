import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { TotpSecret } from '../models/totp.model';
import { aesGcmDecrypt, aesGcmEncrypt } from '../lib/crypto';
import mongoose from 'mongoose';

export const totpEnroll = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const userId = new mongoose.Types.ObjectId(session.userId);
  const existing = await TotpSecret.findOne({ userId }).exec();
  let secret: string;
  if (existing) {
    secret = aesGcmDecrypt(existing.secretEnc, existing.iv, existing.tag);
  } else {
    secret = authenticator.generateSecret();
    const enc = aesGcmEncrypt(secret);
    await TotpSecret.create({
      userId,
      secretEnc: enc.ciphertext,
      iv: enc.iv,
      tag: enc.tag,
      enabled: false,
    });
  }

  const label = encodeURIComponent(String(userId));
  const issuer = encodeURIComponent('Dadhich Tours');
  const otpauth = authenticator.keyuri(label, issuer, secret);
  const qr = await qrcode.toDataURL(otpauth);

  res.json({ success: true, data: { otpauth, qr } });
});

export const totpEnable = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { token } = req.body as { token: string };
  const userId = new mongoose.Types.ObjectId(session.userId);
  const rec = await TotpSecret.findOne({ userId }).exec();
  if (!rec) return res.status(400).json({ success: false, message: 'No enrollment in progress' });
  const secret = aesGcmDecrypt(rec.secretEnc, rec.iv, rec.tag);

  const valid = authenticator.verify({ token, secret });
  if (!valid) return res.status(400).json({ success: false, message: 'Invalid token' });

  rec.enabled = true;
  await rec.save();

  res.json({ success: true, message: 'TOTP enabled' });
});

export const totpDisable = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const userId = new mongoose.Types.ObjectId(session.userId);
  await TotpSecret.deleteOne({ userId }).exec();

  res.json({ success: true, message: 'TOTP disabled' });
});

export const totpStepUp = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { token } = req.body as { token: string };
  const userId = new mongoose.Types.ObjectId(session.userId);
  const rec = await TotpSecret.findOne({ userId, enabled: true }).exec();
  if (!rec) return res.status(400).json({ success: false, message: 'TOTP not enabled' });
  const secret = aesGcmDecrypt(rec.secretEnc, rec.iv, rec.tag);

  const valid = authenticator.verify({ token, secret });
  if (!valid) return res.status(400).json({ success: false, message: 'Invalid token' });

  session.stepUpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await session.save();
  res.json({ success: true, message: 'Step-up granted via TOTP' });
});
