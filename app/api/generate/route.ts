import { NextResponse } from 'next/server';
import { generateContentWithClaude } from '@/lib/anthropic';
import { checkCanGenerate, saveGenerationRecord } from '@/lib/supabase';
import { GenerationRequest, OutputFormat, NicheType, ToneStyle } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      transcript,
      niche,
      selectedFormats,
      tone = 'energetic',
      brandVoice,
      customApiKey,
      userId = 'demo-user-1',
    } = body as {
      transcript: string;
      niche: NicheType;
      selectedFormats: OutputFormat[];
      tone?: ToneStyle;
      brandVoice?: string;
      customApiKey?: string;
      userId?: string;
    };

    // 1. Input Validation & Cost Protection
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

    // 2. Server-Side Generation Limit Check BEFORE Calling Anthropic AI
    const effectiveUserId = userId || 'guest-user';
    let userLimit = 3;

    if (!customApiKey) {
      const limitCheck = await checkCanGenerate(effectiveUserId);
      userLimit = limitCheck.limit || 3;
      if (!limitCheck.allowed) {
        return NextResponse.json(
          {
            error: 'GENERATION_LIMIT_REACHED',
            message: "You've reached your generation limit. Upgrade to Pro to continue.",
            limitReached: true,
            currentUsage: limitCheck.currentUsage,
            limit: limitCheck.limit,
          },
          { status: 429 }
        );
      }
    }

    // 3. Invoke Anthropic Claude AI (Only reached if user has available quota or custom key)
    const requestPayload: GenerationRequest = {
      transcript,
      niche,
      selectedFormats,
      tone,
      brandVoice,
      customApiKey,
    };
    const outputs = await generateContentWithClaude(requestPayload);

    // 4. Save Generation & Increment Usage Atomically ONLY After AI Success
    const savedRecord = await saveGenerationRecord(effectiveUserId, niche, transcript, selectedFormats, outputs);
    const newCount = savedRecord.newUsageCount;

    return NextResponse.json({
      success: true,
      result: savedRecord,
      generationsUsedThisMonth: newCount,
      remainingUsage: customApiKey ? 9999 : Math.max(0, userLimit - newCount),
      limit: userLimit,
    });
  } catch (error: any) {
    console.error('API /api/generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate repurposed content.' },
      { status: 500 }
    );
  }
}
