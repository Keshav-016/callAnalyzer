import axios from 'axios';
import FormData from 'form-data';
import fs from 'node:fs';

const WHISPER_URL = process.env.WHISPER_URL || 'http://localhost:9000';

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
