import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import storageService from '../services/storageService.js';
import pubsubService from '../services/pubsubService.js';
import bigqueryService from '../services/bigqueryService.js';
import { UploadResponse, CallTranscript } from '../types/index.js';

export const upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file;
    const agent_id = req.body.agent_id || (req.user && req.user.id) || 'unknown';
    if (!file) {
      res.status(400).json({ error: 'file required' });
      return;
    }
    if (!file.mimetype.startsWith('audio/') && !file.mimetype.startsWith('video/')) {
      res.status(400).json({ error: 'invalid file type' });
      return;
    }

    const call_id = crypto.randomUUID();
    const destPath = `audio/${call_id}/${file.originalname}`;
    const storedPath = await storageService.uploadFile(file, destPath);

    const record: CallTranscript = {
      call_id,
      agent_id,
      file_path: storedPath,
      created_at: new Date().toISOString(),
      analyzed: false,
    };

    await bigqueryService.insertCallTranscript(record);

    await pubsubService.publishAudioUpload({ call_id, agent_id, file_path: storedPath });

    const response: UploadResponse = { call_id };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default { upload };
