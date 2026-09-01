import { NextResponse } from 'next/server';
import { saveFeedbackRecord, markUserSeenReviewPrompt } from '@/lib/supabase';
import { FeedbackData } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, reviewText, generationId, source = 'per_generation', userId = 'demo-user-1' } = body as {
      rating: number;
      reviewText?: string;
      generationId?: string;
      source?: 'per_generation' | 'milestone' | 'manual';
      userId?: string;
    };

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid rating (1-5) is required.' }, { status: 400 });
    }

    const feedbackData: FeedbackData = {
      rating,
      reviewText,
      generationId,
      source,
      userId,
    };

    await saveFeedbackRecord(feedbackData);

    if (source === 'milestone') {
      await markUserSeenReviewPrompt(userId);
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully.',
    });
  } catch (error: any) {
    console.error('API /api/feedback error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit feedback.' }, { status: 500 });
  }
}
