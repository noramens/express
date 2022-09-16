import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { user } from '../db';
import { generateAccessToken } from '../middleware/checkJwt';
import { userSignIn, refreshToken } from '../middleware/checkJwt';

const app = express.Router();

app.post('/sign-up', async (req: Request, res: Response) => {
  const {
    username: requestUserName,
    password: requestPassword,
    email: requestEmail
  } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(requestPassword, salt);

  const token = generateAccessToken(
    requestUserName,
    hashedPassword,
    requestEmail
  );

  user[token] = {
    username: requestUserName,
    password: hashedPassword,
    email: requestEmail
  };

  console.log(user);

  res.status(200).json({
    data: {
      token,
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

export default app;
