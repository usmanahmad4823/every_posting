import Stripe from 'stripe';

/**
 * Get initialized Stripe instance dynamically.
 * Uses a safe fallback key during Next.js static build module evaluation to prevent build errors.
 */
export function getStripe(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';
  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-02-24.acacia' as any,
    appInfo: {
      name: 'EveryPosting SaaS',
      version: '1.0.0',
    },
  });
}

// Export default stripe instance for legacy calls
export const stripe = getStripe();

export interface CreateCheckoutParams {
  planType: 'pro' | 'lifetime';
  userId?: string;
  userEmail?: string;
  originUrl?: string;
}

/**
 * Server-side creation of a real Stripe Hosted Checkout Session
 */
export async function createStripeCheckoutSession({
  planType,
  userId,
  userEmail,
  originUrl,
}: CreateCheckoutParams) {
  // Validate that real STRIPE_SECRET_KEY is configured when user initiates checkout
  if (
    !process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY.includes('mock') ||
    process.env.STRIPE_SECRET_KEY.includes('YOUR_STRIPE') ||
    process.env.STRIPE_SECRET_KEY.includes('placeholder')
  ) {
    throw new Error(
      'STRIPE_SECRET_KEY is not configured or contains placeholders in environment variables. Please add your Stripe Test Secret Key (sk_test_...) in Vercel Project Settings.'
    );
  }

  const stripeInstance = getStripe();

  // Resolve base URL: priority given to origin, then NEXT_PUBLIC_APP_URL, then localhost
  const appUrl =
    originUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://every-posting.vercel.app';

  // Secure server-side Price ID Mapping (prevents client-side price manipulation)
  let priceId: string | undefined;
  let mode: 'subscription' | 'payment';

  if (planType === 'pro') {
    priceId =
      process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ||
      process.env.STRIPE_PRO_PRICE_ID ||
      process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    mode = 'subscription';
  } else if (planType === 'lifetime') {
    priceId =
      process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID ||
      process.env.STRIPE_LIFETIME_PRICE_ID;
    mode = 'payment';
  } else {
    throw new Error(`Invalid plan type requested: ${planType}`);
  }

  if (!priceId || priceId.includes('YOUR_') || priceId.includes('price_xxx')) {
    throw new Error(
      `Stripe Price ID for plan "${planType}" is not configured. Please set NEXT_PUBLIC_STRIPE_PRO_PRICE_ID or NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID in Vercel Project Settings.`
    );
  }

  // Create real Stripe Checkout Session
  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ['card'],
    mode,
    customer_email: userEmail || undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?payment_success=true&plan=${planType}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
    metadata: {
      userId: userId || '',
      planType,
    },
  });

  if (!session.url) {
    throw new Error('Failed to obtain checkout URL from Stripe session.');
  }

  return { url: session.url };
}
