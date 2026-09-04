import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Simple in-memory rate limiter per user ID (max 5 validation attempts per 60 seconds)
const validationRateLimits = new Map<string, { count: number; resetAt: number }>();

export function maskApiKey(key: string): string {
  if (!key) return '';
  const trimmed = key.trim();
  if (trimmed.length <= 12) return 'sk-ant-****************';
  const prefix = trimmed.slice(0, 7); // sk-ant-
  const suffix = trimmed.slice(-4);
  const starsCount = Math.min(24, Math.max(12, trimmed.length - 11));
  const stars = '*'.repeat(starsCount);
  return `${prefix}${stars}${suffix}`;
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate User
    let authenticatedUserId: string | null = null;
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (isSupabaseConfigured()) {
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (!userErr && userData?.user) {
          authenticatedUserId = userData.user.id;
        }
      }
    }

    // Require authentication
    if (!authenticatedUserId && isSupabaseConfigured()) {
      return NextResponse.json(
        {
          valid: false,
          errorType: 'UNAUTHENTICATED',
          message: 'You must be signed in to validate an Anthropic API key.',
        },
        { status: 401 }
      );
    }

    const rateKey = authenticatedUserId || 'anon-client';
    const now = Date.now();
    const limitInfo = validationRateLimits.get(rateKey);

    if (limitInfo && now < limitInfo.resetAt) {
      if (limitInfo.count >= 5) {
        return NextResponse.json(
          {
            valid: false,
            errorType: 'RATE_LIMITED',
            message: 'Too many validation requests. Please wait 60 seconds before trying again.',
          },
          { status: 429 }
        );
      }
      limitInfo.count += 1;
    } else {
      validationRateLimits.set(rateKey, { count: 1, resetAt: now + 60000 });
    }

    // 2. Parse payload
    const body = await req.json().catch(() => ({}));
    const { apiKey } = body as { apiKey?: string };

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        {
          valid: false,
          errorType: 'EMPTY',
          message: 'Enter your Anthropic API key',
        },
        { status: 400 }
      );
    }

    const trimmedKey = apiKey.trim();

    // 3. String format sanity check (Must start with sk-ant- and have reasonable length)
    if (!trimmedKey.startsWith('sk-ant-') || trimmedKey.length < 20) {
      return NextResponse.json(
        {
          valid: false,
          errorType: 'INVALID_KEY',
          message: '✕ Invalid Anthropic API key',
        },
        { status: 200 }
      );
    }

    // 4. Server-Side Lightweight API Request against Anthropic
    try {
      const anthropic = new Anthropic({ apiKey: trimmedKey });
      
      // Perform lightweight 1-token query to validate authentication without heavy completion costs
      await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'ping' }],
      });

      // API Key is valid! Return masked key and success message
      return NextResponse.json({
        valid: true,
        maskedKey: maskApiKey(trimmedKey),
        message: '✓ API key is valid',
      });
    } catch (err: any) {
      const status = err?.status || err?.statusCode;
      const errMsg = (err?.message || '').toLowerCase();

      // Categorize Anthropic API errors accurately
      if (status === 401 || err instanceof Anthropic.AuthenticationError || errMsg.includes('401') || errMsg.includes('auth') || errMsg.includes('invalid api key')) {
        return NextResponse.json({
          valid: false,
          errorType: 'INVALID_KEY',
          message: '✕ Invalid Anthropic API key',
        });
      }

      if (status === 403 || err instanceof Anthropic.PermissionDeniedError || errMsg.includes('permission') || errMsg.includes('access')) {
        return NextResponse.json({
          valid: false,
          errorType: 'PERMISSION_DENIED',
          message: 'Your Anthropic API key is valid, but it does not have the required API access.',
        });
      }

      if (status === 429 || err instanceof Anthropic.RateLimitError || errMsg.includes('rate limit')) {
        return NextResponse.json({
          valid: false,
          errorType: 'RATE_LIMITED',
          message: 'Anthropic temporarily rate-limited this validation request. Please try again later.',
        });
      }

      if (status === 402 || errMsg.includes('credit') || errMsg.includes('billing') || errMsg.includes('balance') || errMsg.includes('payment')) {
        return NextResponse.json({
          valid: false,
          errorType: 'BILLING_ISSUE',
          message: 'Your Anthropic API key is valid, but your Anthropic account may have a billing or usage issue.',
        });
      }

      if (err instanceof Anthropic.APIConnectionError || errMsg.includes('fetch failed') || errMsg.includes('network') || errMsg.includes('connection')) {
        return NextResponse.json({
          valid: false,
          errorType: 'NETWORK_ERROR',
          message: 'Unable to validate the API key right now. Please try again later.',
        });
      }

      return NextResponse.json({
        valid: false,
        errorType: 'ERROR',
        message: '⚠ Unable to validate the API key. Please try again.',
      });
    }
  } catch (error: any) {
    console.error('[Validate Key Endpoint Error]:', error);
    return NextResponse.json(
      {
        valid: false,
        errorType: 'SERVER_ERROR',
        message: '⚠ Unable to validate the API key. Please try again.',
      },
      { status: 500 }
    );
  }
}
