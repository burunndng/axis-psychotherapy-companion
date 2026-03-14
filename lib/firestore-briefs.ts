import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { SessionConfig } from './axis-prompt';

export interface StoredBrief {
  id: string;
  userId: string;
  brief: string;
  config: SessionConfig;
  messageCount: number;
  createdAt: Date;
  sessionId: string;
}

/**
 * Save brief to Firestore under user's briefs collection
 */
export async function saveBriefToFirestore(
  userId: string,
  brief: string,
  config: SessionConfig,
  messages: Array<{ id: string; role: string; text: string }>,
  sessionId: string
): Promise<string> {
  try {
    const briefsRef = collection(db, 'users', userId, 'briefs');
    const docRef = await addDoc(briefsRef, {
      brief,
      config,
      messageCount: messages.length,
      sessionId,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving brief to Firestore:', error);
    throw error;
  }
}

/**
 * Fetch last 5 briefs for a user
 */
export async function fetchUserBriefs(userId: string): Promise<StoredBrief[]> {
  try {
    const briefsRef = collection(db, 'users', userId, 'briefs');
    const q = query(
      briefsRef,
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId,
        brief: data.brief,
        config: data.config,
        messageCount: data.messageCount,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        sessionId: data.sessionId,
      };
    });
  } catch (error) {
    console.error('Error fetching briefs from Firestore:', error);
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
