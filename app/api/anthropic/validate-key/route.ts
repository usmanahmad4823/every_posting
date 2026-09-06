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

    // 4. Server-Side Lightweight API Request against Anthropic with Multi-Model Fallback
    const anthropic = new Anthropic({ apiKey: trimmedKey });
    
    const modelsToTest = [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-latest',
      'claude-3-haiku-20240307',
    ];

    let workingModel: string | null = null;
    let lastError: any = null;

    for (const model of modelsToTest) {
      try {
        await anthropic.messages.create({
          model,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        });
        workingModel = model;
        break; // Key validated successfully!
      } catch (testErr: any) {
        lastError = testErr;
        const testStatus = testErr?.status || testErr?.statusCode;
        const testMsg = (testErr?.message || '').toLowerCase();
        // If key is completely invalid (401 Unauthorized), stop testing further models
        if (testStatus === 401 || testErr instanceof Anthropic.AuthenticationError || testMsg.includes('401') || testMsg.includes('auth') || testMsg.includes('invalid api key')) {
          break;
        }
      }
    }

    if (workingModel) {
      return NextResponse.json({
        valid: true,
        maskedKey: maskApiKey(trimmedKey),
        workingModel,
        message: '✓ API key is valid',
      });
    }

    // Handle specific error cases from last error
    const status = lastError?.status || lastError?.statusCode;
    const errMsg = (lastError?.message || '').toLowerCase();

    if (status === 401 || lastError instanceof Anthropic.AuthenticationError || errMsg.includes('401') || errMsg.includes('auth') || errMsg.includes('invalid api key')) {
      return NextResponse.json({
        valid: false,
        errorType: 'INVALID_KEY',
        message: '✕ Invalid Anthropic API key. Please check your key at console.anthropic.com/settings/keys.',
      });
    }

    if (status === 403 || lastError instanceof Anthropic.PermissionDeniedError || errMsg.includes('permission') || errMsg.includes('access') || errMsg.includes('disabled')) {
      return NextResponse.json({
        valid: false,
        errorType: 'PERMISSION_DENIED',
        message: 'Your API key is valid, but Anthropic returned a permission error. Add $5 credit balance at console.anthropic.com/settings/billing to enable API access.',
      });
    }

    if (status === 429 || lastError instanceof Anthropic.RateLimitError || errMsg.includes('rate limit')) {
      return NextResponse.json({
        valid: false,
        errorType: 'RATE_LIMITED',
        message: 'Anthropic rate-limited this check. Please wait 60 seconds and try again.',
      });
    }

    if (status === 402 || errMsg.includes('credit') || errMsg.includes('billing') || errMsg.includes('balance') || errMsg.includes('payment')) {
      return NextResponse.json({
        valid: false,
        errorType: 'BILLING_ISSUE',
        message: 'Your Anthropic API key requires prepaid credits. Add credit balance at console.anthropic.com/settings/billing.',
      });
    }

    if (lastError instanceof Anthropic.APIConnectionError || errMsg.includes('fetch failed') || errMsg.includes('network') || errMsg.includes('connection')) {
      return NextResponse.json({
        valid: false,
        errorType: 'NETWORK_ERROR',
        message: 'Unable to connect to Anthropic right now. Please try again.',
      });
    }

    return NextResponse.json({
      valid: false,
      errorType: 'ERROR',
      message: '⚠ Unable to validate API key. Please check your Anthropic Console settings.',
    });
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
