import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
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
      const rawPlan = session.metadata?.planType || 'pro_monthly';
      const planType = rawPlan === 'lifetime' || rawPlan === 'pro_yearly' ? 'pro_yearly' : 'pro_monthly';
      const metadataUserId = session.metadata?.userId;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const stripeCustomerId = (session.customer as string) || null;
      const stripeSubscriptionId = (session.subscription as string) || null;

      const monthlyPriceId = process.env.STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '';
      const yearlyPriceId = process.env.STRIPE_LIFETIME_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID || '';
      const priceId = (session.line_items?.data[0]?.price?.id) || (planType === 'pro_yearly' ? yearlyPriceId : monthlyPriceId);

      console.log(`[Stripe Webhook] Checkout completed for ${customerEmail} (UserId: ${metadataUserId}, Plan: ${planType})`);

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-everyposting')) {
        try {
          const newLimit = planType === 'pro_yearly' ? 1800 : 150;
          let targetUserId = metadataUserId;

          if (!targetUserId && customerEmail) {
            const { data: foundUser } = await supabaseAdmin
              .from('users')
              .select('id')
              .eq('email', customerEmail)
              .maybeSingle();

            if (foundUser) {
              targetUserId = foundUser.id;
            }
          }

          // 1. Update user profile tier in Supabase users table
          if (targetUserId) {
            await supabaseAdmin
              .from('users')
              .update({
                subscription_tier: planType,
                monthly_generation_limit: newLimit,
                stripe_customer_id: stripeCustomerId,
              })
              .eq('id', targetUserId);
          } else if (customerEmail) {
            await supabaseAdmin
              .from('users')
              .update({
                subscription_tier: planType,
                monthly_generation_limit: newLimit,
                stripe_customer_id: stripeCustomerId,
              })
              .eq('email', customerEmail);
          }

          // 2. Insert or update subscriptions record using service role client
          if (stripeSubscriptionId) {
            await supabaseAdmin.from('subscriptions').upsert({
              stripe_subscription_id: stripeSubscriptionId,
              stripe_customer_id: stripeCustomerId,
              status: 'active',
              stripe_price_id: priceId,
              user_id: targetUserId || null,
            }, { onConflict: 'stripe_subscription_id' });
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
          // If subscription is active or trialing, maintain plan; if canceled/past_due/unpaid, revert to free with 3 limit
          const isPaidActive = status === 'active' || status === 'trialing';

          if (!isPaidActive) {
            await supabaseAdmin
              .from('users')
              .update({
                subscription_tier: 'free',
                monthly_generation_limit: 3,
              })
              .eq('stripe_customer_id', customerId);
          }

          // Update subscription record with billing period timestamps
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status,
              current_period_start: (subscription as any).current_period_start
                ? new Date((subscription as any).current_period_start * 1000).toISOString()
                : new Date().toISOString(),
              current_period_end: (subscription as any).current_period_end
                ? new Date((subscription as any).current_period_end * 1000).toISOString()
                : new Date().toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
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
