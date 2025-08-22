/**
 * Development Configuration
 * This file contains development-specific settings
 */

export const devConfig = {
  // Development mode settings
  nextJs: {
    enabled: false, // Disable Next.js handler in development
    clientDir: '',
    buildOutputDir: '',
  },

  // API proxy settings for development
  apiProxy: {
    enabled: true,
    target: 'http://localhost:4000',
  },

  // CORS settings for development
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  },

  // Logging settings for development
  logging: {
    level: 'debug',
    prettyPrint: true,
  },
};
