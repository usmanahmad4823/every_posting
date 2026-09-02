'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Mic, PlaySquare, GraduationCap, CheckCircle2, Copy, Play, Star } from 'lucide-react';
import { NICHE_CONFIGS } from '@/lib/prompts';
import { NicheType } from '@/lib/types';

// Custom SVG Icons for Platform Badges (Spotify, Apple Podcasts, Twitter/X, LinkedIn, YouTube, Claude, Substack, Instagram)
function SpotifyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#1DB954" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.18-1.14-.66-.12-.48.18-1.02.66-1.14 4.38-1.38 9.78-.72 13.5 1.56.36.24.54.84.241 1.32zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
    </svg>
  );
}

function TwitterXIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#0A0A0C" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#0A66C2" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#FF0000" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function ClaudeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#D97706" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
}

function ApplePodcastIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#A855F7" {...props}>
      <path d="M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2zm0 4a3 3 0 0 1 3 3v2a3 3 0 0 1-6 0V9a3 3 0 0 1 3-3zm4 7a4 4 0 0 1-8 0H6a6 6 0 0 0 12 0z" />
    </svg>
  );
}

export function HeroSection() {
  const [selectedNiche, setSelectedNiche] = useState<NicheType>('podcaster');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const activeConfig = NICHE_CONFIGS[selectedNiche];

  const handleCopyMock = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#F5F5F7] bg-aiigen-dots">
      {/* 360-DEGREE CONCENTRIC ORBITAL RINGS IN BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] md:w-[1150px] h-[650px] sm:h-[900px] md:h-[1150px] rounded-full border border-pink-500/10 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[700px] md:w-[900px] h-[480px] sm:h-[700px] md:h-[900px] rounded-full border border-[#FF529A]/15 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] md:w-[650px] h-[320px] sm:h-[500px] md:h-[650px] rounded-full border border-purple-500/10 pointer-events-none z-0" />

      {/* SOFT AMBIENT PINK & PURPLE BLUR GLOW BEHIND CENTER */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] rounded-full bg-[#FF529A]/15 blur-[120px] pointer-events-none z-0" />

      {/* FLOATING ORBITAL PLATFORM BADGES AROUND THE HERO */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-10 hidden md:block">
        {/* Top-Left: Spotify */}
        <motion.div
          animate={{ y: [-6, 6, -6], rotate: [-2, 3, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 left-12 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#FFC2DA] shadow-xl flex items-center gap-2.5 pointer-events-auto"
        >
          <SpotifyIcon className="w-6 h-6" />
          <span className="text-xs font-bold text-[#0A0A0C]">Spotify Podcasts</span>
        </motion.div>

        {/* Top-Right: Claude 3.5 Sonnet */}
        <motion.div
          animate={{ y: [6, -6, 6], rotate: [2, -3, 2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 right-16 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#FFC2DA] shadow-xl flex items-center gap-2.5 pointer-events-auto"
        >
          <ClaudeIcon className="w-6 h-6" />
          <span className="text-xs font-bold text-[#0A0A0C]">Claude 3.5 Engine</span>
        </motion.div>

        {/* Middle-Left: Apple Podcasts */}
        <motion.div
          animate={{ y: [8, -4, 8], rotate: [-3, 2, -3] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-72 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#FFC2DA] shadow-lg flex items-center gap-2 pointer-events-auto"
        >
          <ApplePodcastIcon className="w-5 h-5" />
          <span className="text-xs font-semibold text-[#0A0A0C]">Apple Audio</span>
        </motion.div>

        {/* Middle-Right: YouTube Video */}
        <motion.div
          animate={{ y: [-8, 6, -8], rotate: [3, -2, 3] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-64 right-8 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#FFC2DA] shadow-xl flex items-center gap-2.5 pointer-events-auto"
        >
          <YoutubeIcon className="w-6 h-6" />
          <span className="text-xs font-bold text-[#0A0A0C]">YouTube Video</span>
        </motion.div>

        {/* Bottom-Left: X / Twitter */}
        <motion.div
          animate={{ y: [-5, 7, -5] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-28 left-16 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#FFC2DA] shadow-lg flex items-center gap-2 pointer-events-auto"
        >
          <TwitterXIcon className="w-5 h-5" />
          <span className="text-xs font-semibold text-[#0A0A0C]">X Threads</span>
        </motion.div>

        {/* Bottom-Right: LinkedIn */}
        <motion.div
          animate={{ y: [7, -5, 7] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-24 right-14 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#FFC2DA] shadow-lg flex items-center gap-2 pointer-events-auto"
        >
          <LinkedinIcon className="w-5 h-5" />
          <span className="text-xs font-semibold text-[#0A0A0C]">LinkedIn Post</span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* TRUST / REVIEW BADGES ABOVE HEADLINE (Google 4.8 + Trustpilot 4.9) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#FFC2DA] text-xs font-semibold shadow-sm">
            <span className="text-amber-500 font-extrabold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.8
            </span>
            <span className="text-[#0A0A0C] font-bold">Google Reviews</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#FFC2DA] text-xs font-semibold shadow-sm">
            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" /> 4.9
            </span>
            <span className="text-[#0A0A0C] font-bold">Trustpilot Rating</span>
          </div>
        </motion.div>

        {/* MAIN BOLD HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold text-aiigen-title leading-[1.1] sm:leading-[1.08] tracking-tight">
            Intelligent AI agents that <span className="text-gradient-aura">work like your team</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-xs sm:text-xl text-[#52525B] max-w-2xl mx-auto leading-relaxed font-medium">
            AI content agents handle tasks, adapt to your niche needs, and boost productivity making social media repurposing faster, smarter, and effortless.
          </p>

          {/* DUAL ACTION BUTTONS */}
          <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto btn-aiigen-primary text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-2.5 shadow-xl shadow-pink-500/25"
            >
              <span>Get 14 Days Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto btn-aiigen-secondary text-xs sm:text-sm px-5 sm:px-7 py-3 sm:py-4 flex items-center justify-center gap-2 border-[#FFC2DA] hover:bg-[#FFF0F6]"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF529A] fill-[#FF529A]" />
              <span className="text-[#0A0A0C]">Request a Demo</span>
            </Link>
          </div>
        </motion.div>

        {/* INTERACTIVE NICHE SWITCHER PILLS */}
        <div className="mt-8 sm:mt-16 text-center">
          <p className="text-[9px] sm:text-xs uppercase tracking-widest text-[#71717A] font-extrabold mb-2.5 sm:mb-4">
            Select Your Niche Profile:
          </p>
          <div className="w-full max-w-full overflow-x-auto pb-1 flex justify-start sm:justify-center no-scrollbar">
            <div className="inline-flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white border border-[#FFC2DA] shadow-sm shrink-0 mx-auto max-w-full">
              <button
                onClick={() => setSelectedNiche('podcaster')}
                className={`flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-sm transition-all duration-200 whitespace-nowrap shrink-0 ${
                  selectedNiche === 'podcaster'
                    ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                    : 'text-[#71717A] hover:text-[#FF529A]'
                }`}
              >
                <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
                <span>Podcaster</span>
              </button>
              <button
                onClick={() => setSelectedNiche('youtuber')}
                className={`flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-sm transition-all duration-200 whitespace-nowrap shrink-0 ${
                  selectedNiche === 'youtuber'
                    ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                    : 'text-[#71717A] hover:text-[#FF529A]'
                }`}
              >
                <PlaySquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
                <span>YouTube Creator</span>
              </button>
              <button
                onClick={() => setSelectedNiche('coach')}
                className={`flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-sm transition-all duration-200 whitespace-nowrap shrink-0 ${
                  selectedNiche === 'coach'
                    ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/30'
                    : 'text-[#71717A] hover:text-[#FF529A]'
                }`}
              >
                <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
                <span>Coach & Consultant</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTRAL VISUAL: DYNAMIC MOCKUP WITH FLOATING ACTIVITY NOTIFICATION CARDS */}
        <div className="relative mt-6 sm:mt-8 max-w-5xl mx-auto">
          {/* Floating Notification Activity Card Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute -top-6 -left-6 z-30 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#FFC2DA] shadow-2xl"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-[#FF529A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0A0A0C]">Podcast Episode #42 Repurposed</div>
              <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Show Notes & 10-Tweet Thread Generated
              </div>
            </div>
          </motion.div>

          {/* Floating Notification Activity Card Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute -bottom-6 -right-6 z-30 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#FFC2DA] shadow-2xl"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <PlaySquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0A0A0C]">YouTube Video Script Transcribed</div>
              <div className="text-[11px] text-[#FF529A] font-medium">Converted to SEO Article & LinkedIn Story</div>
            </div>
          </motion.div>

          {/* Central Mockup Wrapped in Aura Gradient Border */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="aura-gradient-border relative z-20"
          >
            <div className="aura-gradient-border-inner p-2.5 sm:p-6 bg-white">
              {/* Top Window Header */}
              <div className="flex flex-row items-center justify-between gap-1 pb-3 mb-3 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 shrink-0" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 shrink-0" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs font-mono text-[#71717A] truncate">
                    everyposting-studio // {selectedNiche}-agent
                  </span>
                </div>
                <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold bg-pink-50 text-[#FF529A] border border-pink-200 shrink-0 whitespace-nowrap">
                  ● Live Agent Output
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedNiche}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6"
                >
                  {/* Input Transcript Column */}
                  <div className="md:col-span-5 flex flex-col justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFF5F9] border border-[#FFC2DA]">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] sm:text-xs font-bold text-[#71717A] uppercase tracking-wider">
                          Input Transcript ({activeConfig.title})
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#FF529A] font-mono">248 words</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#1E293B] font-mono leading-relaxed line-clamp-6 sm:line-clamp-10 whitespace-pre-line bg-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-[#FFC2DA]">
                        {activeConfig.sampleTranscript}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#FFC2DA] flex items-center justify-between text-[10px] sm:text-xs text-[#71717A]">
                      <span>Niche: <strong className="text-[#0A0A0C]">{activeConfig.title}</strong></span>
                      <span className="text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    </div>
                  </div>

                  {/* Converted Output Column */}
                  <div className="md:col-span-7 flex flex-col justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFF0F6] border border-pink-200 shadow-inner">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FF529A] shrink-0" />
                          <span className="text-[10px] sm:text-xs font-bold text-[#0A0A0C] uppercase tracking-wider">
                            AI Output: {activeConfig.supportedFormats[0].label}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleCopyMock(
                              activeConfig.mockOutput[activeConfig.supportedFormats[0].id] || '',
                              activeConfig.supportedFormats[0].id
                            )
                          }
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-white hover:bg-pink-50 text-[#FF529A] border border-[#FFC2DA] flex items-center gap-1 transition-colors shadow-xs"
                        >
                          {copiedFormat === activeConfig.supportedFormats[0].id ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-[#FF529A]" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-[#FFC2DA] text-xs sm:text-sm text-[#1E293B] font-sans leading-relaxed whitespace-pre-line max-h-[220px] sm:max-h-[260px] overflow-y-auto">
                        {activeConfig.mockOutput[activeConfig.supportedFormats[0].id]}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#FFC2DA] flex items-center justify-between text-[10px] sm:text-xs text-[#71717A]">
                      <span>Formats generated: <strong className="text-[#0A0A0C]">{activeConfig.supportedFormats.length} formats</strong></span>
                      <Link href="/dashboard" className="text-[#FF529A] hover:underline font-bold flex items-center gap-1">
                        Open Studio →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM TRUSTED-BY CUSTOMER LOGO BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 pt-8 border-t border-[#E4E4E7] text-center"
        >
          <p className="text-xs uppercase tracking-widest text-[#71717A] font-bold mb-6">
            Trusted by 25,000+ creators, podcasters, YouTubers & coaches worldwide
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm font-extrabold text-[#71717A]/80 tracking-wider">
            <span className="hover:text-[#0A0A0C] transition-colors cursor-default">SPOTIFY PODCASTS</span>
            <span className="hover:text-[#0A0A0C] transition-colors cursor-default">APPLE PODCASTS</span>
            <span className="hover:text-[#0A0A0C] transition-colors cursor-default">YOUTUBE CREATORS</span>
            <span className="hover:text-[#0A0A0C] transition-colors cursor-default">SUBSTACK READERS</span>
            <span className="hover:text-[#0A0A0C] transition-colors cursor-default">LINKEDIN TOP VOICES</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
