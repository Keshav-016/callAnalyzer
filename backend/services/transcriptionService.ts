import { SpeechClient } from '@google-cloud/speech';

interface TranscribeOptions {
  gcsUri?: string;
  localPath?: string;
}

let speechClient: SpeechClient | null;
try {
  speechClient = new SpeechClient();
} catch (e) {
  speechClient = null;
}

export const transcribe = async ({ gcsUri, localPath }: TranscribeOptions): Promise<string> => {
  if (speechClient && gcsUri) {
    const request = {
      config: { encoding: 'LINEAR16', languageCode: 'en-US' },
      audio: { uri: gcsUri },
    };
    const [operation] = await speechClient.longRunningRecognize(request);
    const [response] = await operation.promise();
    const transcript =
      response.results?.map((r: any) => r.alternatives[0].transcript).join('\n') || '';
    return transcript;
  }

  // Fallback: read local file name and return placeholder
  if (localPath) return `TRANSCRIPT (simulated) for ${localPath}`;
  if (gcsUri) return `TRANSCRIPT (simulated) for ${gcsUri}`;
  return 'TRANSCRIPT (simulated) - no file provided';
};

export default { transcribe };
