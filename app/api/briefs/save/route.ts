import { auth } from '@clerk/nextjs/server';
import { saveBriefToPostgres } from '@/lib/prisma-briefs';
import { SessionConfig } from '@/lib/axis-prompt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error('No userId from auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { brief, config, messages, sessionId } = await req.json();

    const briefId = await saveBriefToPostgres(
      userId,
      brief,
      config as SessionConfig,
      messages,
      sessionId
    );

    return NextResponse.json({ briefId, success: true });
  } catch (error) {
    console.error('API error saving brief:', error);
    return NextResponse.json(
      {
        error: 'Failed to save brief',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
