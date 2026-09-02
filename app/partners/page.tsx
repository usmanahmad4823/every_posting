import Link from 'next/link';
import { Sparkles, Users, Award, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Partners & Affiliate Program | EveryPosting',
  description: 'Earn up to 30% recurring commissions as an EveryPosting affiliate or agency partner.',
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4">
            <Award className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Affiliate & Agency Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            Partner With <span className="text-[#FF529A]">EveryPosting</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#71717A] leading-relaxed font-medium">
            Earn 30% recurring monthly commission for every podcaster, YouTuber, or creator you refer to EveryPosting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="aiigen-card p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl">
            <h3 className="text-2xl font-extrabold text-[#0A0A0C] mb-3">Affiliate Program</h3>
            <p className="text-sm text-[#71717A] font-medium mb-6">
              Perfect for newsletter authors, content creators, podcasters, and educators wanting to monetize their audience.
            </p>
            <ul className="space-y-3 mb-8 text-xs font-bold text-[#0A0A0C]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF529A]" />
                <span>30% recurring commission on all referrals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF529A]" />
                <span>60-day tracking cookie window</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF529A]" />
                <span>Monthly direct payouts via Stripe / PayPal</span>
              </li>
            </ul>
            <Link href="/contact" className="btn-aiigen-primary w-full py-3 text-xs font-extrabold rounded-xl text-center shadow-md">
              Apply as Affiliate →
            </Link>
          </div>

          <div className="aiigen-card p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl">
            <h3 className="text-2xl font-extrabold text-[#0A0A0C] mb-3">Agency Partners</h3>
            <p className="text-sm text-[#71717A] font-medium mb-6">
              For podcast production agencies and social media managers handling multiple client channels.
            </p>
            <ul className="space-y-3 mb-8 text-xs font-bold text-[#0A0A0C]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF529A]" />
                <span>Multi-seat client management dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF529A]" />
                <span>Volume API key discount pricing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF529A]" />
                <span>Dedicated slack channel & priority support</span>
              </li>
            </ul>
            <Link href="/contact" className="btn-aiigen-primary w-full py-3 text-xs font-extrabold rounded-xl text-center shadow-md">
              Apply as Agency Partner →
            </Link>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
