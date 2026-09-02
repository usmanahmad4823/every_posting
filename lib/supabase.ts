import { createClient } from '@supabase/supabase-js';
import { GenerationResult, NicheType, OutputFormat, UserProfile, FeedbackData } from './types';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://demo-everyposting.supabase.co';

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'demo-anon-key';

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// In-memory demo store fallback when Supabase connection is not yet configured
let mockGenerationHistory: GenerationResult[] = [];
let mockUserUsageCount = 3; // Start with 3/10 used for demo
let mockFeedbackRecords: FeedbackData[] = [];
let mockHasSeenReviewPrompt = false;

// Check if real Supabase keys are configured
export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseUrl.includes('demo-everyposting') &&
    !!supabaseAnonKey &&
    !supabaseAnonKey.includes('demo-anon-key')
  );
}

// REAL SUPABASE SIGN UP FUNCTION
export async function signUpUser(fullName: string, email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
  const cleanName = fullName.trim() || email.split('@')[0];

  if (!isSupabaseConfigured()) {
    // Demo Mode Fallback
    localStorage.setItem('everyposting_user', JSON.stringify({ fullName: cleanName, email, loggedIn: true, tier: 'free' }));
    return { success: true, user: { email, fullName: cleanName } };
  }

  try {
    // 1. Create Auth User in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: cleanName },
      },
    });

    if (authError) return { success: false, error: authError.message };

    const userId = authData.user?.id;

    if (userId) {
      // 2. Save User Record in Supabase `users` Table
      try {
        await supabase.from('users').upsert({
          id: userId,
          email,
          full_name: cleanName,
          subscription_tier: 'free',
          generations_used_this_month: 0,
          monthly_generation_limit: 10,
          has_seen_review_prompt: false,
        });
      } catch (dbErr) {
        console.warn('[Supabase DB Upsert Notice]:', dbErr);
      }
    }

    localStorage.setItem('everyposting_user', JSON.stringify({ id: userId, fullName: cleanName, email, loggedIn: true, tier: 'free' }));
    return { success: true, user: authData.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to sign up in Supabase' };
  }
}

// REAL SUPABASE SIGN IN FUNCTION
export async function signInUser(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
  // Generate clean name from email prefix if metadata missing
  const formattedEmailName = email
    .split('@')[0]
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (!isSupabaseConfigured()) {
    // Demo Mode Fallback: Preserve existing name if logged in previously
    const existing = localStorage.getItem('everyposting_user');
    let existingName = formattedEmailName;
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (parsed.fullName) existingName = parsed.fullName;
      } catch {}
    }

    localStorage.setItem('everyposting_user', JSON.stringify({ fullName: existingName, email, loggedIn: true, tier: 'free' }));
    return { success: true, user: { email, fullName: existingName } };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const userId = data.user.id;
    const finalName = data.user?.user_metadata?.full_name || formattedEmailName;

    // Ensure User Record Exists in Supabase `users` Table upon every login
    try {
      await supabase.from('users').upsert({
        id: userId,
        email: data.user.email || email,
        full_name: finalName,
        subscription_tier: 'free',
        generations_used_this_month: 0,
        monthly_generation_limit: 10,
      }, { onConflict: 'id' });
    } catch (dbErr) {
      console.warn('[Supabase Sign-In DB Sync Warning]:', dbErr);
    }

    localStorage.setItem(
      'everyposting_user',
      JSON.stringify({ id: userId, fullName: finalName, email: data.user.email, loggedIn: true })
    );

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to sign in' };
  }
}

// REAL SUPABASE SIGN OUT
export async function signOutUser(): Promise<void> {
  localStorage.removeItem('everyposting_user');
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout warning:', e);
    }
  }
}

