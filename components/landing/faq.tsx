'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need audio files or can I paste plain text transcripts?',
      a: 'You can paste plain text transcripts, raw video scripts, or text exported from any recording app (.txt / .srt files). No manual audio uploading required.',
    },
    {
      q: 'How does EveryPosting handle niche-specific tone differences?',
      a: 'We use tailored AI prompts for Podcasters, YouTubers, and Coaches. Outputs automatically adapt to your target audience with native niche terminology.',
    },
    {
      q: 'What AI model powers the content generation?',
      a: 'EveryPosting is powered by Anthropic Claude 3.5 Sonnet, known for human-grade copywriting nuance and natural readability without robotic AI buzzwords.',
    },
    {
      q: 'How does the Free Tier & 10-generation limit work?',
      a: 'Free users get 10 free generations every month. Upgrade to Pro for unlimited generations, or plug in your custom Anthropic API key in Settings for direct usage.',
    },
    {
      q: 'Can I cancel or upgrade my subscription anytime?',
      a: 'Yes! You can upgrade, downgrade, or cancel your Pro subscription anytime with 1 click directly in your Account Settings.',
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 relative z-10 bg-white border-t border-[#E4E4E7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#FF529A] border border-pink-200 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[#52525B] text-sm sm:text-base font-medium">
            Everything you need to know about EveryPosting and our AI repurposing workflow.
          </p>
        </div>

        {/* Unified Ultra-Minimal Divided Accordion */}
        <div className="bg-[#F8FAFC]/80 rounded-[32px] border border-[#E4E4E7] p-5 sm:p-8 shadow-xs divide-y divide-[#E4E4E7]">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div key={faq.q} className="py-4 sm:py-5 first:pt-0 last:pb-0 group">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between gap-4 py-1 focus:outline-none"
                >
                  <span className="font-extrabold text-[#0A0A0C] text-sm sm:text-base group-hover:text-[#FF529A] transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                      isOpen
                        ? 'bg-[#FF529A] border-[#FF529A] text-white shadow-xs'
                        : 'bg-white border-[#E2E8F0] text-[#71717A] group-hover:border-[#FF529A] group-hover:text-[#FF529A]'
                    }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pb-1 text-[#52525B] text-xs sm:text-sm leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
