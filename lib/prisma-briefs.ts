import { prisma } from './prisma';
import { SessionConfig } from './axis-prompt';

export interface StoredBrief {
  id: string;
  userId: string;
  sessionId: string;
  brief: string;
  config: SessionConfig;
  messageCount: number;
  createdAt: Date;
}

/**
 * Save brief to Postgres via Prisma
 */
export async function saveBriefToPostgres(
  userId: string,
  brief: string,
  config: SessionConfig,
  messages: Array<{ id: string; role: string; text: string }>,
  sessionId: string
): Promise<string> {
  try {
    const result = await prisma.sessionBrief.create({
      data: {
        userId,
        sessionId,
        brief,
        config: config as any, // JSON field
        messageCount: messages.length,
      },
    });
    return result.id;
  } catch (error) {
    console.error('Error saving brief to Postgres:', error);
    throw error;
  }
}

/**
 * Fetch last 5 briefs for a user
 */
export async function fetchUserBriefs(userId: string): Promise<StoredBrief[]> {
  try {
    const briefs = await prisma.sessionBrief.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return briefs.map((brief: any) => ({
      id: brief.id,
      userId: brief.userId,
      sessionId: brief.sessionId,
      brief: brief.brief,
      config: brief.config as SessionConfig,
      messageCount: brief.messageCount,
      createdAt: brief.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching briefs from Postgres:', error);
    return [];
  }
}

/**
 * Format brief date for display
 */
export function formatBriefDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
