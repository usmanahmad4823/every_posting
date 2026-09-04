import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { getGenerationLimit } from '@/lib/plans';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, planType: inputPlan } = body as {
      sessionId?: string;
      planType?: string;
    };

    // 1. Authenticate user from session token
    let authenticatedUserId: string | null = null;
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (isSupabaseConfigured()) {
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (!userErr && userData.user) {
          authenticatedUserId = userData.user.id;
        }
      }
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, message: 'Demo mode active.' });
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter.' },
        { status: 400 }
      );
    }

    // 2. Retrieve official Stripe Checkout Session
    const stripeInstance = getStripe();
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'line_items'],
    });

    if (!session || (session.payment_status !== 'paid' && session.status !== 'complete')) {
      return NextResponse.json(
        { error: 'Stripe Checkout Session is not completed or paid.' },
        { status: 400 }
      );
    }

    const rawPlan = session.metadata?.planType || inputPlan || 'pro_monthly';
    const planType = rawPlan === 'lifetime' || rawPlan === 'pro_yearly' ? 'pro_yearly' : 'pro_monthly';
    const metadataUserId = session.metadata?.userId;
    const customerEmail = session.customer_email || session.customer_details?.email;
    const stripeCustomerId = (session.customer as string) || null;
    const stripeSubscriptionId = (typeof session.subscription === 'object' ? session.subscription?.id : session.subscription as string) || null;

    // Resolve Price ID
    const monthlyPriceId = process.env.STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '';
    const yearlyPriceId = process.env.STRIPE_LIFETIME_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID || '';
    const priceId = (session.line_items?.data[0]?.price?.id) || (planType === 'pro_yearly' ? yearlyPriceId : monthlyPriceId);

    // 3. Target User ID resolution
    let targetUserId = authenticatedUserId || metadataUserId;

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

    if (!targetUserId) {
      return NextResponse.json({
        error: 'Unable to match Stripe session to a database user ID.',
      }, { status: 404 });
    }

    const newLimit = getGenerationLimit(planType);

    // 4. Update public.users table in Supabase PostgreSQL
    await supabaseAdmin
      .from('users')
      .update({
        subscription_tier: planType,
        monthly_generation_limit: newLimit,
        stripe_customer_id: stripeCustomerId,
      })
      .eq('id', targetUserId);

    // 5. Insert / Upsert public.subscriptions record in Supabase PostgreSQL
    if (stripeSubscriptionId) {
      await supabaseAdmin.from('subscriptions').upsert({
        stripe_subscription_id: stripeSubscriptionId,
        stripe_customer_id: stripeCustomerId,
        status: 'active',
        stripe_price_id: priceId,
        user_id: targetUserId,
      }, { onConflict: 'stripe_subscription_id' });
    }

    return NextResponse.json({
      success: true,
      plan: planType,
      userId: targetUserId,
      limit: newLimit,
    });
  } catch (error: any) {
    console.error('[Stripe Session Verification Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify Stripe Checkout session.' },
      { status: 500 }
    );
  }
}
