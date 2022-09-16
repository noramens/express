import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { user, refreshList } from '../db';

export function generateAccessToken(
  username: string,
  password: string,
  email: string
) {
  return jwt.sign({ username, password, email }, 'somethingcool', {
    expiresIn: '1h'
  });
}

export function generateRefreshToken(
  username: string,
  password: string,
  email: string
) {
  return jwt.sign({ username, password, email }, 'somethingcool', {
    expiresIn: '30d'
  });
}

const addToRefreshList = (refreshToken: string, token: string) => {
  refreshList[refreshToken] = {
    status: 'loggedin',
    token: token,
    refreshtoken: refreshToken
  };
};

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.json({ success: false, message: 'Error!Token was not provided.' });
  }

  try {
    //Decoding the token
    const decodedToken = jwt.verify(token, 'somethingcool');

    req.user = decodedToken.username;
  } catch (error) {
    return res.status(401).send('Invalid token');
  }

  return next();
};

export const userSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = Object.values(user).find(
    item => item.username === req.body.username
  );

  if (currentUser) {
    const validPassword = await bcrypt.compare(
      req.body.password,
      currentUser.password
    );

    if (validPassword) {
      const token = generateAccessToken(
        currentUser.username,
        currentUser.password,
        currentUser.email
      );

      req.token = token;

      const refreshToken = generateRefreshToken(
        currentUser.username,
        currentUser.password,
        currentUser.email
      );

      req.refreshToken = refreshToken;
      req.content = {
        user: currentUser.username,
        password: currentUser.password,
        email: currentUser.email
      };

      addToRefreshList(refreshToken, token);
      return next();
    } else {
      res.status(400).json({ error: 'Invalid Password' });
    }
  } else {
    res.status(401).json({ error: 'User not found' });
  }
};

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken: requestRefreshToken } = req.body;

  if (requestRefreshToken && requestRefreshToken in refreshList) {
    const { username, password, email } = jwt.verify(
      requestRefreshToken,
      'somethingcool'
    );

    const token = generateAccessToken(username, password, email);

    const refreshToken = generateRefreshToken(username, password, email);

    req.content = {
      user: username,
      password: password,
      email: email
    };

    req.token = token;
    req.refreshToken = refreshToken;

    addToRefreshList(refreshToken, token);
  } else {
    return res.status(401).send("Can't refresh. Invalid Token");
  }
  next();
};
