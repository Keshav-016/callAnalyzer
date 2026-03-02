import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: str({ default: '3000' }),
  JWT_SECRET: str(),
  JWT_EXP: str({ default: '1d' }),
  DB_URL: str({ default: 'mongodb://127.0.0.1:27017' }),
});

export default env;
