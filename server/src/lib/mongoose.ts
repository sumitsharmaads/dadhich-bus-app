import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) return;

  mongoose.set('strictQuery', true);

  await mongoose.connect(env.MONGODB_URI);

  isConnected = true;
  logger.info('Connected to MongoDB');

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error({ err }, 'MongoDB connection error');
  });
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) return;

  await mongoose.disconnect();
  isConnected = false;
  logger.info('Disconnected from MongoDB');
}

export function getDbState(): 'connected' | 'disconnected' | 'connecting' | 'disconnecting' {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}
