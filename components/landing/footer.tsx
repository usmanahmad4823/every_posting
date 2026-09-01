'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}

export function ClosingCTABanner() {
  return (
    <section className="py-12 sm:py-16 bg-[#F5F5F7] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="aura-gradient-border"
        >
          <div className="aura-gradient-border-dark py-20 sm:py-24 px-6 sm:px-12 text-center rounded-[24px] relative overflow-hidden flex flex-col items-center justify-center bg-[#FF529A] text-white">
            {/* Ambient Background Glow inside Pink Banner */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-white/20 blur-[100px] pointer-events-none" />

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-bold text-white mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Ready to scale your content output?</span>
            </div>

            {/* Large Bold Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tightest leading-[1.1] max-w-3xl">
              Ready to transform your recordings into content?
            </h2>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-xl text-pink-100 max-w-2xl font-medium leading-relaxed">
              Join 25,000+ creators, podcasters, YouTubers, and coaches turning every single recording into a full week of ready-to-post social content.
            </p>

            {/* Centered Primary CTA Button */}
            <div className="mt-9">
              <Link
                href="/dashboard"
                className="bg-white hover:bg-slate-50 text-[#FF529A] font-extrabold text-sm sm:text-base px-9 py-4 rounded-xl inline-flex items-center gap-3 shadow-2xl shadow-pink-900/30 group transition-transform hover:scale-105"
              >
                <Zap className="w-4 h-4 fill-[#FF529A]" />
                <span>Start for free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FF529A]" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#F5F5F7] border-t border-[#E4E4E7] relative z-10 pt-16 pb-12 text-[#71717A] text-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[#E4E4E7]">
          {/* Left Column: Brand Info & Socials */}
          <div className="lg:col-span-5 pr-0 lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-[#FF529A] flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#0A0A0C]">
                Every<span className="text-[#FF529A]">Posting</span>
              </span>
            </Link>

            <p className="text-sm text-[#52525B] leading-relaxed font-medium mb-6 max-w-md">
              AI-powered content intelligence engine for Podcasters, YouTube Creators, and Coaches. Turn 1 transcript into 7 days of platform-optimized social content.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X / Twitter"
                className="w-9 h-9 rounded-xl bg-white border border-[#FFC2DA] flex items-center justify-center text-[#FF529A] hover:bg-[#FF529A] hover:text-white hover:border-[#FF529A] transition-all shadow-sm"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white border border-[#FFC2DA] flex items-center justify-center text-[#FF529A] hover:bg-[#FF529A] hover:text-white hover:border-[#FF529A] transition-all shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-white border border-[#FFC2DA] flex items-center justify-center text-[#FF529A] hover:bg-[#FF529A] hover:text-white hover:border-[#FF529A] transition-all shadow-sm"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white border border-[#FFC2DA] flex items-center justify-center text-[#FF529A] hover:bg-[#FF529A] hover:text-white hover:border-[#FF529A] transition-all shadow-sm"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Side: 3 Link Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Product */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0A0A0C] mb-4">Product</h4>
              <ul className="space-y-3 text-xs font-semibold text-[#52525B]">
                <li>
                  <Link href="#features" className="hover:text-[#FF529A] transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-[#FF529A] transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:text-[#FF529A] transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#FF529A] transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0A0A0C] mb-4">Resources</h4>
              <ul className="space-y-3 text-xs font-semibold text-[#52525B]">
                <li>
                  <Link href="#faq" className="hover:text-[#FF529A] transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-[#FF529A] transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="hover:text-[#FF529A] transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-[#FF529A] transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0A0A0C] mb-4">Company</h4>
              <ul className="space-y-3 text-xs font-semibold text-[#52525B]">
                <li>
                  <Link href="/" className="hover:text-[#FF529A] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-[#FF529A] transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-[#FF529A] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-[#FF529A] transition-colors">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#71717A]">
          <p>© 2026 EveryPosting. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs">
            <span className="hover:text-[#FF529A] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#FF529A] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#FF529A] cursor-pointer transition-colors">Cookie Settings</span>
          </div>
        </div>
      </div>

      {/* Oversized Faint Background Watermark Wordmark */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[110px] sm:text-[170px] md:text-[230px] font-extrabold text-[#FF529A]/[0.06] tracking-tighter uppercase leading-none select-none pointer-events-none whitespace-nowrap z-0">
        EVERYPOSTING
      </div>
    </footer>
  );
}

export function FooterSection() {
  return (
    <>
      <ClosingCTABanner />
      <Footer />
    </>
  );
}

export default FooterSection;
