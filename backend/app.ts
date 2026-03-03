import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import env from './utils/Env.js';
import dbConnection from './config/dbConnection.js';
import rabbitmqService from './services/rabbitmqService.js';
import { startWorker } from './worker/call.worker.js';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.use('/', routes);
app.use(errorHandler.errorHandler);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = Number(env.PORT) || 3000;

// 🔥 Proper async bootstrap
const startServer = async () => {
  try {
    dbConnection();
    console.log('✅ Database connected');

    await rabbitmqService.connectWithRetry();
    console.log('🐰 RabbitMQ connected');

    await startWorker();
    console.log('worker connected');

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
