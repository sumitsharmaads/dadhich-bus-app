import { NextFunction, Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';

export async function loadCurrentUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const session = (req as any).session;
    if (!session?.userId) return next();
    const user = await userRepository.findById(String(session.userId));
    // @ts-ignore
    req.user = user || null;
    next();
  } catch (err) {
    next(err);
  }
}
