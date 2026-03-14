import { auth } from '@clerk/nextjs/server';
import { fetchUserBriefs } from '@/lib/prisma-briefs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const briefs = await fetchUserBriefs(userId);
    return NextResponse.json({ briefs, success: true });
  } catch (error) {
    console.error('API error fetching briefs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch briefs' },
      { status: 500 }
    );
  }
}
