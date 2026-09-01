import { NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planType, userEmail = 'creator@everyposting.com', userId = 'demo-user-1' } = body as {
      planType: 'pro' | 'lifetime';
      userEmail?: string;
      userId?: string;
    };

    if (!planType || !['pro', 'lifetime'].includes(planType)) {
      return NextResponse.json({ error: 'Valid plan type (pro or lifetime) is required.' }, { status: 400 });
    }

    const session = await createStripeCheckoutSession({
      planType,
      userEmail,
      userId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 });
  }
}
