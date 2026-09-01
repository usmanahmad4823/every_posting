import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Stripe Webhook Error]: Missing STRIPE_WEBHOOK_SECRET environment variable.');
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not configured on server.' },
      { status: 500 }
    );
  }

  if (!signature) {
    console.error('[Stripe Webhook Error]: Missing stripe-signature header.');
    return NextResponse.json(
      { error: 'Missing stripe-signature header.' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripeInstance = getStripe();
    // Verify Stripe signature using raw request body
    event = stripeInstance.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook Verification Failed]: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle relevant Stripe events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const planType = (session.metadata?.planType as 'pro' | 'lifetime') || 'pro';
      const userId = session.metadata?.userId;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const stripeCustomerId = (session.customer as string) || null;
      const stripeSubscriptionId = (session.subscription as string) || null;

      console.log(`[Stripe Webhook] Checkout completed for ${customerEmail} (UserId: ${userId}, Plan: ${planType})`);

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-everyposting')) {
        try {
          // 1. Update user profile tier in Supabase users table
          if (userId) {
            await supabase
              .from('users')
              .update({
                subscription_tier: planType,
                stripe_customer_id: stripeCustomerId,
              })
              .eq('id', userId);
          } else if (customerEmail) {
            await supabase
              .from('users')
              .update({
                subscription_tier: planType,
                stripe_customer_id: stripeCustomerId,
              })
              .eq('email', customerEmail);
          }

          // 2. Insert or update subscriptions record
          if (stripeSubscriptionId) {
            await supabase.from('subscriptions').upsert({
              stripe_subscription_id: stripeSubscriptionId,
              stripe_customer_id: stripeCustomerId,
              status: 'active',
              stripe_price_id: session.line_items?.data[0]?.price?.id || null,
              user_id: userId || null,
            });
          }
        } catch (dbErr) {
          console.error('[Stripe Webhook Database Update Warning]:', dbErr);
        }
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const status = subscription.status;

      console.log(`[Stripe Webhook] Subscription status update: ${status} for customer ${customerId}`);

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-everyposting')) {
        try {
          // Update user subscription tier based on status
          const updatedTier = status === 'active' ? 'pro' : 'free';

          await supabase
            .from('users')
            .update({ subscription_tier: updatedTier })
            .eq('stripe_customer_id', customerId);

          // Update subscription record
          await supabase
            .from('subscriptions')
            .update({ status })
            .eq('stripe_subscription_id', subscription.id);
        } catch (dbErr) {
          console.error('[Stripe Webhook Subscription Update Warning]:', dbErr);
        }
      }
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
