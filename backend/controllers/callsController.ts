import { Request, Response, NextFunction } from 'express';
import mongodbService from '../services/mongodbService.js';
import { createAppError } from '../utils/appError.js';

class CallsController {
  listCalls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agent_id, limit } = req.query;
      const rows = await mongodbService.queryCalls({
        agent_id: agent_id as string | undefined,
        limit: limit ? Number(limit) : 50,
      });
      res.json({ calls: rows });
    } catch (err) {
      next(err);
    }
  };

  getCall = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const call_id = req.params.id;
      const call = await mongodbService.getCallById(call_id);
      if (!call) {
        throw createAppError('not found', 404);
      }
      const analysis = await mongodbService.getAnalysisByCallId(call_id);
      res.json({ call, analysis });
    } catch (err) {
      next(err);
    }
  };

  getAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const call_id = req.params.id;
      const analysis = await mongodbService.getAnalysisByCallId(call_id);
      if (!analysis) {
        throw createAppError('not found', 404);
      }
      res.json({ analysis });
    } catch (err) {
      next(err);
    }
  };
}

export default new CallsController();
