'use client';

import Link from 'next/link';
import { Mic, PlaySquare, GraduationCap, Sparkles, ArrowRight, CheckCircle2, Zap, Layers } from 'lucide-react';
import { NicheFeaturesSection } from '@/components/landing/niche-features';

export default function DedicatedNichesPage() {
  const nicheProfiles = [
    {
      id: 'podcaster',
      icon: Mic,
      title: 'For Podcasters',
      subtitle: 'Audio-to-Text Distribution Engine',
      description: 'Turn 45-minute raw audio transcripts into polished Apple/Spotify show notes, guest highlight quotes, Twitter threads, and newsletter summaries.',
      badge: '🎙️ Podcast Creators',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'youtuber',
      icon: PlaySquare,
      title: 'For YouTubers',
      subtitle: 'Video Script Repurposing',
      description: 'Convert video transcripts into click-worthy YouTube descriptions, viral X threads, LinkedIn posts, and key summary keynotes.',
      badge: '🎥 Video Creators',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'coach',
      icon: GraduationCap,
      title: 'For Coaches & Consultants',
      subtitle: 'Lead Generation Copywriting',
      description: 'Transform client call recordings, course lesson outlines, and webinar scripts into high-ticket LinkedIn posts, framework breakdowns, and newsletter emails.',
      badge: '🎓 High-Ticket Coaches',
      color: 'from-[#FF529A] to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 bg-[#F5F5F7]">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FF529A]" />
          <span>Niche-Tailored AI System Prompts</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#0A0A0C] tracking-tight leading-tight">
          Built For Your Specific <span className="text-[#FF529A]">Content Niche</span>
        </h1>
        <p className="text-sm sm:text-base text-[#71717A] font-medium max-w-2xl mx-auto mt-3">
          Generic AI tools output bland text. EveryPosting uses custom prompt architectures tailored specifically to the vocabulary, tone, and audience expectations of your niche.
        </p>
      </div>

      {/* Niche Summary Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nicheProfiles.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="aiigen-card p-6 bg-white border border-[#E4E4E7] shadow-md hover:border-[#FF529A] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF529A]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold bg-pink-50 text-[#FF529A] px-2.5 py-1 rounded-full border border-pink-200">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0A0A0C]">{item.title}</h3>
                  <p className="text-xs font-bold text-[#FF529A] mb-2">{item.subtitle}</p>
                  <p className="text-xs text-[#52525B] font-medium leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#FF529A] hover:underline"
                >
                  <span>Try {item.title} Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Niche Features & Preview Component */}
      <NicheFeaturesSection />

      {/* CTA Footer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-[#0A0A0C] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF529A]/15 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
            Select Your Niche & <span className="text-[#FF529A]">Start Generating</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-6 font-medium">
            3 free generations included. Experience the power of niche-specific Claude 3.5 AI prompts today.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 btn-aiigen-primary px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl shadow-pink-500/25"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Open Studio App →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
