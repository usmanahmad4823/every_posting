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
    <section id="how-it-works" className="py-8 sm:py-10 relative z-10 bg-white border-y border-pink-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="aiigen-pill mb-2 border-[#FFC2DA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF529A]" />
            <span className="text-[#0A0A0C] text-xs">Simple 3-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-aiigen-title tracking-tight mt-1">
            Your workflow, fully automated intelligently
          </h2>
          <p className="mt-2 text-[#52525B] text-xs sm:text-base font-medium">
            Streamline tasks with smart AI automation that saves time, boosts reach, and eliminates writing fatigue.
          </p>
        </div>

        {/* 3-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="aiigen-card p-5 sm:p-6 flex flex-col justify-between group hover:border-[#FF529A]"
              >
                <div>
                  {/* Step Number & Pink Icon Box */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="icon-box-black bg-[#FF529A] shadow-md group-hover:scale-105 transition-transform p-2 rounded-xl">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-black font-mono text-[#A1A1AA] group-hover:text-[#FF529A] transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F6] text-[#FF529A] border border-[#FFC2DA] mb-2">
                    {step.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#0A0A0C] mb-1.5 group-hover:text-[#FF529A] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[#52525B] text-xs leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E4E4E7] flex items-center text-xs font-bold text-[#FF529A] group-hover:translate-x-1 transition-transform">
                  <span>Explore workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 text-[#FF529A]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA banner */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/dashboard"
            className="btn-aiigen-secondary text-xs px-5 py-2.5 inline-flex items-center gap-2 shadow-2xs border-[#FFC2DA] hover:bg-[#FFF0F6] rounded-xl"
          >
            <span className="text-[#0A0A0C]">Ready to test your transcript?</span>
            <span className="text-[#FF529A] font-bold">Open Studio →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
