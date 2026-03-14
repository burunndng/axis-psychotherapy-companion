import { auth } from '@clerk/nextjs/server';
import { fetchUserBriefs } from '@/lib/prisma-briefs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error('No userId from auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const briefs = await fetchUserBriefs(userId);
    return NextResponse.json({ briefs, success: true });
  } catch (error) {
    console.error('API error fetching briefs:', error);
    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: 'Failed to fetch briefs',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
