import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { getGenerationLimit } from '@/lib/plans';
import { PlanType } from '@/lib/types';

export async function GET(req: Request) {
  try {
    let userId: string | null = null;
    let authUserEmail: string | null = null;
    let authUserMetadataName: string | null = null;

    // Extract Bearer Token from Authorization Header
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (isSupabaseConfigured()) {
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (!userErr && userData?.user) {
          userId = userData.user.id;
          authUserEmail = userData.user.email || null;
          authUserMetadataName = userData.user.user_metadata?.full_name || null;
        }
      }
    }

    // Fallback: check query parameter if userId is provided
    if (!userId) {
      const url = new URL(req.url);
      const queryUserId = url.searchParams.get('userId');
      if (queryUserId && queryUserId !== 'guest-user' && queryUserId !== 'demo-user-1') {
        userId = queryUserId;
      }
    }

    if (!userId || !isSupabaseConfigured()) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    // 1. Fetch user row from public.users table using service role client
    const { data: userRow, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // 2. Fetch active/trialing subscription from public.subscriptions table
    const { data: subRows, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false });

    console.log('[DEBUG /api/user/profile]', { userId, userRow, userErr, subRows, subErr });

    const subRow = subRows?.[0] || null;

    let activeTier: PlanType = 'free';

    if (userRow?.subscription_tier && userRow.subscription_tier !== 'free') {
      activeTier = userRow.subscription_tier as PlanType;
    }

    if (subRow && (subRow.status === 'active' || subRow.status === 'trialing')) {
      const priceId = subRow.stripe_price_id || '';
      const yearlyPriceId = process.env.STRIPE_LIFETIME_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;
      const monthlyPriceId = process.env.STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

      if (yearlyPriceId && priceId === yearlyPriceId) {
        activeTier = 'pro_yearly';
      } else if (monthlyPriceId && priceId === monthlyPriceId) {
        activeTier = 'pro_monthly';
      } else if (priceId.toLowerCase().includes('yearly') || priceId.toLowerCase().includes('annual') || priceId.toLowerCase().includes('lifetime')) {
        activeTier = 'pro_yearly';
      } else if (priceId.toLowerCase().includes('monthly') || priceId.toLowerCase().includes('pro')) {
        activeTier = 'pro_monthly';
      } else if (!userRow?.subscription_tier || userRow.subscription_tier === 'free') {
        activeTier = 'pro_monthly';
      }
    }

    const correctLimit = getGenerationLimit(activeTier);
    const fetchedUsage = userRow?.generations_used_this_month ?? 0;

    // Auto-reconcile public.users table in PostgreSQL if out of sync
    if (userRow && (userRow.subscription_tier !== activeTier || userRow.monthly_generation_limit !== correctLimit)) {
      await supabaseAdmin
        .from('users')
        .update({
          subscription_tier: activeTier,
          monthly_generation_limit: correctLimit,
        })
        .eq('id', userId);
    }

    const cleanEmail = userRow?.email || authUserEmail || '';
    const emailPrefixName = cleanEmail
      ? cleanEmail
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\d+/g, ' ')
          .trim()
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
      : 'Creator';

    const cleanFullName = userRow?.full_name || authUserMetadataName || emailPrefixName;

    return NextResponse.json({
      id: userId,
      email: cleanEmail,
      fullName: cleanFullName,
      subscriptionTier: activeTier,
      generationsUsedThisMonth: fetchedUsage,
      monthlyGenerationLimit: correctLimit,
      hasSeenReviewPrompt: userRow?.has_seen_review_prompt || false,
    });
  } catch (err: any) {
    console.error('[User Profile API Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch user profile.' }, { status: 500 });
  }
}
