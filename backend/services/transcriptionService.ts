import axios from 'axios';
import FormData from 'form-data';
import fs from 'node:fs';
import env from '../utils/Env';

const WHISPER_URL = env.WHISPER_URL;

class TranscriptionService {
  transcribeAudio = async (filePath: string) => {
    try {
      const form = new FormData();
      form.append('audio_file', fs.createReadStream(filePath));

      const response = await axios.post(`${WHISPER_URL}/asr`, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error: any) {
      console.error('Whisper error:', error.response?.data || error.message);
      throw error;
    }
  };
}

export default new TranscriptionService();
