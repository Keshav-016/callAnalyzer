import analysisService from '../services/analysisService';
import mongodbService from '../services/mongodbService';
import rabbitmqService from '../services/rabbitmqService';
import transcriptionService from '../services/transcriptionService';
import { AnalysisResultType } from '../types';

export const startWorker = async () => {
  await rabbitmqService.consume(async (job) => {
    const { call_id, filePath } = job;
    console.log('running worker');

    if (typeof call_id !== 'string') {
      throw new Error('Invalid worker payload: call_id missing');
    }
    if (typeof filePath !== 'string') {
      throw new Error('Invalid worker payload: filePath missing');
    }

    const existingAnalysis = await mongodbService.getAnalysisByCallId(call_id);
    if (existingAnalysis) {
      await mongodbService.updateCallTranscript({ call_id, analyzed: true });
      console.log(`Skipping duplicate job for ${call_id}`);
      return;
    }

    const existingCall = await mongodbService.getCallById(call_id);
    if (!existingCall) {
      throw new Error(`Call transcript record missing for call_id=${call_id}`);
    }

    let transcript = existingCall.transcript;
    if (!transcript) {
      transcript = await transcriptionService.transcribeAudio(filePath);
      await mongodbService.updateCallTranscript({ call_id, transcript, analyzed: false });
      console.log('transcription done');
    }

    const analysis: AnalysisResultType = await analysisService.analyzeTranscript(transcript);
    console.log('analysis done');

    await mongodbService.insertAnalyzedCall({ call_id, ...analysis });
    await mongodbService.updateCallTranscript({ call_id, analyzed: true });

    console.log('Processed call:', call_id);
  });
};
