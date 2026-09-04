import { NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { planType, userEmail, userId } = body as {
      planType: 'pro_monthly' | 'pro_yearly' | 'pro';
      userEmail?: string;
      userId?: string;
    };

    // Server-side validation of planType parameter
    const validPlans = ['pro_monthly', 'pro_yearly', 'pro'];
    if (!planType || !validPlans.includes(planType)) {
      return NextResponse.json(
        { error: 'Valid plan type ("pro_monthly" or "pro_yearly") is required.' },
        { status: 400 }
      );
    }

    // Extract dynamic request origin (e.g., https://every-posting.vercel.app)
    const originUrl =
      req.headers.get('origin') ||
      req.headers.get('referer')?.replace(/\/$/, '') ||
      undefined;

    // Create Stripe Checkout Session
    const session = await createStripeCheckoutSession({
      planType,
      userEmail,
      userId,
      originUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe Checkout API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Stripe Checkout session.' },
      { status: 500 }
    );
  }
}
