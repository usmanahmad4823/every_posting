'use client';

import { motion } from 'framer-motion';
import { FileText, Sliders, Rocket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Paste Transcript or Script',
      description:
        'Copy-paste your podcast audio transcript, YouTube video script, or client webinar notes directly into EveryPosting.',
      icon: FileText,
      badge: 'Step 1: Input',
    },
    {
      number: '02',
      title: 'Select Niche & Formats',
      description:
        'Choose your specific creator profile (Podcaster, YouTuber, or Coach) and tick the target output formats you need.',
      icon: Sliders,
      badge: 'Step 2: Customize',
    },
    {
      number: '03',
      title: 'Get Instant Social Content',
      description:
        'Anthropic Claude API converts your text into ready-to-publish Twitter threads, show notes, blog posts & LinkedIn content.',
      icon: Rocket,
      badge: 'Step 3: Export',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative z-10 bg-white border-y border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="aiigen-pill mb-3 border-[#FFC2DA]">
            <span className="w-2 h-2 rounded-full bg-[#FF529A]" />
            <span className="text-[#0A0A0C]">Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-aiigen-title tracking-tightest mt-2">
            Your workflow, fully automated intelligently
          </h2>
          <p className="mt-4 text-[#52525B] text-base sm:text-lg font-medium">
            Streamline tasks with smart AI automation that saves time, boosts reach, and eliminates writing fatigue.
          </p>
        </div>

        {/* 3-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="aiigen-card p-8 flex flex-col justify-between group hover:border-[#FF529A]"
              >
                <div>
                  {/* Step Number & Pink Icon Box */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="icon-box-black bg-[#FF529A] shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-extrabold font-mono text-[#A1A1AA] group-hover:text-[#FF529A] transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFF0F6] text-[#FF529A] border border-[#FFC2DA] mb-3">
                    {step.badge}
                  </span>
                  <h3 className="text-xl font-bold text-[#0A0A0C] mb-3 group-hover:text-[#FF529A] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[#52525B] text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E4E4E7] flex items-center text-xs font-bold text-[#FF529A] group-hover:translate-x-1 transition-transform">
                  <span>Explore workflow</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-[#FF529A]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA banner */}
        <div className="mt-16 text-center">
          <Link
            href="/dashboard"
            className="btn-aiigen-secondary text-xs sm:text-sm px-6 py-3.5 inline-flex items-center gap-2 shadow-sm border-[#FFC2DA] hover:bg-[#FFF0F6]"
          >
            <span className="text-[#0A0A0C]">Ready to test your transcript?</span>
            <span className="text-[#FF529A] font-bold">Open Studio →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
