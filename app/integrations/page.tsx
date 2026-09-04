import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Key, Database, CreditCard, Cpu, ShieldCheck } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Integrations | EveryPosting AI Content Engine',
  description: 'Connect EveryPosting with your favorite platforms including Anthropic Claude 3.5 Sonnet, Supabase, Stripe, YouTube, and Spotify.',
};

export default function IntegrationsPage() {
  const integrations = [
    {
      name: 'Anthropic Claude 3.5 Sonnet',
      category: 'AI Engine',
      icon: Cpu,
      description: 'Plug your custom Anthropic API key directly to unlock unlimited AI generations with zero rate limits.',
      status: 'Native Integration',
    },
    {
      name: 'Supabase Database',
      category: 'Cloud Storage',
      icon: Database,
      description: 'Secure, real-time database sync for all user profiles, generation histories, and subscription tiers.',
      status: 'Real-Time Sync',
    },
    {
      name: 'Stripe Billing & Checkout',
      category: 'Payments',
      icon: CreditCard,
      description: 'Instant Pro plan upgrades, subscription management, and secure automated billing via Stripe Customer Portal.',
      status: 'Verified Partner',
    },
    {
      name: 'YouTube & Spotify Transcripts',
      category: 'Media Ingestion',
      icon: Zap,
      description: 'Paste direct .txt, .srt, or episode transcripts from YouTube, Apple Podcasts, or Spotify episodes.',
      status: 'Built-in Support',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-24 sm:pt-28 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Seamless Ecosystem Connections</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            Integrations & <span className="text-[#FF529A]">API Connections</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#71717A] leading-relaxed font-medium">
            Connect EveryPosting with your content stack to streamline transcription ingestion, AI processing, and export workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {integrations.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="aiigen-card p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#FF529A]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {item.status}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0A0A0C] mb-2">{item.name}</h3>
                <p className="text-sm text-[#71717A] font-medium mb-4">{item.description}</p>
                <div className="text-xs font-bold text-[#FF529A]">{item.category}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E4E4E7] shadow-xl text-center max-w-3xl mx-auto mb-20">
          <Key className="w-10 h-10 text-[#FF529A] mx-auto mb-4" />
          <h3 className="text-2xl font-extrabold text-[#0A0A0C] mb-3">Plug Your Own Anthropic Key</h3>
          <p className="text-sm text-[#71717A] mb-6">
            Have your own Claude 3.5 Sonnet API key? Plug it inside Studio Settings to bypass monthly limits completely.
          </p>
          <Link href="/dashboard" className="btn-aiigen-primary px-6 py-3 text-xs font-extrabold rounded-full shadow-md">
            Open Studio & Plug Key →
          </Link>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
