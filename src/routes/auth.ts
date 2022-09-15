import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { user } from '../db';

const app = express.Router();

app.post('/signup', (req: Request, res: Response) => {
  const { username: requestUserName, password: requestPassword } = req.body;

  const token = jwt.sign(
    {
      username: requestUserName,
      password: requestPassword
    },
    'somethingcool',
    { expiresIn: '1h' }
  );

  user[token] = {
    username: requestUserName,
    password: requestPassword
  };

  console.log(user);

  res.status(200).json({
    data: {
      token,
      message: 'User successfully signed up'
    }
  });
});

app.post('/login', (req: Request, res: Response) => {
  const { username: requestUserName, password: requestPassword } = req.body;

  const userExists = Object.values(user).some(
    user =>
      user.username === requestUserName && user.password === requestPassword
  );

  if (userExists) {
    const token = jwt.sign(
      {
        username: requestUserName,
        password: requestPassword
      },
      'somethingcool',
      { expiresIn: '1h' }
    );

    res.json({
      data: {
        token,
        message: 'user has successfully logged in'
      }
    });
  } else {
    res.status(400).json({
      data: {
        message: 'user cannot log in'
      }
    });
  }
});

export default app;
