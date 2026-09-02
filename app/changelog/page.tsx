import Link from 'next/link';
import { Sparkles, CheckCircle2, Zap, ArrowRight, Clock } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Changelog | EveryPosting Release Notes',
  description: 'Track the latest feature releases, performance improvements, and AI engine upgrades on EveryPosting.',
};

export default function ChangelogPage() {
  const releases = [
    {
      version: 'v2.4.0',
      date: 'September 2026',
      title: 'Mobile UI Redesign & SEO Supercharge',
      description: 'Streamlined mobile dashboard layout with foldable generation history, compact niche switcher tabs, and 100% SEO Google rich snippets.',
      features: [
        'Foldable mobile generation history accordion',
        'Compact 3-column niche switcher tabs',
        'JSON-LD Schema.org structured data for Google Search',
        'Mobile format card 2-column minimal grid',
      ],
    },
    {
      version: 'v2.2.0',
      date: 'August 2026',
      title: 'Supabase Real-Time Database Sync & Auth Integration',
      description: 'Added Supabase PostgreSQL backend integration for automatic registration upserts, credentials persistence, and instant sync.',
      features: [
        'Supabase user authentication & database table upserts',
        'Client-side NEXT_PUBLIC environment variable support',
        'Interactive profile pill dropdown navigation menu',
      ],
    },
    {
      version: 'v2.0.0',
      date: 'July 2026',
      title: 'Anthropic Claude 3.5 Sonnet Engine Upgrade',
      description: 'Upgraded core AI engine to Anthropic Claude 3.5 Sonnet for human-like tone fidelity, multi-format batching, and custom API key support.',
      features: [
        'Anthropic Claude 3.5 Sonnet model integration',
        'Plug custom API key modal setting',
        'Podcaster, YouTuber, and Coach specialized niche profiles',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4">
            <Clock className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Product Release History</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            EveryPosting <span className="text-[#FF529A]">Changelog</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#71717A] leading-relaxed font-medium">
            Discover the latest features, enhancements, and performance updates shipping to EveryPosting.
          </p>
        </div>

        <div className="space-y-10 mb-20">
          {releases.map((rel) => (
            <div key={rel.version} className="aiigen-card p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-[#FF529A] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                  {rel.version}
                </span>
                <span className="text-xs font-bold text-[#71717A]">{rel.date}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A0A0C] mb-3">{rel.title}</h2>
              <p className="text-sm text-[#71717A] font-medium leading-relaxed mb-6">{rel.description}</p>

              <div className="space-y-2">
                {rel.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs font-bold text-[#0A0A0C]">
                    <CheckCircle2 className="w-4 h-4 text-[#FF529A] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
