import Link from 'next/link';
import { FileText } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Terms of Service | EveryPosting Platform Terms',
  description: 'Read the terms of service governing usage of the EveryPosting platform and subscription services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <FileText className="w-10 h-10 text-[#FF529A] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-[#71717A] font-bold uppercase tracking-wider">
            Last Updated: September 2026
          </p>
        </div>

        <div className="aiigen-card p-8 sm:p-12 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl space-y-6 text-sm leading-relaxed font-medium">
          <h2 className="text-xl font-extrabold text-[#0A0A0C]">1. Acceptance of Terms</h2>
          <p>By accessing or using EveryPosting, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

          <h2 className="text-xl font-extrabold text-[#0A0A0C]">2. Account & Subscriptions</h2>
          <p>Free accounts include 10 generations per month. Pro subscriptions ($19/month) grant unlimited generations. Subscriptions renew automatically until cancelled via the Stripe Customer Portal.</p>

          <h2 className="text-xl font-extrabold text-[#0A0A0C]">3. Acceptable Use</h2>
          <p>You agree not to use EveryPosting to generate unlawful, hateful, or abusive content. We reserve the right to suspend accounts that violate platform policies.</p>

          <h2 className="text-xl font-extrabold text-[#0A0A0C]">4. Contact Information</h2>
          <p>For questions regarding terms, contact us at <Link href="/contact" className="text-[#FF529A] font-bold hover:underline">Support</Link>.</p>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
