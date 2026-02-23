import { SpeechClient } from '@google-cloud/speech';

interface TranscribeOptions {
  gcsUri?: string;
  localPath?: string;
}

let speechClient: SpeechClient | null;
try {
  speechClient = new SpeechClient();
} catch (e) {
  console.log(e);
  speechClient = null;
}

class TranscriptionService {
  transcribe = async ({ gcsUri, localPath }: TranscribeOptions): Promise<string> => {
    if (speechClient && gcsUri) {
      const request = {
        config: { encoding: 'LINEAR16' as const, languageCode: 'en-US' },
        audio: { uri: gcsUri },
      };
      // longRunningRecognize/operation.promise() returns nested arrays in the
      // callback-style responses. Avoid destructuring here to satisfy TS.
      const res: any = await speechClient.longRunningRecognize(request);
      const operation: any = Array.isArray(res) ? res[0] : res;
      const opResult: any = await operation.promise();
      const response: any = Array.isArray(opResult) ? opResult[0] : opResult;
      const transcript =
        response.results?.map((r: any) => r.alternatives[0].transcript).join('\n') || '';
      return transcript;
    }

    // Fallback: read local file name and return placeholder
    if (localPath) return `TRANSCRIPT (simulated) for ${localPath}`;
    if (gcsUri) return `TRANSCRIPT (simulated) for ${gcsUri}`;
    return 'TRANSCRIPT (simulated) - no file provided';
  };
}

export default new TranscriptionService();
