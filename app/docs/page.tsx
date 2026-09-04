import Link from 'next/link';
import { Sparkles, BookOpen, Key, FileText, Zap, HelpCircle } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Documentation | EveryPosting Knowledge Base',
  description: 'Complete user guides, prompt configuration documentation, and custom API key setup instructions.',
};

export default function DocsPage() {
  const docSections = [
    {
      title: 'Quick Start Guide',
      icon: BookOpen,
      topics: [
        'How to input your first podcast or YouTube transcript',
        'Selecting the right Niche Profile (Podcaster, YouTuber, Coach)',
        'Choosing output formats (Show Notes, X Threads, LinkedIn Stories)',
        'Exporting and copying content for instant posting',
      ],
    },
    {
      title: 'Custom API Key Configuration',
      icon: Key,
      topics: [
        'How to get an Anthropic Claude API Key from console.anthropic.com',
        'Plugging your API key inside Studio Settings modal',
        'Bypassing monthly generation limits with your custom key',
        'Client-side key security and encrypted local storage',
      ],
    },
    {
      title: 'Transcript Formatting Best Practices',
      icon: FileText,
      topics: [
        'Uploading .txt, .srt, .vtt, or transcript files',
        'Handling speaker labels and timestamped SRT files',
        'Optimizing transcript length (500 to 15,000 words)',
        'Tone selection (Energetic, Professional, Viral, Storytelling)',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-24 sm:pt-28 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Developer & Creator Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            EveryPosting <span className="text-[#FF529A]">Documentation</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#71717A] leading-relaxed font-medium">
            Learn how to maximize your content repurposing output with step-by-step guides and documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {docSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.title} className="aiigen-card p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#FF529A] mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0A0A0C] mb-4">{sec.title}</h3>
                <ul className="space-y-3">
                  {sec.topics.map((t) => (
                    <li key={t} className="text-xs font-medium text-[#71717A] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF529A] mt-1.5 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E4E4E7] shadow-xl text-center max-w-3xl mx-auto mb-20">
          <HelpCircle className="w-10 h-10 text-[#FF529A] mx-auto mb-4" />
          <h3 className="text-2xl font-extrabold text-[#0A0A0C] mb-3">Need personalized assistance?</h3>
          <p className="text-sm text-[#71717A] mb-6">
            Our support team is available 24/7 to help you optimize your content workflow.
          </p>
          <Link href="/support" className="btn-aiigen-primary px-6 py-3 text-xs font-extrabold rounded-full shadow-md">
            Visit Support Center →
          </Link>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
