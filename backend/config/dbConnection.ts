import mongoose from 'mongoose';
import env from '../utils/Env';

const url = env.DB_URL;
let listenersAttached = false;

export default async function dbConnection() {
  if (!listenersAttached) {
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.once('open', () => {
      console.log('Connected to MongoDB');
    });
    listenersAttached = true;
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(url);
}

export async function closeDbConnection(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    return;
  }
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
}
