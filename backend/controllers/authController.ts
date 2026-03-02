import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import userService from '../services/agentService.js';
import { AuthResponseType } from '../types/index.js';
import env from '../utils/Env.js';

class AuthController {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXP: string;

  constructor() {
    this.JWT_SECRET = env.JWT_SECRET;
    this.JWT_EXP = env.JWT_EXP;
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const signOptions: SignOptions = { expiresIn: this.JWT_EXP as SignOptions['expiresIn'] };
      const token = jwt.sign({ sub: user.id, name: user.name }, this.JWT_SECRET, signOptions);
      const response: AuthResponseType = { token, user };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
}

export default new AuthController();
