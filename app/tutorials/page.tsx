import Link from 'next/link';
import { Sparkles, PlayCircle, Mic, PlaySquare, GraduationCap, ArrowRight } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Tutorials & Guides | EveryPosting Video Lessons',
  description: 'Step-by-step video tutorials on converting podcasts, YouTube scripts, and webinar transcripts into social content.',
};

export default function TutorialsPage() {
  const tutorials = [
    {
      title: 'How to Turn a 45-Minute Podcast into 10 Viral Tweets',
      duration: '4 min watch',
      niche: 'Podcasters',
      icon: Mic,
      description: 'Learn how to paste an episode transcript, select Twitter Thread format, and copy formatted hooks and threads.',
    },
    {
      title: 'Converting YouTube Video Scripts into SEO Blog Posts',
      duration: '6 min watch',
      niche: 'YouTube Creators',
      icon: PlaySquare,
      description: 'Discover how EveryPosting structures video scripts into formatted H2/H3 blog articles with introduction and conclusion.',
    },
    {
      title: 'Transforming Coaching Calls into High-Authority LinkedIn Stories',
      duration: '5 min watch',
      niche: 'Coaches',
      icon: GraduationCap,
      description: 'See how to extract key insights from client calls and format them into engagement-heavy LinkedIn posts.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-24 sm:pt-28 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4">
            <PlayCircle className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Video & Interactive Lessons</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            Step-by-Step <span className="text-[#FF529A]">Tutorials</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#71717A] leading-relaxed font-medium">
            Watch quick 5-minute video walkthroughs on mastering content repurposing for your specific audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {tutorials.map((tut) => {
            const Icon = tut.icon;
            return (
              <div key={tut.title} className="aiigen-card p-8 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#FF529A] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                      {tut.niche}
                    </span>
                    <span className="text-xs font-bold text-[#71717A]">{tut.duration}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0A0A0C] mb-3">{tut.title}</h3>
                  <p className="text-xs text-[#71717A] font-medium leading-relaxed mb-6">{tut.description}</p>
                </div>

                <Link href="/dashboard" className="btn-aiigen-primary w-full py-2.5 text-xs font-extrabold rounded-xl text-center shadow-md flex items-center justify-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  <span>Try Lesson in Studio</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