export async function getUserProfile(userId = 'demo-user-1'): Promise<UserProfile> {
  let storedUser: any = null;
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('everyposting_user');
    if (raw) {
      try {
        storedUser = JSON.parse(raw);
      } catch {}
    }
  }

  const fallbackName = storedUser?.fullName || 'Usman Ahmad';
  const fallbackEmail = storedUser?.email || 'usmanahmad4t12@gmail.com';

  if (!isSupabaseConfigured()) {
    return {
      id: userId,
      email: fallbackEmail,
      fullName: fallbackName,
      subscriptionTier: storedUser?.tier || 'free',
      generationsUsedThisMonth: mockUserUsageCount,
      monthlyGenerationLimit: 10,
      hasSeenReviewPrompt: mockHasSeenReviewPrompt,
    };
  }

  try {
    const { data: sessionUser } = await supabase.auth.getUser();
    const currentId = sessionUser.user?.id || userId;
    const metaName = sessionUser.user?.user_metadata?.full_name || storedUser?.fullName || fallbackName;
    const metaEmail = sessionUser.user?.email || storedUser?.email || fallbackEmail;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', currentId)
      .single();

    if (error || !data) {
      return {
        id: currentId,
        email: metaEmail,
        fullName: metaName,
        subscriptionTier: storedUser?.plan || storedUser?.tier || 'free',
        generationsUsedThisMonth: 0,
        monthlyGenerationLimit: (storedUser?.plan || storedUser?.tier) === 'free' ? 10 : 9999,
        hasSeenReviewPrompt: false,
      };
    }

    return {
      id: data.id,
      email: data.email || metaEmail,
      fullName: data.full_name || metaName,
      subscriptionTier: data.subscription_tier || 'free',
      generationsUsedThisMonth: data.generations_used_this_month || 0,
      monthlyGenerationLimit: data.monthly_generation_limit || 10,
      hasSeenReviewPrompt: data.has_seen_review_prompt || false,
    };
  } catch {
    return {
      id: userId,
      email: fallbackEmail,
      fullName: fallbackName,
      subscriptionTier: storedUser?.tier || 'free',
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

  if (isSupabaseConfigured()) {
    try {
      const { data: sessionUser } = await supabase.auth.getUser();
      const currentId = sessionUser.user?.id || userId;

      await supabase.from('generations').insert({
        user_id: currentId,
        niche,
        input_transcript: transcript,
        selected_formats: selectedFormats,
        outputs,
      });

      await supabase.rpc('increment_user_generations', { user_id_input: currentId });
    } catch (e) {
      console.warn('Supabase DB save warning (using in-memory fallback):', e);
    }
  }

  return newRecord;
}

export async function getGenerationHistory(_userId = 'demo-user-1'): Promise<GenerationResult[]> {
  if (!isSupabaseConfigured()) {
    return mockGenerationHistory;
  }

  try {
    const { data: sessionUser } = await supabase.auth.getUser();
    const currentId = sessionUser.user?.id || _userId;

    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', currentId)
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
  if (isSupabaseConfigured()) {
    try {
      const { data: sessionUser } = await supabase.auth.getUser();
      const currentId = sessionUser.user?.id || _userId;

      await supabase.from('generations').delete().eq('user_id', currentId);
    } catch (e) {
      console.warn('Failed to delete Supabase generations:', e);
    }
  }
}

export async function saveFeedbackRecord(feedback: FeedbackData): Promise<boolean> {
  mockFeedbackRecords.push(feedback);

  if (isSupabaseConfigured()) {
    try {
      const { data: sessionUser } = await supabase.auth.getUser();
      const currentId = sessionUser.user?.id || feedback.userId || 'demo-user-1';

      const { error } = await supabase.from('feedback').insert({
        user_id: currentId,
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
  if (isSupabaseConfigured()) {
    try {
      const { data: sessionUser } = await supabase.auth.getUser();
      const currentId = sessionUser.user?.id || userId;

      await supabase.from('users').update({ has_seen_review_prompt: true }).eq('id', currentId);
    } catch (e) {
      console.warn('Supabase user review prompt flag warning:', e);
    }
  }
}
