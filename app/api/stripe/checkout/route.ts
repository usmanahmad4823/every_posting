import { NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe';

// Rate limiting configuration: max 5 checkout sessions per 60s per client
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const checkoutRateMap = new Map<string, number[]>();

function checkCheckoutRateLimit(clientKey: string): boolean {
  const now = Date.now();
  const timestamps = checkoutRateMap.get(clientKey) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  checkoutRateMap.set(clientKey, validTimestamps);
  return false;
}

export async function POST(req: Request) {
  try {
    // Extract IP or client identifier
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown-client';
    
    const body = await req.json().catch(() => ({}));
    const { planType, userEmail, userId } = body as {
      planType: 'pro_monthly' | 'pro_yearly' | 'pro';
      userEmail?: string;
      userId?: string;
    };

    const rateKey = userId || clientIp;
    if (checkCheckoutRateLimit(rateKey)) {
      return NextResponse.json(
        { error: 'Too many checkout requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

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
