import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

export function validate(schema: ZodTypeAny, property: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      return next(result.error);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[property] = result.data;
    next();
  };
}
