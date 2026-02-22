import { Request, Response, NextFunction } from 'express';
import bigqueryService from '../services/bigqueryService.js';

export const listCalls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { agent_id, limit } = req.query;
    const rows = await bigqueryService.queryCalls({
      agent_id: agent_id as string | undefined,
      limit: limit ? Number(limit) : 50,
    });
    res.json({ calls: rows });
  } catch (err) {
    next(err);
  }
};

export const getCall = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const call_id = req.params.id;
    const call = await bigqueryService.getCallById(call_id);
    if (!call) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    const analysis = await bigqueryService.getAnalysisByCallId(call_id);
    res.json({ call, analysis });
  } catch (err) {
    next(err);
  }
};

export const getAnalysis = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const call_id = req.params.id;
    const analysis = await bigqueryService.getAnalysisByCallId(call_id);
    if (!analysis) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    res.json({ analysis });
  } catch (err) {
    next(err);
  }
};

export default { listCalls, getCall, getAnalysis };
