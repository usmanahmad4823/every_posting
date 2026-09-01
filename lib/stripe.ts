import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
  appInfo: {
    name: 'EveryPosting SaaS',
    version: '1.0.0',
  },
});

export interface CreateCheckoutParams {
  planType: 'pro' | 'lifetime';
  userId?: string;
  userEmail?: string;
}

export async function createStripeCheckoutSession({ planType, userEmail }: CreateCheckoutParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock') || process.env.STRIPE_SECRET_KEY.includes('xxxx')) {
    // Return mock checkout URL for testing when Stripe keys are not set yet
    return {
      url: `${appUrl}/dashboard?payment_success=true&plan=${planType}`,
    };
  }

  const isLifetime = planType === 'lifetime';
  const priceId = isLifetime
    ? process.env.STRIPE_LIFETIME_PRICE_ID
    : process.env.STRIPE_PRO_MONTHLY_PRICE_ID;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: isLifetime ? 'payment' : 'subscription',
    customer_email: userEmail || 'creator@everyposting.com',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?payment_success=true&plan=${planType}`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
    metadata: {
      planType,
    },
  });

  return { url: session.url };
}
