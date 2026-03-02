import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import storageService from '../services/storageService.js';
import pubsubService from '../services/pubsubService.js';
import mongodbService from '../services/mongodbService.js';
import { UploadResponseType, CallTranscriptType } from '../types/index.js';

class UploadController {
  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      const agent_id = req.body.agent_id || req?.user?.id || 'unknown';
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
      console.log(
        `[Upload] Starting upload - call_id: ${call_id}, agent_id: ${agent_id}, file: ${file.originalname}`,
      );

      const storedPath = await storageService.uploadFile(file, destPath);
      console.log(`[Upload] ✅ File stored at: ${storedPath}`);

      const record: CallTranscriptType = {
        call_id,
        agent_id,
        file_path: storedPath,
        created_at: new Date().toISOString(),
        analyzed: false,
      };

      const insertResult = await mongodbService.insertCallTranscript(record);
      console.log(
        `[Upload] ${insertResult.ok ? '✅' : '❌'} MongoDB insert: ${JSON.stringify(insertResult)}`,
      );

      const pubsubResult = await pubsubService.publishAudioUpload({
        call_id,
        agent_id,
        file_path: storedPath,
      });
      console.log(
        `[Upload] ${pubsubResult.ok ? '✅' : '❌'} Pub/Sub publish: ${JSON.stringify(pubsubResult)}`,
      );

      const response: UploadResponseType = { call_id };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };
}

export default new UploadController();
