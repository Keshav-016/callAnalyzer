import { SpeechClient } from '@google-cloud/speech';

interface TranscribeOptions {
  gcsUri?: string;
  localPath?: string;
}

class TranscriptionService {
  private readonly speechClient: SpeechClient | null;

  constructor() {
    try {
      this.speechClient = new SpeechClient();
      console.log('[Transcription] Client initialized');
    } catch (e) {
      console.error('[Transcription] Failed to initialize client:', e);
      this.speechClient = null;
    }
  }

  transcribe = async ({ gcsUri, localPath }: TranscribeOptions): Promise<string> => {
    if (this.speechClient && gcsUri) {
      const request = {
        config: { encoding: 'LINEAR16' as const, languageCode: 'en-US' },
        audio: { uri: gcsUri },
      };
      // longRunningRecognize/operation.promise() returns nested arrays in the
      // callback-style responses. Avoid destructuring here to satisfy TS.
      try {
        const res: any = await this.speechClient.longRunningRecognize(request);
        const operation: any = Array.isArray(res) ? res[0] : res;
        const opResult: any = await operation.promise();
        const response: any = Array.isArray(opResult) ? opResult[0] : opResult;
        const transcript =
          response.results?.map((r: any) => r.alternatives[0].transcript).join('\n') || '';
        console.log(`[Transcription] Transcribed: ${transcript.slice(0, 50)}...`);
        return transcript;
      } catch (err) {
        console.error('[Transcription] Error:', (err as Error).message);
        return `TRANSCRIPT (error) for ${gcsUri}`;
      }
    }

    // Fallback: read local file name and return placeholder
    if (localPath) return `TRANSCRIPT (simulated) for ${localPath}`;
    if (gcsUri) return `TRANSCRIPT (simulated) for ${gcsUri}`;
    return 'TRANSCRIPT (simulated) - no file provided';
  };
}

export default new TranscriptionService();
