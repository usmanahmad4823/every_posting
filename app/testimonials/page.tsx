'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, Star, Heart, CheckCircle2, Trophy, Users, Zap, ShieldCheck } from 'lucide-react';
import { TestimonialsSection } from '@/components/landing/testimonials';
import { SocialProofSection } from '@/components/landing/social-proof';

export default function DedicatedTestimonialsPage() {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 bg-[#F5F5F7]">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4 shadow-xs">
          <Star className="w-3.5 h-3.5 fill-[#FF529A] text-[#FF529A]" />
          <span>Loved by 2,400+ Creators & Agency Founders</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#0A0A0C] tracking-tight max-w-3xl mx-auto leading-tight">
          Real Results From Real <span className="text-[#FF529A]">Content Creators</span>
        </h1>
        <p className="text-sm sm:text-base text-[#71717A] font-medium max-w-2xl mx-auto mt-3">
          See how Podcasters, YouTubers, and High-Ticket Coaches save 15+ hours every week and grow multi-channel reach automatically.
        </p>

        {/* Aggregate Review Pill */}
        <div className="mt-6 inline-flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-[#E4E4E7] shadow-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-extrabold text-[#0A0A0C]">
            4.9 / 5.0 Rating <span className="text-[#71717A] font-medium">(280+ Verified Reviews)</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Testimonials Component */}
      <TestimonialsSection />

      {/* Social Proof Statistics */}
      <div className="mt-12">
        <SocialProofSection />
      </div>

      {/* CTA Footer Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-[#0A0A0C] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF529A]/15 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
            Ready to Automate Your <span className="text-[#FF529A]">Content Repurposing?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-6">
            Join 2,400+ creators saving 15 hours a week. Get started with 3 free generations — no credit card required.
          </p>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 btn-aiigen-primary px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl shadow-pink-500/25"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
