'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSparkleBurst } from '@/components/ui/sparkle-burst';

export function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [user, setUser] = useState<{ id?: string; email?: string; loggedIn?: boolean; tier?: string } | null>(null);
  const router = useRouter();
  const { triggerBurst, SparkleContainer } = useSparkleBurst();

  useEffect(() => {
    const stored = localStorage.getItem('everyposting_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleCheckout = async (e: React.MouseEvent<HTMLElement>, planType: 'pro_monthly' | 'pro_yearly') => {
    triggerBurst(e);
    setErrorMsg(null);

    if (!user || !user.loggedIn) {
      setErrorMsg('Please sign in or create an account first before subscribing to a plan.');
      setTimeout(() => {
        router.push(`/sign-in?redirect=/pricing&plan=${planType}`);
      }, 1200);
      return;
    }

    setLoadingPlan(planType);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          userEmail: user.email,
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to initialize Stripe Checkout Session');
      }

      window.location.href = data.url;
    } catch (e: any) {
      console.error('[Pricing Section Checkout Error]:', e);
      setErrorMsg(e.message || 'Unable to connect to Stripe Checkout.');
      setLoadingPlan(null);
    }
  };

  const userTier = user?.tier || 'free';

  return (
    <section id="pricing" className="py-24 relative z-10 bg-[#FBFBFC] border-t border-[#E4E4E7]">
      <SparkleContainer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minimal Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E4E4E7] text-[#52525B] shadow-2xs">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight mt-3">
            Predictable Plans for Creators
          </h2>
          <p className="mt-3 text-[#71717A] text-sm sm:text-base font-normal leading-relaxed">
            Choose the ideal capacity for your workflow. Switch or cancel anytime with zero friction.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3 font-medium shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {!user?.loggedIn && (
              <Link
                href="/sign-in?redirect=/pricing"
                className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-300 transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}

        {/* Minimal Luxury Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {/* Card 1: Starter / Free */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-7 flex flex-col justify-between border border-[#E4E4E7] shadow-xs hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Free Tier</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0C]">Starter</h3>
              <p className="text-[#71717A] text-xs mt-1 font-normal">Test EveryPosting with your first transcripts</p>

              <div className="mt-6 mb-6 pb-6 border-b border-[#F4F4F5]">
                <span className="text-4xl font-extrabold text-[#0A0A0C] tracking-tight">$0</span>
                <span className="text-[#71717A] text-xs font-normal"> / month</span>
              </div>

              <ul className="space-y-3 text-xs text-[#52525B] mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#0A0A0C] shrink-0" />
                  <span className="font-semibold text-[#0A0A0C]">3 AI generations per month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  <span>Access to all 3 creator niches</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  <span>Twitter threads & LinkedIn posts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  <span>1-click clipboard output export</span>
                </li>
              </ul>
            </div>

            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href="/dashboard"
                onClick={(e) => triggerBurst(e)}
                className="w-full bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#0A0A0C] font-bold py-3 rounded-xl text-xs text-center block transition-colors border border-[#E4E4E7]"
              >
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>

          {/* Card 2: Pro Monthly */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-7 flex flex-col justify-between border border-[#FF529A]/40 shadow-sm hover:shadow-lg transition-all relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#FF529A] uppercase tracking-wider">Pro Monthly</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-[#FF529A] border border-pink-100">
                  Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0C]">Pro Monthly</h3>
              <p className="text-[#71717A] text-xs mt-1 font-normal">For active creators scaling their workflow</p>

              <div className="mt-6 mb-6 pb-6 border-b border-[#F4F4F5]">
                <span className="text-4xl font-extrabold text-[#0A0A0C] tracking-tight">$19</span>
                <span className="text-[#71717A] text-xs font-normal"> / month</span>
              </div>

              <ul className="space-y-3 text-xs text-[#52525B] mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span className="font-semibold text-[#0A0A0C]">150 AI generations per month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span>All 4 output formats included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span>Priority Claude 3.5 Sonnet engine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span>Full generation history archive</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => handleCheckout(e, 'pro_monthly')}
              disabled={loadingPlan === 'pro_monthly' || userTier === 'pro_monthly' || userTier === 'pro'}
              className="w-full bg-[#FF529A] hover:bg-pink-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-80"
            >
              {loadingPlan === 'pro_monthly' ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </span>
              ) : userTier === 'pro_monthly' || userTier === 'pro' ? (
                <span>✓ Active Plan</span>
              ) : (
                <span>Subscribe Monthly ($19/mo)</span>
              )}
            </motion.button>
          </motion.div>

          {/* Card 3: Pro Yearly (Light Luxury Featured Card) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-7 flex flex-col justify-between border-2 border-[#FF529A]/60 shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
          >
            {/* Subtle Top Accent Indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF529A] via-pink-400 to-[#FF007A]" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#FF529A] uppercase tracking-wider">Pro Yearly</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-50 text-[#FF529A] border border-pink-200 shadow-2xs">
                  Best Value • 2 Months Free
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0C]">Pro Yearly</h3>
              <p className="text-[#71717A] text-xs mt-1 font-normal">Annual commitment for max leverage & savings</p>

              <div className="mt-6 mb-6 pb-6 border-b border-[#F4F4F5]">
                <span className="text-4xl font-extrabold text-[#0A0A0C] tracking-tight">$190</span>
                <span className="text-[#71717A] text-xs font-normal"> / year</span>
                <p className="text-[11px] text-[#FF529A] font-extrabold mt-1">
                  ⚡ $15.83/mo (Save $38/yr)
                </p>
              </div>

              <ul className="space-y-3 text-xs text-[#52525B] mb-8 font-medium">
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span className="font-bold text-[#0A0A0C]">1,800 AI generations per year</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span>All current & future niche tools</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span>VIP Creator support channel</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => handleCheckout(e, 'pro_yearly')}
              disabled={loadingPlan === 'pro_yearly' || userTier === 'pro_yearly' || userTier === 'annual'}
              className="w-full bg-[#FF529A] hover:bg-pink-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-80 shadow-md"
            >
              {loadingPlan === 'pro_yearly' ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </span>
              ) : userTier === 'pro_yearly' || userTier === 'annual' ? (
                <span>✓ Active Plan</span>
              ) : (
                <span>Subscribe Yearly ($190/yr)</span>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


