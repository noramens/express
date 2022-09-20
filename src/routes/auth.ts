import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { user } from '../db';
import { generateAccessToken } from '../middleware/checkJwt';
import {
  userSignIn,
  userSignUp,
  refreshToken,
  resetPassword
} from '../middleware/checkJwt';

const app = express.Router();

app.post('/sign-up', userSignUp, async (req: Request, res: Response) => {
  console.log(user);

  res.status(200).json({
    data: {
      token: req.token,
      message: 'User successfully signed up'
    }
  });
});

app.post('/sign-in', userSignIn, (req: Request, res: Response) => {
  res.json({
    data: {
      JWT: req.token,
      refresh: req.refreshToken,
      message: 'user has successfully logged in'
    }
  });
});

app.post('/refresh', refreshToken, (req: Request, res: Response) => {
  res.json({
    message: 'Token has been refreshed successfully',
    JWT: req.token,
    refresh: req.refreshToken
  });
});

app.post('/reset-password', resetPassword, (req: Request, res: Response) => {
  res.send('Password reset successful');
});

export default app;
