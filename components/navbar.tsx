'use client';

import Link from 'next/link';
import { Sparkles, Zap, User, Menu, X, ArrowRight, ShieldCheck, LogOut, Settings, CreditCard, ChevronDown, Sliders, Star, HelpCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSparkleBurst } from '@/components/ui/sparkle-burst';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/lib/supabase';

import { useUser } from '@/components/providers/user-provider';
import { PlanBadge } from '@/components/ui/plan-badge';

const NAV_LINKS = [
  { href: '/#niches', label: 'Niches' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#testimonials', label: 'Testimonials' },
  { href: '/#faq', label: 'FAQ' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  // Global Reactive User & Subscription State
  const { user, invalidateUser } = useUser();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { triggerBurst, SparkleContainer } = useSparkleBurst();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    await invalidateUser();
    setProfileDropdownOpen(false);
    router.push('/sign-in');
  };

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'CU';
  };

  const userTier = user?.plan || 'free';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-6 py-2.5 sm:py-4 pointer-events-none max-w-full">
      <div className="max-w-6xl mx-auto pointer-events-auto max-w-full">
        {/* Floating Creative Glass Capsule Navbar - Mobile Compact Scaling */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`transition-all duration-300 rounded-full border px-3 sm:px-6 py-1.5 sm:py-3 flex items-center justify-between shadow-xl relative max-w-full ${
            scrolled
              ? 'bg-white/95 backdrop-blur-xl border-[#FFC2DA] shadow-pink-500/10'
              : 'bg-white/90 backdrop-blur-lg border-white/80 shadow-slate-900/5'
          }`}
        >
          {/* Logo Mark with Animated Ring */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group relative shrink-0">
            <div className="relative">
              <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#FF529A] via-purple-500 to-[#FF007A] blur-xs opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0A0A0C] flex items-center justify-center text-white relative shadow-md group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#FF529A] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-xs sm:text-lg tracking-tight text-[#0A0A0C] flex items-center gap-0.5 sm:gap-1">
                Every<span className="text-gradient-aura">Posting</span>
              </span>
              <span className="text-[8px] uppercase tracking-widest text-[#71717A] font-bold -mt-0.5 hidden sm:block">
                AI Content Engine
              </span>
            </div>
          </Link>

          {/* Creative Interactive Spotlight Navigation Links (Desktop) */}
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
                  className="relative px-3.5 py-1 text-xs font-bold text-[#52525B] hover:text-[#0A0A0C] transition-colors rounded-full z-10"
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

          {/* Right Section: Mobile Compact Controls & Studio CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Live AI Status Pill (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Claude 3.5 Active</span>
            </div>

            {/* DYNAMIC AUTH NAVBAR STATE */}
            {user?.loggedIn ? (
              /* User Authenticated Profile Pill & Dropdown Menu */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 p-1 pr-1.5 sm:pr-2.5 rounded-full bg-white hover:bg-pink-50 border border-[#FFC2DA] shadow-xs transition-all group cursor-pointer"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#FF529A] to-purple-600 text-white font-extrabold text-[10px] sm:text-xs flex items-center justify-center shadow-xs">
                    {getInitials(user.fullName, user.email)}
                  </div>
                  <span className="text-xs font-bold text-[#0A0A0C] hidden sm:block">
                    {user.fullName ? user.fullName.split(' ')[0] : 'Creator'}
                  </span>

                  {/* Active Subscription Badge Pill */}
                  <PlanBadge plan={user.plan} planStatus={user.planStatus} />

                  <ChevronDown className={`w-3 h-3 text-[#71717A] group-hover:text-[#FF529A] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-56 sm:w-60 bg-white rounded-2xl border border-[#FFC2DA] shadow-2xl p-2.5 z-[100] pointer-events-auto filter drop-shadow-2xl"
                    >
                      <div className="px-3 py-2 border-b border-[#E4E4E7] mb-1">
                        <p className="text-xs font-bold text-[#0A0A0C] truncate">
                          {user.fullName || 'Creator User'}
                        </p>
                        <p className="text-[11px] text-[#71717A] truncate font-medium">{user.email}</p>
                        <div className="mt-1.5 flex items-center">
                          <PlanBadge plan={user.plan} planStatus={user.planStatus} />
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0A0A0C] hover:bg-pink-50 hover:text-[#FF529A] rounded-xl transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#FF529A]" />
                        <span>Studio Dashboard</span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0A0A0C] hover:bg-pink-50 hover:text-[#FF529A] rounded-xl transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#FF529A]" />
                        <span>Account Settings</span>
                      </Link>

                      <Link
                        href="/pricing"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0A0A0C] hover:bg-pink-50 hover:text-[#FF529A] rounded-xl transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#FF529A]" />
                        <span>{userTier === 'free' ? 'Upgrade to Pro' : 'Manage Subscription'}</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* User Unauthenticated: Show Sign In & Sign Up Buttons */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/sign-in"
                  className="text-xs font-bold text-[#0A0A0C] hover:text-[#FF529A] px-2 sm:px-3 py-1.5 transition-colors flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5 text-[#FF529A]" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-aiigen-primary text-xs font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 rounded-full shadow-xs shrink-0"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Studio App Sparkle CTA Button - Desktop & Tablet */}
            <div className="relative hidden sm:block">
              <SparkleContainer />
              <Link
                href="/dashboard"
                onClick={triggerBurst}
                className="btn-aiigen-primary text-xs font-extrabold px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-1.5 shadow-md shadow-pink-500/25 group rounded-full"
              >
                <Zap className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
                <span>Studio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-full text-[#0A0A0C] hover:bg-[#F5F5F7] border border-[#E4E4E7] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#FF529A]" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile & Tablet Full Backdrop & Typography Drawer (md:hidden) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* 1. Backdrop Overlay (Click Outside to Auto-Close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden pointer-events-auto"
            />

            {/* 2. Top-Down Premium Typography Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-3 left-3 right-3 z-50 md:hidden pointer-events-auto max-w-full"
            >
              <div className="bg-white/98 backdrop-blur-2xl rounded-[32px] border border-[#FFC2DA] p-6 shadow-2xl space-y-6 relative overflow-hidden">
                {/* Subtle Ambient Pink Backdrop Blur */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF529A]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header Row: Logo on Left, Close (X) Button on Far RIGHT */}
                <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-extrabold text-xl tracking-tight text-[#0A0A0C]"
                  >
                    Every<span className="text-[#FF529A]">Posting</span>
                  </Link>

                  {/* Right Side Close (X) Circle Button */}
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center text-[#0A0A0C] hover:bg-pink-50 hover:text-[#FF529A] hover:border-pink-200 transition-all shadow-xs"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Clean Typography Menu List (NO ICONS with menu text) */}
                <nav className="flex flex-col space-y-4 pt-2">
                  <Link
                    href="/#niches"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] hover:text-[#FF529A] transition-colors tracking-tight text-left"
                  >
                    Niches
                  </Link>

                  <Link
                    href="/#how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] hover:text-[#FF529A] transition-colors tracking-tight text-left"
                  >
                    How it works
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] hover:text-[#FF529A] transition-colors tracking-tight text-left"
                  >
                    Pricing
                  </Link>

                  <Link
                    href="/#testimonials"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] hover:text-[#FF529A] transition-colors tracking-tight text-left"
                  >
                    Testimonials
                  </Link>

                  <Link
                    href="/#faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] hover:text-[#FF529A] transition-colors tracking-tight text-left"
                  >
                    FAQ
                  </Link>

                  {user?.loggedIn ? (
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] hover:text-[#FF529A] transition-colors tracking-tight text-left"
                    >
                      Settings
                    </Link>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] hover:text-[#FF529A] transition-colors tracking-tight text-left"
                    >
                      Sign In
                    </Link>
                  )}
                </nav>

                {/* Primary Studio CTA Button */}
                <div className="pt-4 border-t border-[#E4E4E7]">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full btn-aiigen-primary text-sm font-extrabold py-3.5 flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 rounded-2xl"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Open Studio App →</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
