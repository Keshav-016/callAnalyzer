import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server } from 'node:http';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import env from './utils/Env.js';
import dbConnection, { closeDbConnection } from './config/dbConnection.js';
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
let server: Server | null = null;
let shuttingDown = false;

const shutdown = async (signal: string): Promise<void> => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`Received ${signal}. Starting graceful shutdown...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
      console.log('HTTP server closed');
    }

    await rabbitmqService.close();
    console.log('RabbitMQ connection closed');

    await closeDbConnection();

    process.exit(0);
  } catch (error) {
    console.error('Graceful shutdown failed:', error);
    process.exit(1);
  }
};

// 🔥 Proper async bootstrap
const startServer = async () => {
  try {
    await dbConnection();
    console.log('✅ Database connected');

    await rabbitmqService.connectWithRetry();
    console.log('🐰 RabbitMQ connected');

    await startWorker();
    console.log('worker connected');

    server = app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

export default app;
