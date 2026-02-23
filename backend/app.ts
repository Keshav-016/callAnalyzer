import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import env from './utils/Env.js';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/', routes);

// Error handler
app.use(errorHandler.errorHandler);

const PORT = Number(env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Call Analyzer backend listening on port ${PORT}`);
});

export default app;
