import { Request, Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { WebAuthnCredential } from '../models/webauthn.model';
import { asyncHandler } from '../utils/asyncHandler';

const rpName = 'Dadhich Tours';
const rpID = process.env.RP_ID || 'localhost';
const origin = process.env.RP_ORIGIN || 'http://localhost:3000';

export const webauthnGenerateRegistrationOptions = asyncHandler(
  async (req: Request, res: Response) => {
    const session = (req as any).session;
    if (!session?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const existing = await WebAuthnCredential.find({ userId: session.userId }).lean();

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: session.userId.toString(),
      attestationType: 'none',
      excludeCredentials: existing.map((c) => ({
        id: c.credentialId,
        type: 'public-key' as const,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
      supportedAlgorithmIDs: [-7, -257],
    });

    session.webauthnChallenge = options.challenge;
    session.webauthnChallengeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await session.save();

    res.json({ success: true, data: options, origin });
  },
);

export const webauthnVerifyRegistration = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const body = req.body;
  const expectedChallenge = session.webauthnChallenge;
  if (
    !expectedChallenge ||
    (session.webauthnChallengeExpiresAt && session.webauthnChallengeExpiresAt < new Date())
  ) {
    return res.status(400).json({ success: false, message: 'Challenge expired' });
  }

  const verification = await verifyRegistrationResponse({
    response: body as any,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  } as any);

  if (!verification.verified || !verification.registrationInfo) {
    return res.status(400).json({ success: false, message: 'Verification failed' });
  }

  const info: any = verification.registrationInfo as any;
  const cred = info.credential ?? info;
  await WebAuthnCredential.create({
    userId: session.userId,
    credentialId: Buffer.from(cred.credentialID || cred.id).toString('base64url'),
    publicKey: Buffer.from(cred.credentialPublicKey || cred.publicKey).toString('base64url'),
    counter: cred.counter || 0,
    deviceType: info.credentialDeviceType,
    backedUp: info.credentialBackedUp,
  });

  session.webauthnChallenge = undefined;
  session.webauthnChallengeExpiresAt = undefined;
  await session.save();

  res.json({ success: true, message: 'WebAuthn authenticator registered' });
});

export const webauthnGenerateAuthenticationOptions = asyncHandler(
  async (req: Request, res: Response) => {
    const session = (req as any).session;
    if (!session?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const creds = await WebAuthnCredential.find({ userId: session.userId }).lean();
    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: creds.map((c) => ({ id: c.credentialId, type: 'public-key' as const })),
      userVerification: 'preferred',
    });

    session.webauthnChallenge = options.challenge;
    session.webauthnChallengeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await session.save();

    res.json({ success: true, data: options, origin });
  },
);

export const webauthnVerifyAuthentication = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const body = req.body;
  const expectedChallenge = session.webauthnChallenge;
  if (
    !expectedChallenge ||
    (session.webauthnChallengeExpiresAt && session.webauthnChallengeExpiresAt < new Date())
  ) {
    return res.status(400).json({ success: false, message: 'Challenge expired' });
  }

  const dbCred = await WebAuthnCredential.findOne({
    userId: session.userId,
    credentialId: body.id,
  }).exec();
  if (!dbCred) return res.status(400).json({ success: false, message: 'Unknown credential' });

  const verification = await verifyAuthenticationResponse({
    response: body as any,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: Buffer.from(dbCred.credentialId, 'base64url'),
      credentialPublicKey: Buffer.from(dbCred.publicKey, 'base64url'),
      counter: dbCred.counter,
      transports: dbCred.transports as any,
    },
  } as any);

  if (!verification.verified || !verification.authenticationInfo) {
    return res.status(400).json({ success: false, message: 'Verification failed' });
  }

  dbCred.counter = verification.authenticationInfo.newCounter ?? dbCred.counter;
  await dbCred.save();

  session.stepUpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  session.webauthnChallenge = undefined;
  session.webauthnChallengeExpiresAt = undefined;
  await session.save();

  res.json({ success: true, message: 'Authenticated via WebAuthn' });
});
