import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && !webhookSecret.includes('xxxx')) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Demo fallback parsing when webhook secret is not set
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle relevant Stripe event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const planType = session.metadata?.planType as 'pro' | 'lifetime' | undefined;
      const customerEmail = session.customer_email || session.customer_details?.email;

      if (customerEmail && planType) {
        console.log(`Payment successful for ${customerEmail} - Plan: ${planType}`);
        // Update user tier in Supabase
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase')) {
          await supabase
            .from('users')
            .update({ subscription_tier: planType })
            .eq('email', customerEmail);
        }
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const status = subscription.status;

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase')) {
        await supabase
          .from('users')
          .update({
            subscription_tier: status === 'active' ? 'pro' : 'free',
          })
          .eq('stripe_customer_id', customerId);
      }
      break;
    }
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
