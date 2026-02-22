import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';
import { AuthResponse } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXP = '8h';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { agent_id, password } = req.body;
    if (!agent_id || !password) {
      res.status(400).json({ error: 'agent_id and password required' });
      return;
    }

    const user = await userService.findByCredentials(agent_id, password);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ sub: user.id, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXP });
    const response: AuthResponse = { token, user };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { agent_id, name, password } = req.body;
    if (!agent_id || !name || !password) {
      res.status(400).json({ error: 'agent_id, name and password required' });
      return;
    }
    const user = await userService.create({ id: agent_id, name, password });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export default { login, register };
