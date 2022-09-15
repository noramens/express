import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.json({ success: false, message: 'Error!Token was not provided.' });
  }

  //Decoding the token
  const decodedToken = jwt.verify(token, 'somethingcool');

  req.user = decodedToken.username;
  next();
};
