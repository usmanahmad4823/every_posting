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
    <section className="py-12 border-y border-[#E4E4E7] bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest text-[#71717A] font-bold mb-8">
          Trusted by 25,000+ founders, business owners & top creators
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="aiigen-card p-5 text-center bg-white border border-[#E4E4E7] hover:border-[#FF529A]"
              >
                <div className="inline-flex icon-box-black bg-[#FF529A] mb-2 p-2 rounded-xl">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-[#71717A] font-semibold mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Niches Ticker / Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {niches.map((item) => (
            <span
              key={item}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#FFF0F6] text-[#FF529A] border border-[#FFC2DA]"
            >
              ✓ {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
