import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, userId: bodyUserId } = body as { sessionId?: string; userId?: string };

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId parameter is required.' }, { status: 400 });
    }

    const stripeInstance = getStripe();
    // Retrieve the checkout session directly from Stripe with expanded details
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription'],
    });

    if (!session || (session.payment_status !== 'paid' && session.status !== 'complete')) {
      return NextResponse.json({ error: 'Checkout session is not completed or paid.' }, { status: 400 });
    }

    const rawPlan = session.metadata?.planType || 'pro_monthly';
    const planType = rawPlan === 'lifetime' || rawPlan === 'pro_yearly' ? 'pro_yearly' : 'pro_monthly';
    const userId = session.metadata?.userId || bodyUserId;
    const customerEmail = session.customer_email || session.customer_details?.email;
    const stripeCustomerId = (session.customer as string) || null;
    
    let stripeSubscriptionId: string | null = null;
    let stripePriceId: string | null = null;

    if (session.subscription) {
      if (typeof session.subscription === 'string') {
        stripeSubscriptionId = session.subscription;
      } else {
        stripeSubscriptionId = session.subscription.id;
        const firstItem = session.subscription.items?.data?.[0];
        if (firstItem?.price) {
          stripePriceId = firstItem.price.id;
        }
      }
    }

    if (!stripePriceId && session.line_items?.data?.[0]?.price) {
      stripePriceId = session.line_items.data[0].price.id;
    }

    console.log(`[Stripe Verify Session] Successfully verified session ${sessionId} for ${customerEmail} (UserId: ${userId}, Plan: ${planType})`);

    const newLimit = planType === 'pro_yearly' ? 1800 : 150;

    if (isSupabaseConfigured()) {
      // 1. Update user profile tier in Supabase users table
      if (userId) {
        await supabaseAdmin
          .from('users')
          .update({
            subscription_tier: planType,
            monthly_generation_limit: newLimit,
            stripe_customer_id: stripeCustomerId,
          })
          .eq('id', userId);
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

      // 2. Insert or update subscriptions record in Supabase
      if (stripeSubscriptionId) {
        await supabaseAdmin.from('subscriptions').upsert({
          stripe_subscription_id: stripeSubscriptionId,
          stripe_customer_id: stripeCustomerId,
          status: 'active',
          stripe_price_id: stripePriceId,
          user_id: userId || null,
        });
      }
    }

    return NextResponse.json({
      success: true,
      planType,
      monthlyGenerationLimit: newLimit,
      stripeCustomerId,
      stripeSubscriptionId,
    });
  } catch (err: any) {
    console.error('[Stripe Verify Session Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to verify Stripe checkout session.' }, { status: 500 });
  }
}
