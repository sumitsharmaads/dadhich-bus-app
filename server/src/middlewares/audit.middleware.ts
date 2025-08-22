import { Request } from 'express';
import { Audit } from '../models/audit.model';

export async function audit(
  req: Request,
  action: string,
  subject?: string,
  meta?: Record<string, unknown>,
) {
  const session = (req as any).session as { id?: string; userId?: string } | undefined;
  const userId = (req as any).user?._id || session?.userId;
  await Audit.create({ at: new Date(), userId, sessionId: session?.id, action, subject, meta });
}
