import { cleanEnv, num, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: str({ default: '3000' }),
  JWT_SECRET: str(),
  JWT_EXP: str({ default: '1d' }),
  DB_URL: str({ default: 'mongodb://127.0.0.1:27017' }),
  WHISPER_URL: str({ default: 'http://localhost:9000' }),
  OLLAMA_URL: str({ default: 'http://localhost:11434' }),
  RABBITMQ_URL: str({ default: 'amqp://localhost:5672' }),
  WORKER_MAX_RETRIES: num({ default: 3 }),
  WORKER_RETRY_BASE_MS: num({ default: 2000 }),
});

export default env;
