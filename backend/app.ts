import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import env from './utils/Env.js';
import mongodbService from './services/mongodbService.js';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/', routes);

// Error handler
app.use(errorHandler.errorHandler);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = Number(env.PORT) || 3000;
const bootstrap = async (): Promise<void> => {
  try {
    await mongodbService.connect();
  } catch (err) {
    console.error('[App] Failed to connect to MongoDB:', (err as Error).message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Call Analyzer backend listening on port ${PORT}`);
  });
};

void bootstrap();

export default app;
