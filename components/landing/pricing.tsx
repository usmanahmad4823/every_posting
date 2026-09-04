'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, ShieldCheck, AlertCircle, ArrowRight, Star, Crown } from 'lucide-react';
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

    // Require Login before subscribing
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

      // Redirect directly to Stripe Hosted Checkout Page
      window.location.href = data.url;
    } catch (e: any) {
      console.error('[Pricing Section Checkout Error]:', e);
      setErrorMsg(e.message || 'Unable to connect to Stripe Checkout.');
      setLoadingPlan(null);
    }
  };

  const userTier = user?.tier || 'free';

  return (
    <section id="pricing" className="py-24 relative z-10 bg-[#F5F5F7] overflow-hidden">
      <SparkleContainer />

      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-pink-300/30 via-purple-300/20 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="aiigen-pill mb-3 border-[#FFC2DA] bg-white/80 backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF529A] animate-pulse" />
            <span className="text-[#0A0A0C] font-semibold">Transparent Creator Investment</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-aiigen-title tracking-tightest mt-2">
            Start Free. Upgrade for <span className="text-gradient-aura">Pro Scale</span>
          </h2>
          <p className="mt-4 text-[#52525B] text-base sm:text-lg font-medium leading-relaxed">
            Choose the membership crafted to unlock infinite leverage for your content production workflow.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3 font-medium shadow-md animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {!user?.loggedIn && (
              <Link
                href="/sign-in?redirect=/pricing"
                className="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-300 transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* Luxury Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Card 1: Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between border border-[#E4E4E7] hover:border-[#FF529A]/50 shadow-xl hover:shadow-2xl hover:shadow-pink-500/10 transition-all relative overflow-hidden group"
          >
            {/* Soft Ambient Card Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-pink-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-[#52525B] border border-[#E4E4E7]">
                  Starter Tier
                </span>
                <Star className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0A0A0C]">Free</h3>
              <p className="text-[#71717A] text-xs mt-1 font-medium">Perfect for testing with your first transcripts</p>

              <div className="mt-6 mb-6 pb-6 border-b border-[#F1F5F9]">
                <span className="text-4xl font-extrabold text-[#0A0A0C] tracking-tight">$0</span>
                <span className="text-[#71717A] text-sm font-medium"> / forever</span>
              </div>

              <ul className="space-y-3.5 text-xs text-[#52525B] mb-8 font-medium">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <strong className="text-[#0A0A0C] font-bold">3 AI generations per month</strong>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span>Access to all 3 creator niches</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span>Twitter threads & LinkedIn posts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span>Instant 1-click clipboard copy</span>
                </li>
              </ul>
            </div>

            <motion.div whileTap={{ scale: 0.96 }}>
              <Link
                href="/dashboard"
                onClick={(e) => triggerBurst(e)}
                className="w-full btn-aiigen-secondary py-3.5 rounded-2xl text-center text-xs sm:text-sm font-extrabold block border-[#FFC2DA] hover:bg-pink-50/80 text-[#0A0A0C] hover:text-[#FF529A] shadow-sm transition-all"
              >
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>

          {/* Card 2: Pro Monthly */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.1 }}
            className="bg-white rounded-3xl p-8 flex flex-col justify-between border-2 border-[#FF529A]/40 shadow-2xl hover:shadow-pink-500/20 transition-all relative overflow-hidden group"
          >
            {/* Subtle Aura Highlight Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF529A] to-purple-600" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-pink-50 text-[#FF529A] border border-pink-200 shadow-2xs">
                  Monthly Subscription
                </span>
                <Zap className="w-4 h-4 text-[#FF529A]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0A0A0C]">Pro Monthly</h3>
              <p className="text-[#71717A] text-xs mt-1 font-medium">For active podcasters, YouTubers & coaches</p>

              <div className="mt-6 mb-6 pb-6 border-b border-[#F1F5F9]">
                <span className="text-4xl font-extrabold text-[#0A0A0C] tracking-tight">$19</span>
                <span className="text-[#71717A] text-sm font-medium"> / month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-[#52525B] mb-8 font-medium">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-100/70 border border-pink-300 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#FF529A]" />
                  </div>
                  <strong className="text-[#0A0A0C] font-bold">150 AI generations per month</strong>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-100/70 border border-pink-300 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#FF529A]" />
                  </div>
                  <span>All 4 formats (Notes, Threads, Posts, Emails)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-100/70 border border-pink-300 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#FF529A]" />
                  </div>
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-100/70 border border-pink-300 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#FF529A]" />
                  </div>
                  <span>Full Generation History database</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleCheckout(e, 'pro_monthly')}
              disabled={loadingPlan === 'pro_monthly' || userTier === 'pro_monthly' || userTier === 'pro'}
              className="w-full bg-gradient-to-r from-pink-50 via-white to-pink-50 hover:from-[#FF529A] hover:to-purple-600 hover:text-white text-[#FF529A] font-extrabold py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#FF529A]/40 shadow-md hover:shadow-pink-500/30 transition-all cursor-pointer disabled:opacity-80"
            >
              {loadingPlan === 'pro_monthly' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#FF529A] border-t-transparent rounded-full animate-spin" />
                  Connecting to Stripe...
                </span>
              ) : userTier === 'pro_monthly' || userTier === 'pro' ? (
                <span>✓ Pro Monthly Active</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Get Pro Monthly ($19/mo)</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Card 3: Pro Yearly (VIP LUXURY GOLD/PINK GRADIENT HIGHLIGHT CARD) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            whileHover={{ y: -10, scale: 1.025 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.2 }}
            className="relative flex flex-col justify-between rounded-3xl p-0.5 bg-gradient-to-b from-[#FF529A] via-purple-600 to-[#FF007A] shadow-2xl shadow-pink-500/25 group"
          >
            <div className="p-8 flex flex-col justify-between h-full bg-gradient-to-br from-[#FF529A] via-[#E0337E] to-purple-800 rounded-[23px] text-white relative overflow-hidden">
              {/* Luxury Ambient Shimmer */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              {/* Best Value Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold bg-white text-[#FF529A] shadow-xl flex items-center gap-1.5 border border-pink-200 whitespace-nowrap z-20">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>BEST VALUE • 2 MONTHS FREE</span>
              </div>

              <div className="relative z-10 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 text-white border border-white/30 backdrop-blur-md">
                    Annual VIP Membership
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                </div>

                <h3 className="text-2xl font-extrabold text-white">Pro Yearly</h3>
                <p className="text-pink-100 text-xs mt-1 font-medium">Save ~20% with yearly billing. Maximum leverage.</p>

                <div className="mt-6 mb-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$190</span>
                  <span className="text-pink-100 text-sm font-medium"> / year</span>
                </div>
                <p className="text-xs text-amber-200 font-extrabold mb-6 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>Equivalent to $15.83/mo (Save $38/year)</span>
                </p>

                <ul className="space-y-3.5 text-xs text-white mb-8 font-medium">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <strong className="text-white font-bold">1,800 AI generations per year</strong>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>All current & future niche tools</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>Priority Claude 3.5 Sonnet processing</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>VIP Creator email support</span>
                  </li>
                </ul>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleCheckout(e, 'pro_yearly')}
                disabled={loadingPlan === 'pro_yearly' || userTier === 'pro_yearly' || userTier === 'annual'}
                className="w-full bg-white hover:bg-amber-50 text-[#FF529A] hover:text-purple-900 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xl hover:shadow-white/20 transition-all cursor-pointer disabled:opacity-80 relative z-10"
              >
                {loadingPlan === 'pro_yearly' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#FF529A] border-t-transparent rounded-full animate-spin" />
                    Connecting to Stripe...
                  </span>
                ) : userTier === 'pro_yearly' || userTier === 'annual' ? (
                  <span>✓ Pro Yearly Active</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Get Pro Yearly ($190/yr)</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

