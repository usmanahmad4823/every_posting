'use client';

import Link from 'next/link';
import { Sparkles, Zap, User, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSparkleBurst } from '@/components/ui/sparkle-burst';

const NAV_LINKS = [
  { href: '#features', label: 'Niches' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  const { triggerBurst, SparkleContainer } = useSparkleBurst();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        {/* Floating Creative Glass Capsule Navbar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`transition-all duration-300 rounded-full border px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-2xl relative ${
            scrolled
              ? 'bg-white/90 backdrop-blur-xl border-[#FFC2DA] shadow-pink-500/10'
              : 'bg-white/85 backdrop-blur-lg border-white/80 shadow-slate-900/5'
          }`}
        >
          {/* Logo Mark with Animated Ring */}
          <Link href="/" className="flex items-center gap-2.5 group relative">
            <div className="relative">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF529A] via-purple-500 to-[#FF007A] blur-xs opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0A0A0C] flex items-center justify-center text-white relative shadow-md group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF529A] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0A0A0C] flex items-center gap-1">
                Every<span className="text-gradient-aura">Posting</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#71717A] font-bold -mt-1 hidden sm:block">
                AI Content Engine
              </span>
            </div>
          </Link>

          {/* Creative Interactive Spotlight Navigation Links */}
          <nav
            onMouseLeave={() => setActiveHover(null)}
            className="hidden md:flex items-center gap-1 bg-[#F5F5F7] p-1.5 rounded-full border border-[#E4E4E7] relative"
          >
            {NAV_LINKS.map((link) => {
              const isHovered = activeHover === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setActiveHover(link.href)}
                  className="relative px-4 py-1.5 text-xs font-bold text-[#52525B] hover:text-[#0A0A0C] transition-colors rounded-full z-10"
                >
                  {isHovered && (
                    <motion.span
                      layoutId="navSpotlight"
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      className="absolute inset-0 bg-white rounded-full border border-[#FFC2DA] shadow-sm z-0"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Live AI Engine Indicator & CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live AI Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Claude 3.5 Active</span>
            </div>

            <Link
              href="/sign-in"
              className="text-xs font-semibold text-[#52525B] hover:text-[#FF529A] px-3 py-2 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#FF529A]" />
              <span>Sign In</span>
            </Link>

            {/* Sparkle Burst Primary Button */}
            <div className="relative">
              <SparkleContainer />
              <Link
                href="/dashboard"
                onClick={triggerBurst}
                className="btn-aiigen-primary text-xs font-extrabold px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2 shadow-lg shadow-pink-500/25 group rounded-full"
              >
                <Zap className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
                <span>Studio App</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#0A0A0C] hover:bg-[#F5F5F7] border border-[#E4E4E7] transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF529A]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Creative Mobile Glass Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden max-w-6xl mx-auto mt-2 pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-[#FFC2DA] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF529A]">
                  <Sparkles className="w-4 h-4" />
                  <span>Navigation Hub</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Claude 3.5 Ready
                </span>
              </div>

              <nav className="grid grid-cols-2 gap-2 text-xs font-bold text-[#0A0A0C]">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-[#F8FAFC] hover:bg-pink-50 hover:text-[#FF529A] border border-[#E2E8F0] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-3 border-t border-[#E4E4E7] flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-aiigen-secondary py-3 text-center text-xs font-bold rounded-2xl border-[#FFC2DA]"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-aiigen-primary py-3 text-center text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Launch Studio App</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
