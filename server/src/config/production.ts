/**
 * Production Configuration
 * This file contains production-specific settings
 */

export const prodConfig = {
  // Production mode settings
  nextJs: {
    enabled: true, // Enable Next.js handler in production
    clientDir: '../../client',
    buildOutputDir: '.next', // Next.js build output directory
  },

  // API settings for production
  api: {
    enabled: true,
    basePath: '/api',
  },

  // CORS settings for production
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['https://yourdomain.com'],
    credentials: true,
  },

  // Logging settings for production
  logging: {
    level: 'info',
    prettyPrint: false,
  },

  // Security settings for production
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    helmet: {
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
    },
  },
};
