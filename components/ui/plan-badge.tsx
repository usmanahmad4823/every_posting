'use client';

import React from 'react';
import Link from 'next/link';
import { PlanType, PlanStatus } from '@/lib/types';
import { ShieldAlert, Zap, Flame, Crown, AlertTriangle } from 'lucide-react';

interface PlanBadgeProps {
  plan?: PlanType;
  planStatus?: PlanStatus;
  className?: string;
  showUpdateLink?: boolean;
}

export function PlanBadge({
  plan = 'free',
  planStatus = 'active',
  className = '',
  showUpdateLink = true,
}: PlanBadgeProps) {
  // Override badge if planStatus is past_due or canceled
  if (planStatus === 'past_due' || planStatus === 'canceled') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
        <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
        <span className="uppercase tracking-wider">
          {planStatus === 'past_due' ? 'Past Due' : 'Canceled'}
        </span>
        {showUpdateLink && (
          <Link
            href="/pricing"
            className="ml-1 text-rose-800 underline hover:text-rose-950 font-bold"
          >
            Update billing →
          </Link>
        )}
      </div>
    );
  }

  // Active Plan Styles & Labels
  switch (plan) {
    case 'private_ltd':
    case 'appsumo_ltd':
    case 'lifetime':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-amber-500 text-white shadow-xs uppercase tracking-wider ${className}`}>
          <Crown className="w-3 h-3 fill-white shrink-0" />
          <span>Lifetime</span>
        </span>
      );

    case 'annual':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-purple-600 text-white shadow-xs uppercase tracking-wider ${className}`}>
          <Zap className="w-3 h-3 fill-white shrink-0" />
          <span>Pro (Annual)</span>
        </span>
      );

    case 'monthly':
    case 'pro':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-[#FF529A] text-white shadow-xs uppercase tracking-wider ${className}`}>
          <Zap className="w-3 h-3 fill-white shrink-0" />
          <span>Pro (Monthly)</span>
        </span>
      );

    case 'free':
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-[#52525B] border border-[#E4E4E7] uppercase tracking-wider ${className}`}>
          <span>Free</span>
        </span>
      );
  }
}
