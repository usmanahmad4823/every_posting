import Link from 'next/link';
import { Sparkles, FileText, ArrowRight, Clock } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Blog & Content Marketing Guides | EveryPosting',
  description: 'Learn proven strategies to repurpose audio and video content into viral social posts and newsletters.',
};

export default function BlogPage() {
  const posts = [
    {
      title: 'The 2026 Podcast Repurposing Blueprint: From 1 Recording to 10 Channels',
      date: 'August 28, 2026',
      readTime: '6 min read',
      category: 'Strategy',
      excerpt: 'How top 1% podcasters build automated content pipelines using Claude 3.5 AI prompt architecture.',
    },
    {
      title: 'Why AI Jargon Ruins Social Content (And How Claude 3.5 Fixes It)',
      date: 'August 14, 2026',
      readTime: '4 min read',
      category: 'AI Technology',
      excerpt: 'Eliminate robotic words like "delve" and "tapestry" from your social posts with custom tone styling.',
    },
    {
      title: 'How Coaches Turn 30-Minute Webinars into $10k LinkedIn Pipelines',
      date: 'July 30, 2026',
      readTime: '5 min read',
      category: 'Case Study',
      excerpt: 'A step-by-step breakdown of turning client Q&A sessions into high-converting LinkedIn carousels and posts.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-24 sm:pt-28 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4">
            <FileText className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Content Strategy & Insights</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            EveryPosting <span className="text-[#FF529A]">Blog</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#71717A] leading-relaxed font-medium">
            Proven playbooks, growth teardowns, and AI content guides for modern creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {posts.map((post) => (
            <div key={post.title} className="aiigen-card p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#FF529A] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                    {post.category}
                  </span>
                  <span className="text-xs font-bold text-[#71717A]">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0A0A0C] mb-3 leading-snug">{post.title}</h3>
                <p className="text-xs text-[#71717A] font-medium leading-relaxed mb-6">{post.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-between">
                <span className="text-[11px] text-[#94A3B8] font-bold">{post.date}</span>
                <Link href="/dashboard" className="text-xs font-bold text-[#FF529A] flex items-center gap-1 hover:underline">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
