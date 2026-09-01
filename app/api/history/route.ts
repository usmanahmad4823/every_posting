import { NextResponse } from 'next/server';
import { getGenerationHistory } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'demo-user-1';

    const history = await getGenerationHistory(userId);
    return NextResponse.json({ history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch history' }, { status: 500 });
  }
}
