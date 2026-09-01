'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, PlaySquare, GraduationCap, CheckCircle2, Copy, Sparkles } from 'lucide-react';
import { NICHE_CONFIGS } from '@/lib/prompts';
import { NicheType, OutputFormat } from '@/lib/types';

export function NicheFeaturesSection() {
  const [activeNicheTab, setActiveNicheTab] = useState<NicheType>('podcaster');
  const [activeFormatTab, setActiveFormatTab] = useState<OutputFormat>('show_notes');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const currentNiche = NICHE_CONFIGS[activeNicheTab];

  const handleNicheChange = (niche: NicheType) => {
    setActiveNicheTab(niche);
    setActiveFormatTab(NICHE_CONFIGS[niche].supportedFormats[0].id);
  };

  const handleCopy = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatId);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <section id="features" className="py-24 bg-[#F5F5F7] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="aiigen-pill mb-3 border-[#FFC2DA]">
            <span className="w-2 h-2 rounded-full bg-[#FF529A]" />
            <span className="text-[#0A0A0C]">Tailored Creator AI Agents</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-aiigen-title tracking-tightest mt-2">
            Smart decisions in real time for your niche
          </h2>
          <p className="mt-4 text-[#52525B] text-base sm:text-lg font-medium">
            Empowered by advanced AI, EveryPosting analyzes transcripts and formats content tuned specifically for your audience.
          </p>
        </div>

        {/* Niche Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#FFC2DA] shadow-sm gap-2">
            <button
              onClick={() => handleNicheChange('podcaster')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeNicheTab === 'podcaster'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              <Mic className="w-4 h-4 text-white" />
              <span>Podcasters</span>
            </button>
            <button
              onClick={() => handleNicheChange('youtuber')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeNicheTab === 'youtuber'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              <PlaySquare className="w-4 h-4 text-white" />
              <span>YouTube Creators</span>
            </button>
            <button
              onClick={() => handleNicheChange('coach')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeNicheTab === 'coach'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Coaches & Consultants</span>
            </button>
          </div>
        </div>

        {/* Interactive Feature Panel */}
        <div className="aiigen-card p-6 sm:p-8 bg-white border border-[#E4E4E7] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Description & Format Selection */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#FF529A] border border-pink-200 mb-4">
                  {currentNiche.badge} Engine
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] mb-3 tracking-tight">
                  {currentNiche.title} Repurposing
                </h3>
                <p className="text-[#52525B] text-sm sm:text-base leading-relaxed mb-6 font-medium">
                  {currentNiche.subtitle}
                </p>

                <p className="text-xs uppercase tracking-wider text-[#71717A] font-bold mb-3">
                  Supported Output Formats:
                </p>
                <div className="space-y-2.5">
                  {currentNiche.supportedFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setActiveFormatTab(format.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start justify-between ${
                        activeFormatTab === format.id
                          ? 'bg-pink-50 border-[#FF529A] text-[#0A0A0C] font-semibold shadow-sm'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#FF529A]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[#0A0A0C] flex items-center gap-2">
                          <span>{format.label}</span>
                          {activeFormatTab === format.id && (
                            <span className="w-2 h-2 rounded-full bg-[#FF529A] animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5 font-normal">{format.description}</p>
                      </div>
                      {activeFormatTab === format.id && (
                        <Sparkles className="w-4 h-4 text-[#FF529A] shrink-0 mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Output Tab Box */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-[#FFF0F6] rounded-2xl p-5 border border-pink-200">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-pink-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0A0A0C]">
                      OUTPUT PREVIEW: {currentNiche.supportedFormats.find((f) => f.id === activeFormatTab)?.label}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        currentNiche.mockOutput[activeFormatTab] || 'Format preview generated!',
                        activeFormatTab
                      )
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#FF529A] border border-[#FFC2DA] flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {copiedFormat === activeFormatTab ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#FF529A]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFormatTab + activeNicheTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-[#FFC2DA] text-sm text-[#1E293B] leading-relaxed font-sans whitespace-pre-line min-h-[300px] max-h-[420px] overflow-y-auto"
                  >
                    {currentNiche.mockOutput[activeFormatTab] || (
                      <p className="text-[#94A3B8] italic">
                        Select a format on the left to preview generated content for {currentNiche.title}.
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200 flex items-center justify-between text-xs text-[#64748B]">
                <span>⚡ Formatted via Anthropic Claude 3.5 Sonnet</span>
                <span className="text-[#FF529A] font-bold">100% Platform Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
