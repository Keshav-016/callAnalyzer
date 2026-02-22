import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';
import { AuthPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    const user = await userService.findById(payload.sub);
    if (!user) {
      res.status(401).json({ error: 'Invalid token user' });
      return;
    }
    req.user = { id: user.id, name: user.name };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default { authenticate };
