import { createServer, Server } from 'http';

import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { env } from './lib/env';
import { logger } from './lib/logger';
import { startSchedulers } from './lib/scheduler';
import { buildApp } from './app';

// Import models to ensure they are registered with Mongoose
import './models';

let server: Server | null = null;

async function start(): Promise<void> {
  try {
    await connectToDatabase();

    const app = buildApp();

    const httpServer = createServer(app);

    const port = env.PORT;
    server = httpServer.listen(port, () => {
      logger.info({ port }, 'Server started');
      startSchedulers();
    });

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    process.on('uncaughtException', (error) => {
      logger.error({ err: error }, 'Uncaught exception');
      shutdown();
    });

    process.on('unhandledRejection', (reason) => {
      logger.error({ err: reason }, 'Unhandled rejection');
      shutdown();
    });
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start application');
    process.exit(1);
  }
}

async function shutdown(): Promise<void> {
  try {
    logger.info('Shutting down...');
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      server = null;
    }
    await disconnectFromDatabase();
    logger.info('Shutdown complete');
  } catch (error) {
    logger.error({ err: error }, 'Error during shutdown');
  } finally {
    process.exit(0);
  }
}

void start();
