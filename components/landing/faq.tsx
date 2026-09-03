'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need audio files or can I paste plain text transcripts?',
      a: 'You can paste plain text transcripts, raw video scripts, or text exported from any recording app (.txt / .srt files). We focus 100% on turning raw text into viral social posts.',
    },
    {
      q: 'How does EveryPosting handle niche-specific tone differences?',
      a: 'We use custom system prompt architectures for Podcasters, YouTubers, and Coaches. Podcaster outputs reference "episodes" and "listeners", YouTube outputs prioritize hooks and retweets, while Coach outputs focus on authority and client lead generation.',
    },
    {
      q: 'What AI model powers the content generation?',
      a: 'EveryPosting uses Anthropic Claude 3.5 Sonnet, recognized as one of the best AI models for copywriting, structural nuance, and human-like writing tone.',
    },
    {
      q: 'What is the difference between Pro Monthly and Pro Yearly?',
      a: 'Pro Monthly gives you 100 generations per month for $19/mo. Pro Yearly provides 1,200 generations per year for $190/yr, giving you approximately 2 months free (saving $38/year).',
    },
    {
      q: 'Can I cancel my Pro subscription at any time?',
      a: 'Yes! You can manage or cancel your subscription anytime with 1 click directly in your Account Settings page via Stripe.',
    },
  ];

  return (
    <section id="faq" className="py-24 relative z-10 bg-white border-t border-[#E4E4E7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="aiigen-pill mb-3 border-[#FFC2DA]">
            <span className="w-2 h-2 rounded-full bg-[#FF529A]" />
            <span className="text-[#0A0A0C]">Support & FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-aiigen-title tracking-tightest mt-2">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[#52525B] text-base font-medium">
            Everything you need to know about EveryPosting and our AI repurposed workflow.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={faq.q}
                className="aiigen-card border border-[#E4E4E7] overflow-hidden transition-colors hover:border-[#FF529A]"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-[#0A0A0C] text-base sm:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF529A] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-[#52525B] text-sm leading-relaxed border-t border-[#E4E4E7] mt-1 font-medium">
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
