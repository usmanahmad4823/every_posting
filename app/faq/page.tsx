'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Search, Sparkles, MessageSquare, ShieldCheck, CreditCard, ChevronDown, ArrowRight } from 'lucide-react';
import { FAQSection } from '@/components/landing/faq';

export default function DedicatedFAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'billing', label: 'Pricing & Billing' },
    { id: 'ai', label: 'AI & Generation' },
    { id: 'security', label: 'Privacy & Security' },
    { id: 'account', label: 'Account & BYOK' },
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 bg-[#F5F5F7]">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4 shadow-xs">
          <HelpCircle className="w-3.5 h-3.5 text-[#FF529A]" />
          <span>Help & Knowledge Base</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#0A0A0C] tracking-tight leading-tight">
          Frequently Asked <span className="text-[#FF529A]">Questions</span>
        </h1>
        <p className="text-sm sm:text-base text-[#71717A] font-medium max-w-xl mx-auto mt-3">
          Have questions about EveryPosting, AI generation credits, or Anthropic custom key integration? Find answers below.
        </p>

        {/* Quick Contact Pill */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/support"
            className="px-4 py-2 bg-white border border-[#E4E4E7] rounded-xl text-xs font-extrabold text-[#0A0A0C] hover:border-[#FF529A] hover:text-[#FF529A] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Contact Support Team</span>
          </Link>
          <Link
            href="/tutorials"
            className="px-4 py-2 bg-white border border-[#E4E4E7] rounded-xl text-xs font-extrabold text-[#0A0A0C] hover:border-[#FF529A] hover:text-[#FF529A] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Video Tutorials</span>
          </Link>
        </div>
      </div>

      {/* Main FAQ Accordion Component */}
      <FAQSection />

      {/* Additional Help Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-white rounded-3xl p-8 border border-[#E4E4E7] shadow-lg text-center">
          <h3 className="text-xl font-extrabold text-[#0A0A0C] mb-2">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-[#71717A] max-w-md mx-auto mb-6 font-medium">
            Our creator support team is always available to help you configure custom tone styles and API keys.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 btn-aiigen-primary px-6 py-3 rounded-xl font-extrabold text-xs shadow-md shadow-pink-500/20"
          >
            <span>Get in Touch with Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
