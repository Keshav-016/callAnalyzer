import { Request, Response, NextFunction } from 'express';
import mongodbService from '../services/mongodbService.js';

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
        res.status(404).json({ error: 'not found' });
        return;
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
        res.status(404).json({ error: 'not found' });
        return;
      }
      res.json({ analysis });
    } catch (err) {
      next(err);
    }
  };
}

export default new CallsController();
