import { NextResponse } from 'next/server';
import { generateContentWithClaude } from '@/lib/anthropic';
import {
  isSupabaseConfigured,
  supabase,
  reserveUserGenerationAtomic,
  rollbackUserGenerationAtomic,
  saveGenerationRecord,
  getUserProfile,
} from '@/lib/supabase';
import { GenerationRequest, OutputFormat, NicheType, ToneStyle } from '@/lib/types';
import { getGenerationLimit } from '@/lib/plans';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      transcript,
      niche,
      selectedFormats,
      tone = 'energetic',
      brandVoice,
      customApiKey,
      userId: bodyUserId,
    } = body as {
      transcript: string;
      niche: NicheType;
      selectedFormats: OutputFormat[];
      tone?: ToneStyle;
      brandVoice?: string;
      customApiKey?: string;
      userId?: string;
    };

    // 1. Authenticate the User
    let authenticatedUserId: string | undefined;

    // Check Bearer Token in Authorization header
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

    // Fallback check session or provided userId if valid
    if (!authenticatedUserId && bodyUserId && bodyUserId !== 'guest-user' && bodyUserId !== 'demo-user-1') {
      authenticatedUserId = bodyUserId;
    }

    // If Supabase is configured and no authenticated user was identified, reject request
    if (isSupabaseConfigured() && !authenticatedUserId && !customApiKey) {
      return NextResponse.json(
        { error: 'UNAUTHENTICATED', message: 'Please log in to generate content.' },
        { status: 401 }
      );
    }

    const effectiveUserId = authenticatedUserId || bodyUserId || 'demo-user-1';

    // 2. Input Validation & Cost Protection
    if (!transcript || !transcript.trim()) {
      return NextResponse.json(
        { error: 'INVALID_TRANSCRIPT', message: 'Please enter a transcript before generating.' },
        { status: 400 }
      );
    }

    if (transcript.length > 50000) {
      return NextResponse.json(
        { error: 'TRANSCRIPT_TOO_LARGE', message: 'Transcript exceeds maximum limit of 50,000 characters.' },
        { status: 400 }
      );
    }

    if (!niche || !['podcaster', 'youtuber', 'coach'].includes(niche)) {
      return NextResponse.json(
        { error: 'INVALID_NICHE', message: 'Valid niche selector is required.' },
        { status: 400 }
      );
    }

    if (!selectedFormats || !Array.isArray(selectedFormats) || selectedFormats.length === 0) {
      return NextResponse.json(
        { error: 'INVALID_FORMATS', message: 'At least one output format must be selected.' },
        { status: 400 }
      );
    }

    // 3. Atomic Server-Side Generation Limit Check & Quota Reservation BEFORE calling AI API
    let reservedUsageCount: number | undefined;
    let userLimit = 3;

    if (!customApiKey) {
      const reservation = await reserveUserGenerationAtomic(effectiveUserId);
      userLimit = reservation.limit || 3;

      if (!reservation.success) {
        return NextResponse.json(
          {
            error: 'GENERATION_LIMIT_REACHED',
            message: "You've reached your generation limit. Upgrade to Pro to continue.",
            limitReached: true,
            currentUsage: reservation.newUsage || userLimit,
            limit: userLimit,
          },
          { status: 429 }
        );
      }
      reservedUsageCount = reservation.newUsage;
    }

    // 4. Invoke Anthropic Claude AI (Only reached if quota reserved or custom key present)
    let outputs: Record<string, string>;
    try {
      const requestPayload: GenerationRequest = {
        transcript,
        niche,
        selectedFormats,
        tone,
        brandVoice,
        customApiKey,
      };
      outputs = await generateContentWithClaude(requestPayload);
    } catch (aiError: any) {
      console.error('Anthropic API Call Failed:', aiError);
      // Rollback reserved quota so user is not penalized for AI errors
      if (reservedUsageCount !== undefined) {
        await rollbackUserGenerationAtomic(effectiveUserId);
      }
      
      const customKeyMsg = customApiKey && (aiError?.message?.includes('no longer valid') || aiError?.message?.includes('revalidate'))
        ? 'Your Anthropic API key is no longer valid. Please update or revalidate your key.'
        : null;

      return NextResponse.json(
        {
          error: customKeyMsg ? 'CUSTOM_KEY_INVALID' : 'AI_API_FAILURE',
          message: customKeyMsg || aiError?.message || 'Something went wrong while generating your content. Please try again.',
        },
        { status: customKeyMsg ? 400 : 500 }
      );
    }

    // 5. Save Generation Record after successful AI completion
    const savedRecord = await saveGenerationRecord(
      effectiveUserId,
      niche,
      transcript,
      selectedFormats,
      outputs,
      reservedUsageCount
    );

    const finalUsageCount = reservedUsageCount ?? savedRecord.newUsageCount;

    return NextResponse.json({
      success: true,
      result: savedRecord,
      generationsUsedThisMonth: finalUsageCount,
      remainingUsage: customApiKey ? 9999 : Math.max(0, userLimit - finalUsageCount),
      limit: userLimit,
    });
  } catch (error: any) {
    console.error('API /api/generate error:', error);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: error.message || 'Something went wrong while generating your content. Please try again.' },
      { status: 500 }
    );
  }
}
