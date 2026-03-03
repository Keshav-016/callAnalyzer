import analysisService from '../services/analysisService';
import mongodbService from '../services/mongodbService';
import rabbitmqService from '../services/rabbitmqService';
import transcriptionService from '../services/transcriptionService';
import { AnalysisResultType } from '../types';
export const startWorker = async () => {
  rabbitmqService.consume(async (job) => {
    const { call_id, filePath } = job;
    console.log('running worker');
    const transcript = await transcriptionService.transcribeAudio(filePath);
    await mongodbService.updateCallTranscript({ call_id, transcript, analyzed: true });
    console.log('transcription done');

    const analysis: AnalysisResultType = await analysisService.analyzeTranscript(transcript);
    console.log('analysis done');

    await mongodbService.insertAnalyzedCall({ call_id, ...analysis });

    console.log('Processed call:', call_id);
  });
};
