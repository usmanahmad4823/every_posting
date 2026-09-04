import Link from 'next/link';
import { Shield } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Privacy Policy | EveryPosting Data Protection',
  description: 'Learn how EveryPosting protects your transcripts, API keys, and personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-24 sm:pt-28 pb-8 sm:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <Shield className="w-10 h-10 text-[#FF529A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-[#71717A] font-bold uppercase tracking-wider">
            Last Updated: September 2026
          </p>
        </div>

        <div className="aiigen-card p-8 sm:p-12 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl space-y-6 text-sm leading-relaxed font-medium">
          <h2 className="text-xl font-extrabold text-[#0A0A0C]">1. Information We Collect</h2>
          <p>We collect information you provide directly when creating an account, such as your full name and email address. When you process audio or video transcripts inside the Content Repurposing Studio, your transcripts are processed temporarily by our Anthropic Claude AI integration to generate outputs.</p>

          <h2 className="text-xl font-extrabold text-[#0A0A0C]">2. How We Use Your Data</h2>
          <p>Your transcripts are strictly used to execute your requested content generation outputs (such as show notes, X threads, or LinkedIn stories). We do NOT sell your data or use your private transcripts to train public AI models.</p>

          <h2 className="text-xl font-extrabold text-[#0A0A0C]">3. API Key Security</h2>
          <p>If you plug your custom Anthropic API key, it is encrypted and stored locally in your browser environment. Keys are never exposed or transmitted to unauthorized third parties.</p>

          <h2 className="text-xl font-extrabold text-[#0A0A0C]">4. Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy, please contact us at <Link href="/contact" className="text-[#FF529A] font-bold hover:underline">Support</Link>.</p>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
