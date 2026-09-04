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
    <section id="niches" className="py-8 sm:py-10 bg-[#F5F5F7] relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="aiigen-pill mb-2 border-[#FFC2DA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF529A]" />
            <span className="text-[#0A0A0C] text-xs">Tailored Creator AI Agents</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-aiigen-title tracking-tight mt-1">
            Smart decisions in real time for your niche
          </h2>
          <p className="mt-2 text-[#52525B] text-xs sm:text-base font-medium">
            Empowered by advanced AI, EveryPosting analyzes transcripts and formats content tuned specifically for your audience.
          </p>
        </div>

        {/* Niche Tabs */}
        <div className="flex justify-center mb-4 sm:mb-5 max-w-full px-2">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white border border-[#FFC2DA] shadow-sm max-w-full">
            <button
              onClick={() => handleNicheChange('podcaster')}
              className={`flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-sm transition-all whitespace-nowrap ${
                activeNicheTab === 'podcaster'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-white shrink-0" />
              <span>Podcasters</span>
            </button>
            <button
              onClick={() => handleNicheChange('youtuber')}
              className={`flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-sm transition-all whitespace-nowrap ${
                activeNicheTab === 'youtuber'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              <PlaySquare className="w-3 h-3 sm:w-4 sm:h-4 text-white shrink-0" />
              <span className="sm:hidden">YouTube</span>
              <span className="hidden sm:inline">YouTube Creators</span>
            </button>
            <button
              onClick={() => handleNicheChange('coach')}
              className={`flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-sm transition-all whitespace-nowrap ${
                activeNicheTab === 'coach'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-white shrink-0" />
              <span className="sm:hidden">Coaches</span>
              <span className="hidden sm:inline">Coaches & Consultants</span>
            </button>
          </div>
        </div>

        {/* Interactive Feature Panel */}
        <div className="aiigen-card p-3 sm:p-8 bg-white border border-[#E4E4E7] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column: Description & Format Selection */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-pink-50 text-[#FF529A] border border-pink-200 mb-3 sm:mb-4">
                  {currentNiche.badge} Engine
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-[#0A0A0C] mb-2 sm:mb-3 tracking-tight">
                  {currentNiche.title} Repurposing
                </h3>
                <p className="text-[#52525B] text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium">
                  {currentNiche.subtitle}
                </p>

                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[#71717A] font-bold mb-2.5">
                  Supported Output Formats:
                </p>
                <div className="space-y-2">
                  {currentNiche.supportedFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setActiveFormatTab(format.id)}
                      className={`w-full text-left p-2.5 sm:p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between ${
                        activeFormatTab === format.id
                          ? 'bg-pink-50 border-[#FF529A] text-[#0A0A0C] font-semibold shadow-xs'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#FF529A]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[#0A0A0C] flex items-center gap-1.5">
                          <span>{format.label}</span>
                          {activeFormatTab === format.id && (
                            <span className="w-2 h-2 rounded-full bg-[#FF529A] animate-pulse" />
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 font-normal">{format.description}</p>
                      </div>
                      {activeFormatTab === format.id && (
                        <Sparkles className="w-4 h-4 text-[#FF529A] shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Output Tab Box */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-[#FFF0F6] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-pink-200">
              <div>
                <div className="flex flex-row items-center justify-between gap-1 pb-2.5 mb-2.5 border-b border-pink-200">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-[#0A0A0C] truncate">
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
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold bg-white text-[#FF529A] border border-[#FFC2DA] flex items-center gap-1 transition-colors shadow-xs shrink-0"
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
                    className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-[#FFC2DA] text-xs sm:text-sm text-[#1E293B] leading-relaxed font-sans whitespace-pre-line min-h-[220px] sm:min-h-[300px] max-h-[350px] sm:max-h-[420px] overflow-y-auto"
                  >
                    {currentNiche.mockOutput[activeFormatTab] || (
                      <p className="text-[#94A3B8] italic">
                        Select a format on the left to preview generated content for {currentNiche.title}.
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 pt-2.5 border-t border-pink-200 flex flex-row items-center justify-between gap-1 text-[9px] sm:text-xs text-[#64748B]">
                <span className="truncate">⚡ Formatted via Anthropic Claude 3.5 Sonnet</span>
                <span className="text-[#FF529A] font-bold shrink-0">100% Platform Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
