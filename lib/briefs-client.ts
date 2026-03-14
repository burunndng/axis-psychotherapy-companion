import { SessionConfig } from './axis-prompt';

export interface StoredBrief {
  id: string;
  userId: string;
  sessionId: string;
  brief: string;
  config: SessionConfig;
  messageCount: number;
  createdAt: string;
}

/**
 * Save brief via API (client-side wrapper)
 */
export async function saveBriefToPostgres(
  brief: string,
  config: SessionConfig,
  messages: Array<{ id: string; role: string; text: string }>,
  sessionId: string
): Promise<string> {
  try {
    const res = await fetch('/api/briefs/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief, config, messages, sessionId }),
    });

    if (!res.ok) throw new Error('Failed to save brief');
    const data = await res.json();
    return data.briefId;
  } catch (error) {
    console.error('Error saving brief:', error);
    throw error;
  }
}

/**
 * Fetch user's briefs via API (client-side wrapper)
 */
export async function fetchUserBriefs(): Promise<StoredBrief[]> {
  try {
    const res = await fetch('/api/briefs/fetch');
    if (!res.ok) throw new Error('Failed to fetch briefs');
    const data = await res.json();
    return data.briefs || [];
  } catch (error) {
    console.error('Error fetching briefs:', error);
    return [];
  }
}

/**
 * Format brief date for display
 */
export function formatBriefDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
