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

    if (!transcript || !transcript.trim()) {
      return NextResponse.json({ error: 'Transcript text is required.' }, { status: 400 });
    }

    if (!niche || !['podcaster', 'youtuber', 'coach'].includes(niche)) {
      return NextResponse.json({ error: 'Valid niche selector is required.' }, { status: 400 });
    }

    if (!selectedFormats || !Array.isArray(selectedFormats) || selectedFormats.length === 0) {
      return NextResponse.json({ error: 'At least one output format must be selected.' }, { status: 400 });
    }

    // 1. Check free generation limit (skip check if custom API key is supplied)
    if (!customApiKey) {
      const limitCheck = await checkCanGenerate(userId);
      if (!limitCheck.allowed) {
        return NextResponse.json(
          {
            error:
              'You have reached your 10 free generations limit for this month. Upgrade to Pro, Lifetime Deal, or enter your own Anthropic API Key in Settings for unlimited generations!',
            limitReached: true,
          },
          { status: 429 }
        );
      }
    }

    // 2. Build system prompt & call Claude API
    const requestPayload: GenerationRequest = {
      transcript,
      niche,
      selectedFormats,
      tone,
      brandVoice,
      customApiKey,
    };
    const outputs = await generateContentWithClaude(requestPayload);

    // 3. Save generation record & update usage count
    const savedRecord = await saveGenerationRecord(userId, niche, transcript, selectedFormats, outputs);

    return NextResponse.json({
      success: true,
      result: savedRecord,
      remainingUsage: customApiKey ? 9999 : 7,
    });
  } catch (error: any) {
    console.error('API /api/generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate repurposed content.' },
      { status: 500 }
    );
  }
}
