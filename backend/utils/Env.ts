import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: str({ default: '3000' }),
  JWT_SECRET: str(),
  GOOGLE_APPLICATION_CREDENTIALS: str({}),
  GCP_PROJECT_ID: str({ default: 'callanalyzer' }),
  STORAGE_BUCKET: str({ default: 'callanalyzer' }),
  GCP_PUBSUB_TOPIC: str({ default: 'call-transcript' }),
  GCP_PUBSUB_SUBSCRIPTION: str({ default: 'call-transcript' }),
  BIGQUERY_DATASET: str({ default: 'call_analyzer' }),
});

export default env;
