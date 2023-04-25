import { Request, Response, NextFunction } from 'express';
import { isJWTValid, getUserData } from './utils';

const keycloakMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(403).json({ error: 'No authorization header found' });
  }

  const token = header.split(' ')[1];

  if (!(await isJWTValid(token))) {
    return res.status(403).json({ error: 'Invalid token' });
  }
  req.token = token;
  req.user = getUserData(token);

  next();
};

export default keycloakMiddleware;
