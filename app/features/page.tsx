import Link from 'next/link';
import { Sparkles, Mic, PlaySquare, GraduationCap, Zap, ArrowRight, CheckCircle2, Sliders, Shield, Layers, FileText } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Features | EveryPosting AI Content Engine',
  description: 'Explore the complete suite of AI-powered content repurposing features for podcasters, YouTube creators, and coaches.',
};

export default function FeaturesPage() {
  const featureList = [
    {
      title: 'Podcaster Suite',
      icon: Mic,
      tag: 'Podcasters',
      description: 'Convert episode transcripts into formatted show notes, timestamped takeaways, and viral 10-tweet threads.',
      highlights: ['Automated Timestamps', 'Guest Quote Cards', 'Key Takeaway Summaries', 'Newsletter Clips'],
    },
    {
      title: 'YouTube Creator Engine',
      icon: PlaySquare,
      tag: 'Video Creators',
      description: 'Turn YouTube video scripts and captions into structured SEO blog articles, X threads, and newsletter summaries.',
      highlights: ['SEO Article Writer', 'Hook & CTA Generator', 'Multi-Tweet Breakdown', 'Video Key Points'],
    },
    {
      title: 'Coaching & Webinar Toolkit',
      icon: GraduationCap,
      tag: 'Coaches & Consultants',
      description: 'Transform client call notes, workshop recordings, and webinars into authority-building LinkedIn posts and client emails.',
      highlights: ['LinkedIn Story Posts', 'Email Digest Builder', 'Action Item Extraction', 'Quote Graphics Text'],
    },
    {
      title: 'Anthropic Claude 3.5 Sonnet AI',
      icon: Zap,
      tag: 'AI Intelligence',
      description: 'Powered by the world-class Anthropic Claude 3.5 Sonnet model for human-like tone, nuance, and zero robotic cliché text.',
      highlights: ['Zero AI Jargon', 'Energetic & Storytelling Tones', 'Plug Custom API Key', 'Instant Multi-Format Output'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-24 sm:pt-28 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Complete Platform Capabilities</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A0A0C] tracking-tight">
            Built for High-Yield <span className="text-[#FF529A]">Content Repurposing</span>
          </h1>
          <p className="mt-2 text-xs sm:text-base text-[#71717A] leading-relaxed font-medium">
            Everything you need to turn 1 audio or video recording into 7 days of platform-native social content in seconds.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {featureList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="aiigen-card p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl flex flex-col justify-between hover:border-[#FFC2DA] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#FF529A]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-[#FF529A] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A0A0C] tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#71717A] font-medium leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <ul className="space-y-2.5">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs font-bold text-[#0A0A0C]">
                        <CheckCircle2 className="w-4 h-4 text-[#FF529A] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E4E4E7]">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-[#FF529A] hover:underline"
                  >
                    <span>Test live in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E4E4E7] shadow-2xl text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A0A0C] tracking-tight mb-4">
            Ready to experience 10x content output?
          </h2>
          <p className="text-sm sm:text-base text-[#71717A] font-medium mb-8">
            Create your free account today and generate your first batch of social posts in under 60 seconds.
          </p>
          <Link
            href="/sign-up"
            className="btn-aiigen-primary px-8 py-3.5 text-sm font-extrabold rounded-full shadow-lg shadow-pink-500/25 inline-flex items-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
