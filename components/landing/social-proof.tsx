'use client';

import { motion } from 'framer-motion';
import { Users, Star, Award, Zap } from 'lucide-react';

export function SocialProofSection() {
  const stats = [
    { icon: Users, label: 'Trusted Creators', value: '25,000+' },
    { icon: Zap, label: 'Transcripts Repurposed', value: '140,200+' },
    { icon: Star, label: 'Average Rating', value: '4.9 / 5.0' },
    { icon: Award, label: 'Hours Saved Monthly', value: '8,500+ hrs' },
  ];

  const niches = [
    'Top Apple Podcasts',
    'Tech & SaaS YouTubers',
    '7-Figure Business Coaches',
    'Newsletter Creators',
    'Executive Consultants',
  ];

  return (
    <section className="py-6 sm:py-8 border-y border-pink-100/60 bg-gradient-to-b from-[#FFF5F9]/60 via-white to-[#FFF5F9]/40 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] sm:text-xs uppercase tracking-widest text-[#71717A] font-extrabold mb-4 sm:mb-5">
          Trusted by 25,000+ founders, business owners & top creators
        </p>

        {/* Stats Grid - Minimal & Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5 max-w-4xl mx-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-3 text-center bg-white/80 backdrop-blur-xl rounded-xl border border-pink-200/80 shadow-2xs hover:border-[#FF529A]/50 hover:shadow-xs transition-all duration-300 group"
              >
                <div className="inline-flex p-1.5 rounded-lg bg-pink-50 text-[#FF529A] mb-1.5 border border-pink-200/60 group-hover:scale-105 transition-transform">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-base sm:text-lg lg:text-xl font-black text-[#0A0A0C] tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#71717A] font-medium mt-1">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Niches Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {niches.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-white/90 text-[#FF529A] border border-pink-200/80 shadow-2xs hover:border-pink-300 transition-colors"
            >
              <span className="text-[#FF529A] text-[9px]">✓</span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
