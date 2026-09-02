'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, CheckCircle2, Heart, Sparkles, TrendingUp, Zap, ThumbsUp } from 'lucide-react';
import { useSparkleBurst } from '@/components/ui/sparkle-burst';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  niche: 'podcaster' | 'youtuber' | 'coach';
  nicheLabel: string;
  nicheColor: string;
  rating: number;
  quote: string;
  impactBadge: string;
  metricIcon: any;
  avatar: string;
  initialReactions: { heart: number; clap: number; fire: number };
}

export function TestimonialsSection() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [reactions, setReactions] = useState<Record<string, { heart: number; clap: number; fire: number }>>({
    '1': { heart: 184, clap: 92, fire: 240 },
    '2': { heart: 310, clap: 145, fire: 412 },
    '3': { heart: 220, clap: 118, fire: 298 },
    '4': { heart: 165, clap: 88, fire: 195 },
    '5': { heart: 280, clap: 134, fire: 350 },
    '6': { heart: 195, clap: 105, fire: 260 },
  });

  const { triggerBurst, SparkleContainer } = useSparkleBurst();

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Marcus Vance',
      role: 'Host, The Tech Blueprint Podcast',
      niche: 'podcaster',
      nicheLabel: 'Podcaster',
      nicheColor: 'bg-pink-50 text-[#FF529A] border-pink-200',
      rating: 5,
      quote:
        'EveryPosting cut our post-production repurposing time from 6 hours down to 10 minutes per episode. The show notes and Twitter threads sound completely natural.',
      impactBadge: '⚡ 6 hrs saved per episode',
      metricIcon: Zap,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      initialReactions: { heart: 184, clap: 92, fire: 240 },
    },
    {
      id: '2',
      name: 'Elena Rostova',
      role: 'YouTube Creator (240k Subscribers)',
      niche: 'youtuber',
      nicheLabel: 'YouTube Creator',
      nicheColor: 'bg-[#FFF0F6] text-purple-600 border-purple-200',
      rating: 5,
      quote:
        'I used to pay a freelance copywriter $1,200/mo to convert my video scripts into Twitter threads. EveryPosting generates better hooks and format structures in 30 seconds.',
      impactBadge: '💰 Saved $1,200/mo copywriting fees',
      metricIcon: TrendingUp,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
      initialReactions: { heart: 310, clap: 145, fire: 412 },
    },
    {
      id: '3',
      name: 'David Sterling',
      role: 'High-Ticket Executive Coach',
      niche: 'coach',
      nicheLabel: 'Coach & Consultant',
      nicheColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rating: 5,
      quote:
        'After every webinar, I drop the transcript into EveryPosting. It creates LinkedIn posts that generate 5 to 10 inbound discovery calls every single week.',
      impactBadge: '📈 +10 Inbound Discovery Calls / wk',
      metricIcon: Sparkles,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      initialReactions: { heart: 220, clap: 118, fire: 298 },
    },
    {
      id: '4',
      name: 'Sarah Chen',
      role: 'Founder, SaaS Unfiltered Podcast',
      niche: 'podcaster',
      nicheLabel: 'Podcaster',
      nicheColor: 'bg-pink-50 text-[#FF529A] border-pink-200',
      rating: 5,
      quote:
        'The Claude 3.5 Sonnet integration is a game-changer! It picks up guest quotes and timestamps accurately without hallucinatory filler text.',
      impactBadge: '🎯 100% Transcript Precision',
      metricIcon: Zap,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
      initialReactions: { heart: 165, clap: 88, fire: 195 },
    },
    {
      id: '5',
      name: 'Alex Rivera',
      role: 'Educational Tech YouTuber (180k Subs)',
      niche: 'youtuber',
      nicheLabel: 'YouTube Creator',
      nicheColor: 'bg-[#FFF0F6] text-purple-600 border-purple-200',
      rating: 5,
      quote:
        'We repurposed 40 archived video scripts in one afternoon using EveryPosting. Our Twitter thread engagement grew by +340% in 30 days.',
      impactBadge: '🚀 +340% X/Twitter Reach',
      metricIcon: TrendingUp,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      initialReactions: { heart: 280, clap: 134, fire: 350 },
    },
    {
      id: '6',
      name: 'Dr. Emily Watson',
      role: 'Leadership & Business Consultant',
      niche: 'coach',
      nicheLabel: 'Coach & Consultant',
      nicheColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rating: 5,
      quote:
        'My team turns 1 hour client consulting calls into newsletter highlights and executive quote graphics effortlessly. Couldn’t run my practice without it.',
      impactBadge: '🎉 15 hrs saved per week',
      metricIcon: Sparkles,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
      initialReactions: { heart: 195, clap: 105, fire: 260 },
    },
  ];

  const filteredTestimonials =
    activeFilter === 'all' ? testimonials : testimonials.filter((t) => t.niche === activeFilter);

  const handleReactionClick = (e: React.MouseEvent<HTMLElement>, id: string, type: 'heart' | 'clap' | 'fire') => {
    triggerBurst(e);
    setReactions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: prev[id][type] + 1,
      },
    }));
  };

  return (
    <section id="testimonials" className="py-24 bg-[#F5F5F7] relative z-10 border-t border-[#E4E4E7] overflow-hidden">
      <SparkleContainer />

      {/* HAPPY CREATOR INFINITE TICKER MARQUEE BANNER */}
      <div className="bg-[#FF529A] text-white py-3 font-bold text-xs sm:text-sm tracking-wide overflow-hidden whitespace-nowrap mb-16 shadow-inner">
        <div className="inline-block animate-marquee">
          <span className="mx-6">🎉 &quot;EveryPosting saved me 15 hours last week!&quot;</span>
          <span className="mx-6">⭐ &quot;The Claude 3.5 Sonnet hooks are unreal!&quot;</span>
          <span className="mx-6">🚀 &quot;Repurposed 40 YouTube scripts in 1 afternoon!&quot;</span>
          <span className="mx-6">💰 &quot;Replaced $1,200/mo freelance copywriter!&quot;</span>
          <span className="mx-6">📈 &quot;+340% reach on Twitter & LinkedIn!&quot;</span>
        </div>
        <div className="inline-block animate-marquee" aria-hidden="true">
          <span className="mx-6">🎉 &quot;EveryPosting saved me 15 hours last week!&quot;</span>
          <span className="mx-6">⭐ &quot;The Claude 3.5 Sonnet hooks are unreal!&quot;</span>
          <span className="mx-6">🚀 &quot;Repurposed 40 YouTube scripts in 1 afternoon!&quot;</span>
          <span className="mx-6">💰 &quot;Replaced $1,200/mo freelance copywriter!&quot;</span>
          <span className="mx-6">📈 &quot;+340% reach on Twitter & LinkedIn!&quot;</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION WITH HAPPINESS INDEX */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="aiigen-pill mb-3 border-[#FFC2DA] bg-white inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[#0A0A0C] font-semibold whitespace-nowrap">99.4% Creator Happiness Score</span>
            <span className="text-[#FF529A] font-bold whitespace-nowrap">• 4.98/5.0 Stars</span>
          </div>

          <h2 className="text-2xl sm:text-5xl font-extrabold text-aiigen-title tracking-tightest mt-2">
            Stories that make creators <span className="text-gradient-aura">smile & scale</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-[#52525B] text-xs sm:text-lg font-medium leading-relaxed">
            See how top podcasters, YouTubers, and high-ticket coaches turn single transcripts into full content calendars with delight.
          </p>
        </div>

        {/* INTERACTIVE NICHE FILTER SWITCHER TABS */}
        <div className="w-full max-w-full overflow-x-auto pb-1 flex justify-start sm:justify-center mb-10 sm:mb-12 no-scrollbar">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white border border-[#FFC2DA] shadow-sm shrink-0 mx-auto max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/25'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              All Creator Stories ({testimonials.length})
            </button>
            <button
              onClick={() => setActiveFilter('podcaster')}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'podcaster'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/25'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              Podcasters (2)
            </button>
            <button
              onClick={() => setActiveFilter('youtuber')}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'youtuber'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/25'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              YouTube Creators (2)
            </button>
            <button
              onClick={() => setActiveFilter('coach')}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'coach'
                  ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/25'
                  : 'text-[#71717A] hover:text-[#FF529A]'
              }`}
            >
              Coaches & Consultants (2)
            </button>
          </div>
        </div>

        {/* TESTIMONIALS GRID WITH INTERACTIVE REACTION BUTTONS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTestimonials.map((t, idx) => {
              const MetricIcon = t.metricIcon;
              const cardReactions = reactions[t.id];

              return (
                <motion.div
                  key={t.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="bg-white rounded-3xl p-7 flex flex-col justify-between border border-[#E4E4E7] hover:border-[#FF529A] shadow-xl hover:shadow-pink-500/10 transition-all group relative overflow-hidden"
                >
                  {/* Top Aura Highlight Bar on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF529A] via-purple-500 to-[#FF007A] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 drop-shadow-xs" />
                        ))}
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${t.nicheColor}`}>
                        {t.nicheLabel}
                      </span>
                    </div>

                    {/* Measurable Creator Outcome Impact Badge */}
                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A]">
                      <MetricIcon className="w-3.5 h-3.5" />
                      <span>{t.impactBadge}</span>
                    </div>

                    {/* Quote Text */}
                    <p className="text-[#1E293B] text-sm leading-relaxed italic mb-6 font-medium">
                      &quot;{t.quote}&quot;
                    </p>
                  </div>

                  <div>
                    {/* Interactive Delight Reaction Buttons (Twitter Style) */}
                    <div className="flex items-center gap-2 mb-4 pt-3 border-t border-[#F1F5F9]">
                      <button
                        onClick={(e) => handleReactionClick(e, t.id, 'heart')}
                        className="px-2.5 py-1 rounded-full bg-[#FFF0F6] hover:bg-pink-100 text-[#FF529A] text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-90"
                        title="Love this review"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#FF529A]" />
                        <span>{cardReactions.heart}</span>
                      </button>

                      <button
                        onClick={(e) => handleReactionClick(e, t.id, 'fire')}
                        className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-90"
                        title="Mind blown"
                      >
                        <span>🔥</span>
                        <span>{cardReactions.fire}</span>
                      </button>

                      <button
                        onClick={(e) => handleReactionClick(e, t.id, 'clap')}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-90"
                        title="Clap"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 fill-emerald-600" />
                        <span>{cardReactions.clap}</span>
                      </button>
                    </div>

                    {/* Author Meta */}
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#FF529A]"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 stroke-white" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#0A0A0C] group-hover:text-[#FF529A] transition-colors flex items-center gap-1">
                          {t.name}
                        </h4>
                        <p className="text-xs text-[#71717A] font-medium">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
