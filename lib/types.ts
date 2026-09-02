export type NicheType = 'podcaster' | 'youtuber' | 'coach';

export type OutputFormat =
  | 'twitter_thread'
  | 'linkedin_post'
  | 'show_notes'
  | 'blog_post'
  | 'instagram_captions'
  | 'quote_graphics';

export type ToneStyle = 'energetic' | 'professional' | 'viral' | 'storytelling';

export type FeedbackSource = 'per_generation' | 'milestone' | 'manual';

export interface GenerationRequest {
  transcript: string;
  niche: NicheType;
  selectedFormats: OutputFormat[];
  tone?: ToneStyle;
  brandVoice?: string;
  customApiKey?: string;
}

export interface GenerationResult {
  id: string;
  niche: NicheType;
  createdAt: string;
  outputs: Partial<Record<OutputFormat, string>>;
  transcriptSnippet: string;
  tone?: ToneStyle;
}

export type PlanType =
  | 'free'
  | 'private_ltd'
  | 'appsumo_ltd'
  | 'monthly'
  | 'annual'
  | 'pro'
  | 'lifetime';

export type PlanStatus = 'active' | 'canceled' | 'past_due';

export interface UserSessionState {
  id: string;
  email: string;
  fullName: string;
  plan: PlanType;
  planStatus: PlanStatus;
  generationsUsedThisMonth: number;
  monthlyGenerationLimit: number;
  hasSeenReviewPrompt?: boolean;
  loggedIn: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  subscriptionTier: PlanType;
  planStatus?: PlanStatus;
  generationsUsedThisMonth: number;
  monthlyGenerationLimit: number;
  hasSeenReviewPrompt?: boolean;
  customApiKey?: string;
}

export interface FeedbackData {
  rating: number;
  reviewText?: string;
  generationId?: string;
  source: FeedbackSource;
  userId?: string;
}

export interface NicheConfig {
  id: NicheType;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  accentGradient: string;
  supportedFormats: { id: OutputFormat; label: string; description: string }[];
  sampleTranscript: string;
  mockOutput: Partial<Record<OutputFormat, string>>;
}
