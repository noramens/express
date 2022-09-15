import { Request, Response, NextFunction } from 'express';

export const checkUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.user = req.headers.userid;
  next();
};
