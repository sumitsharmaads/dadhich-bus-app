import { Session } from '../models/session.model';
import { logger } from '../lib/logger';

export async function cleanupExpiredSessions() {
  try {
    const now = new Date();

    // Delete expired sessions
    const result = await Session.deleteMany({
      expiresAt: { $lt: now },
    });

    if (result.deletedCount && result.deletedCount > 0) {
      logger.info(`Cleaned up ${result.deletedCount} expired sessions`);
    }

    // Also clean up sessions that haven't been seen for more than 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const inactiveResult = await Session.deleteMany({
      lastSeenAt: { $lt: sevenDaysAgo },
    });

    if (inactiveResult.deletedCount && inactiveResult.deletedCount > 0) {
      logger.info(`Cleaned up ${inactiveResult.deletedCount} inactive sessions`);
    }

    return {
      expiredSessions: result.deletedCount || 0,
      inactiveSessions: inactiveResult.deletedCount || 0,
      total: (result.deletedCount || 0) + (inactiveResult.deletedCount || 0),
    };
  } catch (error) {
    logger.error({ error }, 'Error cleaning up sessions');
    throw error;
  }
}

export async function cleanupUserSessions(userId: string, keepCurrentSessionId?: string) {
  try {
    const query: any = { userId };

    // If keeping current session, exclude it from deletion
    if (keepCurrentSessionId) {
      const { sha256 } = await import('../lib/crypto');
      query.sessionIdHash = { $ne: sha256(keepCurrentSessionId) };
    }

    const result = await Session.deleteMany(query);

    logger.info(`Cleaned up ${result.deletedCount || 0} sessions for user ${userId}`);
    return result.deletedCount || 0;
  } catch (error) {
    logger.error({ error }, 'Error cleaning up user sessions');
    throw error;
  }
}
