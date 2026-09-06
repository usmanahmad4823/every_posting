'use client';

import Link from 'next/link';
import { FileText, Sliders, Rocket, ArrowRight, Zap, CheckCircle2, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { HowItWorksSection } from '@/components/landing/how-it-works';

export default function DedicatedHowItWorksPage() {
  const formatBreakdown = [
    {
      format: 'Show Notes & Summary',
      niche: 'Podcaster & YouTuber',
      description: 'Timestamped overview, core takeaways, links mentioned, and episode summaries ready for Apple Podcasts & Spotify.',
    },
    {
      format: 'Twitter/X Viral Thread',
      niche: 'All Niches',
      description: '5 to 10 tweet hooks with punchy formatting, engagement line breaks, and retweet-friendly takeaways.',
    },
    {
      format: 'LinkedIn Thought Leadership',
      niche: 'Coach & Executive',
      description: 'Authoritative text posts formatted with strong opening hooks, space breaks, and engagement questions.',
    },
    {
      format: 'Email Newsletter Draft',
      niche: 'All Niches',
      description: 'Subject line ideas, conversational body copy, key takeaway bullets, and CTA directing readers back to your video/podcast.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 bg-[#F5F5F7]">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4 shadow-xs">
          <Zap className="w-3.5 h-3.5 fill-[#FF529A] text-[#FF529A]" />
          <span>Automated 3-Step Content Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#0A0A0C] tracking-tight leading-tight">
          How EveryPosting <span className="text-[#FF529A]">Repurposes Content</span>
        </h1>
        <p className="text-sm sm:text-base text-[#71717A] font-medium max-w-2xl mx-auto mt-3">
          Turn a 30-minute podcast or YouTube video into a week of high-converting social media posts in less than 30 seconds.
        </p>
      </div>

      {/* Main How It Works Steps Component */}
      <HowItWorksSection />

      {/* Output Formats Deep Dive Breakdown */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold tracking-wider uppercase text-[#FF529A] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            Supported Formats & Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0A0A0C] mt-2">
            What EveryPosting Generates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formatBreakdown.map((item) => (
            <div key={item.format} className="aiigen-card p-6 bg-white border border-[#E4E4E7] shadow-md hover:border-[#FF529A] transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-extrabold text-[#0A0A0C]">{item.format}</h3>
                <span className="text-[10px] font-extrabold bg-pink-50 text-[#FF529A] px-2.5 py-1 rounded-full border border-pink-200">
                  {item.niche}
                </span>
              </div>
              <p className="text-xs text-[#52525B] font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-[#0A0A0C] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#FF529A]/20 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
            See the Magic In Action On Your Next <span className="text-[#FF529A]">Transcript</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-6 font-medium">
            No manual copywriting required. Paste your script and let Claude 3.5 Sonnet handle distribution.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 btn-aiigen-primary px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl shadow-pink-500/25"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Open Studio Dashboard →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
