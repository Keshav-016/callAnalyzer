import axios from 'axios';
import FormData from 'form-data';
import fs from 'node:fs';
import env from '../utils/Env.js';

const WHISPER_URL = env.WHISPER_URL;

class TranscriptionService {
  transcribeAudio = async (filePath: string): Promise<string> => {
    try {
      const form = new FormData();
      form.append('audio_file', fs.createReadStream(filePath));

      const response = await axios.post(`${WHISPER_URL}/asr`, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      if (typeof response.data === 'string') {
        return response.data;
      }

      if (typeof response.data?.text === 'string') {
        return response.data.text;
      }

      throw new Error('Invalid transcription response shape');
    } catch (error: any) {
      console.error('Whisper error:', error.response?.data || error.message);
      throw error;
    }
  };
}

export default new TranscriptionService();
