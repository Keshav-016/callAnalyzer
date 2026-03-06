import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import mongodbService from '../services/mongodbService.js';
import { UploadResponseType, CallTranscriptType } from '../types/index.js';
import { getAudioDuration } from '../utils/getDuration.js';
import rabbitmqService from '../services/rabbitmqService.js';
import { createAppError } from '../utils/appError.js';

class UploadController {
  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      const agent_id = req.body.agent_id || req?.user?.id || 'unknown';
      if (!file) {
        throw createAppError('file required', 400);
      }

      const call_id = crypto.randomUUID();
      const duration = await getAudioDuration(file.path);

      const record: CallTranscriptType = {
        call_id,
        agent_id,
        audio_path: file.path,
        created_at: new Date().toISOString(),
        duration,
        analyzed: false,
      };

      // add the recording to queue to go to wisper
      await mongodbService.insertCallTranscript(record);
      console.log('added to queue');
      await rabbitmqService.publish({
        call_id,
        filePath: file.path,
      });

      const response: UploadResponseType = { call_id };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };
}

export default new UploadController();
