import { PlanType } from './types';

export interface PlanConfig {
  id: PlanType;
  name: string;
  generationLimit: number;
  interval: 'month' | 'year';
  price: number;
  stripePriceEnvKey: string;
  features: string[];
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free Plan',
    generationLimit: 3,
    interval: 'month',
    price: 0,
    stripePriceEnvKey: '',
    features: [
      '3 AI Generations per month',
      'Access to Podcaster, YouTube & Coach niches',
      'All 4 output formats (Show Notes, Threads, Posts, Emails)',
      'Basic AI processing',
    ],
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    generationLimit: 150,
    interval: 'month',
    price: 19,
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID',
    features: [
      '150 AI Generations per month',
      'Priority Claude 3.5 AI Engine speed',
      'All 3 creator niches & 4 output formats',
      'Brand Voice & Custom Tone customization',
      'Priority email & chat support',
    ],
  },
  pro_yearly: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    generationLimit: 1800,
    interval: 'year',
    price: 190,
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID', // Preserved env var key name
    features: [
      '1,800 AI Generations per year (Save ~20% / 2 Months Free!)',
      'Priority Claude 3.5 AI Engine speed',
      'All 3 creator niches & 4 output formats',
      'Brand Voice & Custom Tone customization',
      'VIP Dedicated creator support',
    ],
  },
};

// Aliases for backward compatibility
PLAN_CONFIGS['pro'] = PLAN_CONFIGS['pro_monthly'];
PLAN_CONFIGS['monthly'] = PLAN_CONFIGS['pro_monthly'];
PLAN_CONFIGS['pro_annual'] = PLAN_CONFIGS['pro_yearly'];
PLAN_CONFIGS['annual'] = PLAN_CONFIGS['pro_yearly'];
PLAN_CONFIGS['lifetime'] = PLAN_CONFIGS['pro_yearly'];

export function getPlanConfig(planType?: string): PlanConfig {
  if (!planType) return PLAN_CONFIGS.free;
  const key = planType.toLowerCase().trim();
  return PLAN_CONFIGS[key] || PLAN_CONFIGS.free;
}

export function getGenerationLimit(planType?: string): number {
  return getPlanConfig(planType).generationLimit;
}

export function formatLimitDisplay(usedCount: number, planType?: string): { used: number; limit: number; remaining: number; formatted: string } {
  const config = getPlanConfig(planType);
  const limit = config.generationLimit;
  const remaining = Math.max(0, limit - usedCount);
  const formatted = `${usedCount} / ${limit} generations used`;
  return { used: usedCount, limit, remaining, formatted };
}
