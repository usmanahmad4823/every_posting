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

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1 border-t border-[#E4E4E7] pt-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
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

      {/* Mobile Ultra-Compact Glass Drawer (Mobile & Tablet Only: md:hidden) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden max-w-6xl mx-auto mt-1.5 pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl border border-[#FFC2DA] p-3.5 shadow-2xl space-y-2.5">
              {/* Nav Links Grid */}
              <nav className="grid grid-cols-2 gap-1.5 text-xs font-bold text-[#0A0A0C]">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-pink-50 hover:text-[#FF529A] border border-[#E2E8F0] transition-colors text-center text-xs font-extrabold"
                  >
                    {link.label}
                  </Link>
                ))}

                {user?.loggedIn ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-pink-50 hover:text-[#FF529A] border border-[#E2E8F0] transition-colors text-center text-xs font-extrabold flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#FF529A]" />
                    <span>Settings</span>
                  </Link>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-pink-50 hover:text-[#FF529A] border border-[#E2E8F0] transition-colors text-center text-xs font-extrabold"
                  >
                    Sign In
                  </Link>
                )}
              </nav>

              {/* Single Primary Studio CTA Button */}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-aiigen-primary text-xs font-extrabold py-2.5 flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/25 rounded-xl"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Open Repurposing Studio →</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
