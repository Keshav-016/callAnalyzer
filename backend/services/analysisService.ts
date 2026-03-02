import { AnalysisResultType } from '../types/index.js';

// Simple analysis service placeholder — integrates with Gemini/Vertex AI in production

class AnalysisService {
  analyzeTranscript = async (transcript: string): Promise<AnalysisResultType> => {
    // If Vertex/Gemini is configured, call it here. For now return structured stub.
    const result: AnalysisResultType = {
      summary: transcript.slice(0, 200),
      category: 'customer_support',
      sentiment: 'neutral',
      score: 7,
      improvements: ['Speak more slowly', 'Confirm customer details earlier'],
    };
    return result;
  };
}

export default new AnalysisService();
