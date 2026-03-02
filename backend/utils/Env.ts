import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: str({ default: '3000' }),
  JWT_SECRET: str(),
  JWT_EXP: str({ default: '1d' }),
  DB_URL: str({ default: 'mongodb://127.0.0.1:27017' }),
  GOOGLE_APPLICATION_CREDENTIALS: str({}),
  GCP_PROJECT_ID: str({ default: 'callanalyzer' }),
  STORAGE_BUCKET: str({ default: 'callanalyzer' }),
  GCP_PUBSUB_TOPIC: str({ default: 'call-transcript' }),
  GCP_PUBSUB_SUBSCRIPTION: str({ default: 'call-transcript' }),
  MONGODB_URI: str({ default: 'mongodb://127.0.0.1:27017' }),
  MONGODB_DB_NAME: str({ default: 'call_analyzer' }),
});

export default env;
