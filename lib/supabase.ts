import { createClient } from '@supabase/supabase-js';
import { GenerationResult, NicheType, OutputFormat, UserProfile, FeedbackData } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-everyposting.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In-memory demo store fallback when Supabase connection is not yet configured
let mockGenerationHistory: GenerationResult[] = [];
let mockUserUsageCount = 3; // Start with 3/10 used for demo
let mockFeedbackRecords: FeedbackData[] = [];
let mockHasSeenReviewPrompt = false;

export async function getUserProfile(userId = 'demo-user-1'): Promise<UserProfile> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase')) {
    return {
      id: userId,
      email: 'creator@everyposting.com',
      fullName: 'Alex River',
      subscriptionTier: 'free',
      generationsUsedThisMonth: mockUserUsageCount,
      monthlyGenerationLimit: 10,
      hasSeenReviewPrompt: mockHasSeenReviewPrompt,
    };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return {
        id: userId,
        email: 'creator@everyposting.com',
        fullName: 'Alex River',
        subscriptionTier: 'free',
        generationsUsedThisMonth: mockUserUsageCount,
        monthlyGenerationLimit: 10,
        hasSeenReviewPrompt: mockHasSeenReviewPrompt,
      };
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      subscriptionTier: data.subscription_tier || 'free',
      generationsUsedThisMonth: data.generations_used_this_month || 0,
      monthlyGenerationLimit: data.monthly_generation_limit || 10,
      hasSeenReviewPrompt: data.has_seen_review_prompt || false,
    };
  } catch {
    return {
      id: userId,
      email: 'creator@everyposting.com',
      fullName: 'Alex River',
      subscriptionTier: 'free',
      generationsUsedThisMonth: mockUserUsageCount,
      monthlyGenerationLimit: 10,
      hasSeenReviewPrompt: mockHasSeenReviewPrompt,
    };
  }
}

export async function checkCanGenerate(userId = 'demo-user-1'): Promise<{ allowed: boolean; remaining: number }> {
  const profile = await getUserProfile(userId);

  if (profile.subscriptionTier === 'pro' || profile.subscriptionTier === 'lifetime') {
    return { allowed: true, remaining: 9999 };
  }

  const remaining = profile.monthlyGenerationLimit - profile.generationsUsedThisMonth;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
  };
}

export async function saveGenerationRecord(
  userId = 'demo-user-1',
  niche: NicheType,
  transcript: string,
  selectedFormats: OutputFormat[],
  outputs: Partial<Record<OutputFormat, string>>
): Promise<GenerationResult> {
  const newRecord: GenerationResult = {
    id: `gen-${Date.now()}`,
    niche,
    createdAt: new Date().toISOString(),
    outputs,
    transcriptSnippet: transcript.slice(0, 100) + '...',
  };

  mockUserUsageCount += 1;
  mockGenerationHistory.unshift(newRecord);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase')) {
    try {
      await supabase.from('generations').insert({
        user_id: userId,
        niche,
        input_transcript: transcript,
        selected_formats: selectedFormats,
        outputs,
      });

      await supabase.rpc('increment_user_generations', { user_id_input: userId });
    } catch (e) {
      console.warn('Supabase DB save warning (using in-memory fallback):', e);
    }
  }

  return newRecord;
}

export async function getGenerationHistory(_userId = 'demo-user-1'): Promise<GenerationResult[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase')) {
    return mockGenerationHistory;
  }

  try {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return mockGenerationHistory;

    return data.map((item) => ({
      id: item.id,
      niche: item.niche as NicheType,
      createdAt: item.created_at,
      outputs: item.outputs,
      transcriptSnippet: item.input_transcript ? item.input_transcript.slice(0, 100) + '...' : '',
    }));
  } catch {
    return mockGenerationHistory;
  }
}

export async function clearGenerationHistory(_userId = 'demo-user-1'): Promise<void> {
  mockGenerationHistory = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase')) {
    try {
      await supabase.from('generations').delete().eq('user_id', _userId);
    } catch (e) {
      console.warn('Failed to delete Supabase generations:', e);
    }
  }
}

export async function saveFeedbackRecord(feedback: FeedbackData): Promise<boolean> {
  mockFeedbackRecords.push(feedback);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase')) {
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: feedback.userId || 'demo-user-1',
        generation_id: feedback.generationId || null,
        rating: feedback.rating,
        review_text: feedback.reviewText || null,
        source: feedback.source,
      });

      if (error) throw error;
    } catch (e) {
      console.warn('Supabase Feedback save warning (in-memory saved):', e);
    }
  }

  return true;
}

export async function markUserSeenReviewPrompt(userId = 'demo-user-1'): Promise<void> {
  mockHasSeenReviewPrompt = true;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase')) {
    try {
      await supabase.from('users').update({ has_seen_review_prompt: true }).eq('id', userId);
    } catch (e) {
      console.warn('Supabase user review prompt flag warning:', e);
    }
  }
}
