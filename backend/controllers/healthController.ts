import { Request, Response } from 'express';

export const health = async (req: Request, res: Response): Promise<void> => {
  // Minimal checks for now; will expand to check BigQuery and GCP services later
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

export default { health };
