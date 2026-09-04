import Link from 'next/link';
import { Sparkles, Users, Target, Shield, Heart } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'About Us | EveryPosting Company Mission',
  description: 'Learn about the team and technology driving the future of automated AI content repurposing for creators.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-24 sm:pt-28 pb-8 sm:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A0A0C] tracking-tight">
            Empowering Creators to <span className="text-[#FF529A]">Publish Everywhere</span>
          </h1>
          <p className="mt-2 text-xs sm:text-base text-[#71717A] leading-relaxed font-medium">
            We believe creators should spend 90% of their time recording great content and 0% copying & pasting.
          </p>
        </div>

        <div className="aiigen-card p-6 sm:p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl mb-8 sm:mb-10 space-y-4">
          <h2 className="text-2xl font-extrabold text-[#0A0A0C]">Why We Built EveryPosting</h2>
          <p className="text-sm text-[#71717A] leading-relaxed font-medium">
            Every week, podcasters record 60-minute episodes, YouTubers produce 20-minute video breakdowns, and coaches host hour-long live webinars. Yet 95% of that rich knowledge remains trapped inside raw recordings.
          </p>
          <p className="text-sm text-[#71717A] leading-relaxed font-medium">
            EveryPosting was built to bridge this gap. Using state-of-the-art Anthropic Claude 3.5 Sonnet AI models, our engine parses episode transcripts, understands core narrative arcs, and outputs platform-native social content in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="aiigen-card p-6 bg-white border border-[#E4E4E7] rounded-3xl">
            <Target className="w-8 h-8 text-[#FF529A] mb-4" />
            <h3 className="text-lg font-extrabold text-[#0A0A0C] mb-2">High Intent</h3>
            <p className="text-xs text-[#71717A]">Crafting zero-fluff content tailored to specific platform algorithms.</p>
          </div>
          <div className="aiigen-card p-6 bg-white border border-[#E4E4E7] rounded-3xl">
            <Shield className="w-8 h-8 text-[#FF529A] mb-4" />
            <h3 className="text-lg font-extrabold text-[#0A0A0C] mb-2">Privacy First</h3>
            <p className="text-xs text-[#71717A]">Your transcripts and custom keys are encrypted and strictly protected.</p>
          </div>
          <div className="aiigen-card p-6 bg-white border border-[#E4E4E7] rounded-3xl">
            <Heart className="w-8 h-8 text-[#FF529A] mb-4" />
            <h3 className="text-lg font-extrabold text-[#0A0A0C] mb-2">Creator Obsessed</h3>
            <p className="text-xs text-[#71717A]">Designed with input from over 25,000 active content creators.</p>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
