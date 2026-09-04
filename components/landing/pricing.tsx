'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, ShieldCheck, AlertCircle, Users, HardDrive, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [user, setUser] = useState<{ id?: string; email?: string; loggedIn?: boolean; tier?: string } | null>(null);
  const router = useRouter();

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

  const handleCheckout = async (planType: 'pro_monthly' | 'pro_yearly') => {
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

      window.location.href = data.url;
    } catch (e: any) {
      console.error('[Pricing Section Checkout Error]:', e);
      setErrorMsg(e.message || 'Unable to connect to Stripe Checkout.');
      setLoadingPlan(null);
    }
  };

  const userTier = user?.tier || 'free';

  return (
    <section id="pricing" className="py-24 sm:py-32 relative z-10 bg-[#08070C] overflow-hidden text-white">
      {/* Background Pink & Purple Glowing Aura Background Orbs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF529A]/20 via-purple-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-pink-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Massive Background Watermark Typography */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-7xl sm:text-[140px] lg:text-[180px] font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FF529A]/15 to-transparent tracking-widest select-none pointer-events-none z-0 opacity-60">
        PRICING PLAN
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#FF529A]/30 text-pink-300 text-xs font-bold backdrop-blur-md mb-4 shadow-lg shadow-pink-500/10">
            <span className="w-2 h-2 rounded-full bg-[#FF529A] animate-ping" />
            <span>Transparent Pinkish Creator Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight mt-2 leading-tight">
            Invest in Leverage. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF529A] via-pink-400 to-purple-400">
              Scale Your Content.
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-lg font-medium leading-relaxed">
            Turn every single audio recording or video script into 7 days of ready-to-post social media content.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 font-medium shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {!user?.loggedIn && (
              <Link
                href="/sign-in?redirect=/pricing"
                className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-lg border border-rose-400/40 transition-colors shrink-0"
              >
                Sign In Now →
              </Link>
            )}
          </div>
        )}

        {/* Pricing Cards Grid (Glassmorphism & Pink Glow UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Card 1: Free Starter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#12101A]/70 border border-white/10 hover:border-[#FF529A]/40 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div>
              {/* Card Top Icon & Badge Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-lg">
                  S
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/5 text-slate-300 border border-white/10 backdrop-blur-md">
                  Starter Tier
                </span>
              </div>

              <h3 className="text-2xl font-black text-white">Free Starter</h3>
              <p className="text-slate-400 text-xs mt-1 font-medium">Perfect for testing with your first transcripts</p>

              <div className="my-6">
                <span className="text-4xl sm:text-5xl font-black text-white">$0</span>
                <span className="text-slate-400 text-sm font-medium"> / forever</span>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-extrabold py-3.5 rounded-2xl text-center text-sm block border border-white/15 transition-all shadow-md active:scale-95 mb-6"
              >
                {userTier === 'free' ? 'Current Free Plan' : 'Get Started Free'}
              </Link>

              {/* Key Meta Stats */}
              <div className="space-y-2.5 text-xs text-slate-300 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>3 AI generations / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Basic generation history</span>
                </div>
              </div>

              <div className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 mb-4">
                INCLUDES FREE ↓
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-medium">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Access to all 3 creator niches</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Twitter threads & LinkedIn posts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Instant 1-click clipboard copy</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2: Pro Monthly (FEATURED PINKISH CARD FROM REFERENCE IMAGE) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-[#160E22]/90 border-2 border-[#FF529A] transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-2xl shadow-[0_0_50px_rgba(255,82,154,0.25)] relative overflow-hidden group scale-[1.02]"
          >
            {/* Top Pinkish Radial Header Glow */}
            <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#FF529A]/30 via-purple-600/15 to-transparent pointer-events-none" />

            <div>
              {/* Card Top Icon & Most Popular Badge Row */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF529A] to-purple-600 border border-white/20 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-500/40">
                  M
                </div>
                <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FF529A]/20 text-pink-300 border border-[#FF529A]/40 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF529A]" />
                  <span>✦ Most popular</span>
                </span>
              </div>

              <h3 className="text-2xl font-black text-white relative z-10">Pro Monthly</h3>
              <p className="text-pink-200/80 text-xs mt-1 font-medium relative z-10">
                Supercharged repurposing engine for creators & podcasters
              </p>

              <div className="my-6 relative z-10">
                <span className="text-4xl sm:text-5xl font-black text-white">$19</span>
                <span className="text-slate-300 text-sm font-medium"> / month</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleCheckout('pro_monthly')}
                disabled={loadingPlan === 'pro_monthly' || userTier === 'pro_monthly' || userTier === 'pro'}
                className="w-full bg-gradient-to-r from-[#FF529A] via-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold py-3.5 rounded-2xl text-center text-sm flex items-center justify-center gap-2 border border-pink-400/30 transition-all shadow-xl shadow-pink-500/35 active:scale-95 mb-6 relative z-10 disabled:opacity-80 cursor-pointer"
              >
                {loadingPlan === 'pro_monthly' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting to Stripe...
                  </span>
                ) : userTier === 'pro_monthly' || userTier === 'pro' ? (
                  <span>✓ Pro Monthly Active</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Choose this plan ($19/mo)</span>
                  </>
                )}
              </button>

              {/* Key Meta Stats */}
              <div className="space-y-2.5 text-xs text-slate-200 mb-6 pb-6 border-b border-white/15 relative z-10">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <strong className="text-white">150 AI generations per month</strong>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <span>Unlimited Cloud History Storage</span>
                </div>
              </div>

              <div className="text-[10px] font-extrabold tracking-wider uppercase text-pink-300/80 mb-4 relative z-10">
                INCLUDES EVERYTHING PRO ↓
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-medium relative z-10">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FF529A]/30 text-pink-300 flex items-center justify-center text-[10px] shrink-0 font-bold border border-[#FF529A]/40">✓</div>
                  <span>All 4 Formats (Notes, Threads, Posts, Emails)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FF529A]/30 text-pink-300 flex items-center justify-center text-[10px] shrink-0 font-bold border border-[#FF529A]/40">✓</div>
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FF529A]/30 text-pink-300 flex items-center justify-center text-[10px] shrink-0 font-bold border border-[#FF529A]/40">✓</div>
                  <span>Full Generation History database</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 3: Pro Yearly (BEST VALUE CARD) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-[#12101A]/70 border border-white/10 hover:border-[#FF529A]/40 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-600/15 to-transparent pointer-events-none" />

            <div>
              {/* Card Top Icon & Badge Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 border border-white/15 flex items-center justify-center text-white font-black text-xl shadow-lg">
                  Y
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-md">
                  ⚡ 2 Months Free
                </span>
              </div>

              <h3 className="text-2xl font-black text-white">Pro Yearly</h3>
              <p className="text-slate-400 text-xs mt-1 font-medium">Save ~20% with yearly billing. Maximum leverage.</p>

              <div className="my-6">
                <span className="text-4xl sm:text-5xl font-black text-white">$190</span>
                <span className="text-slate-400 text-sm font-medium"> / year</span>
                <p className="text-[11px] text-pink-400 font-extrabold mt-1">Equivalent to $15.83/mo (Save $38/year)</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleCheckout('pro_yearly')}
                disabled={loadingPlan === 'pro_yearly' || userTier === 'pro_yearly' || userTier === 'annual'}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-extrabold py-3.5 rounded-2xl text-center text-sm flex items-center justify-center gap-2 border border-white/15 transition-all shadow-md active:scale-95 mb-6 disabled:opacity-80 cursor-pointer"
              >
                {loadingPlan === 'pro_yearly' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting to Stripe...
                  </span>
                ) : userTier === 'pro_yearly' || userTier === 'annual' ? (
                  <span>✓ Pro Yearly Active</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-purple-300" />
                    <span>Choose Pro Yearly ($190/yr)</span>
                  </>
                )}
              </button>

              {/* Key Meta Stats */}
              <div className="space-y-2.5 text-xs text-slate-300 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400 shrink-0" />
                  <strong className="text-white">1,800 AI generations per year</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>VIP Creator Email Support</span>
                </div>
              </div>

              <div className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 mb-4">
                INCLUDES ALL PRO FEATURES ↓
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-medium">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>All current & future niche tools</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Unlimited Cloud History database</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
