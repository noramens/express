import { Request, Response } from 'express';
import express from 'express';
import { user } from '../db';

const app = express.Router();

app.post('/signup', (req: Request, res: Response) => {
  const { username: requestUserName, password: requestPassword } = req.body;

  user[Object.keys(user).length] = {
    username: requestUserName,
    password: requestPassword
  };

  console.log(user);

  res.send('User successfully signed up');
});

app.post('/login', (req: Request, res: Response) => {
  const { username: requestUserName, password: requestPassword } = req.body;

  const userExists = Object.values(user).some(
    user =>
      user.username === requestUserName && user.password === requestPassword
  );

  userExists
    ? res.send('user has successfully logged in')
    : res.send('user cannot log in');
});

export default app;
