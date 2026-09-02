'use client';

import Link from 'next/link';
import { Sparkles, Zap, User, Menu, X, ArrowRight, ShieldCheck, LogOut, Settings, CreditCard, ChevronDown } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-6 py-2.5 sm:py-4 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        {/* Floating Creative Glass Capsule Navbar - Mobile Compact Scaling */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`transition-all duration-300 rounded-full border px-3 sm:px-6 py-1.5 sm:py-3 flex items-center justify-between shadow-xl relative ${
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
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 p-1 pr-1.5 sm:pr-2.5 rounded-full bg-white hover:bg-pink-50 border border-[#FFC2DA] shadow-xs transition-all group"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#FF529A] to-purple-600 text-white font-extrabold text-[10px] sm:text-xs flex items-center justify-center shadow-xs">
                    {getInitials(user.fullName, user.email)}
                  </div>
                  <span className="text-xs font-bold text-[#0A0A0C] hidden sm:block">
                    {user.fullName ? user.fullName.split(' ')[0] : 'Creator'}
                  </span>

                  {/* Active Subscription Badge Pill */}
                  <PlanBadge plan={user.plan} planStatus={user.planStatus} />

                  <ChevronDown className="w-3 h-3 text-[#71717A] group-hover:text-[#FF529A] transition-transform duration-200" />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 sm:w-56 bg-white rounded-2xl border border-[#FFC2DA] shadow-2xl p-2 z-50 pointer-events-auto"
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

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1 border-t border-[#E4E4E7] pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* User Unauthenticated: Show Mobile XS Sign In Link */
              <Link
                href="/sign-in"
                className="text-xs font-semibold text-[#52525B] hover:text-[#FF529A] px-2 py-1.5 transition-colors hidden sm:flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-[#FF529A]" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Studio App Sparkle CTA Button - Mobile Compact Text XS */}
            <div className="relative">
              <SparkleContainer />
              <Link
                href="/dashboard"
                onClick={triggerBurst}
                className="btn-aiigen-primary text-[11px] sm:text-xs font-extrabold px-3 sm:px-5 py-1.5 sm:py-2.5 flex items-center gap-1 sm:gap-2 shadow-md shadow-pink-500/25 group rounded-full"
              >
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white group-hover:scale-110 transition-transform" />
                <span>Studio</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full text-[#0A0A0C] hover:bg-[#F5F5F7] border border-[#E4E4E7] transition-colors ml-0.5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#FF529A]" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Ultra-Compact Glass Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden max-w-6xl mx-auto mt-1.5 pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl border border-[#FFC2DA] p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF529A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Navigation Hub</span>
                </div>
                <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Claude 3.5 Ready
                </span>
              </div>

              <nav className="grid grid-cols-2 gap-1.5 text-xs font-bold text-[#0A0A0C]">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-pink-50 hover:text-[#FF529A] border border-[#E2E8F0] transition-colors text-center text-xs"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-2 border-t border-[#E4E4E7] flex flex-col gap-1.5">
                {user?.loggedIn ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-aiigen-secondary py-2 text-center text-xs font-bold rounded-xl border-[#FFC2DA] flex items-center justify-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-[#FF529A]" />
                      <span>Account Settings</span>
                      <PlanBadge plan={user.plan} planStatus={user.planStatus} />
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="py-2 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-xl border border-rose-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-aiigen-secondary py-2.5 text-center text-xs font-bold rounded-xl border-[#FFC2DA]"
                  >
                    Sign In / Create Free Account
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-aiigen-primary py-2.5 text-center text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/25"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
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
