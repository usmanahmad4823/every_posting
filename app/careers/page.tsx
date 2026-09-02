import Link from 'next/link';
import { Sparkles, Briefcase, MapPin, ArrowRight } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export const metadata = {
  title: 'Careers | Join the EveryPosting Team',
  description: 'Help us build the world’s most intelligent AI content engine for podcasters and creators. View remote open roles.',
};

export default function CareersPage() {
  const jobs = [
    {
      role: 'Senior Full-Stack AI Engineer',
      department: 'Engineering',
      location: 'Remote (Worldwide)',
      type: 'Full-time',
    },
    {
      role: 'Product Designer (UI/UX)',
      department: 'Design',
      location: 'Remote (US/EU)',
      type: 'Full-time',
    },
    {
      role: 'Growth Marketing Lead',
      department: 'Marketing',
      location: 'Remote (Worldwide)',
      type: 'Full-time',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4">
            <Briefcase className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>Join Our Global Remote Team</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            Build the Future of <span className="text-[#FF529A]">AI Content Engine</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#71717A] leading-relaxed font-medium">
            We are looking for passionate engineers, designers, and marketers who love content creation and AI technology.
          </p>
        </div>

        <div className="space-y-6 mb-20">
          {jobs.map((job) => (
            <div key={job.role} className="aiigen-card p-6 bg-white border border-[#E4E4E7] rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#FF529A] uppercase bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 mb-2 inline-block">
                  {job.department}
                </span>
                <h3 className="text-lg font-extrabold text-[#0A0A0C]">{job.role}</h3>
                <div className="flex items-center gap-4 text-xs font-semibold text-[#71717A] mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF529A]" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
              </div>

              <Link href="/contact" className="btn-aiigen-primary px-5 py-2 text-xs font-extrabold rounded-xl shrink-0">
                Apply Position →
              </Link>
            </div>
          ))}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
