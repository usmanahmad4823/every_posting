'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, ShieldCheck, AlertCircle, Users, HardDrive, Layers } from 'lucide-react';
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
    <section id="pricing" className="py-24 sm:py-32 relative z-10 bg-[#FFF5F9] overflow-hidden text-[#0A0A0C]">
      {/* Background Soft Pink & Purple Glowing Aura Orbs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF529A]/15 via-pink-200/25 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-purple-300/15 via-pink-100/30 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#FF529A_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.06] pointer-events-none" />

      {/* Massive Background Watermark Typography */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-7xl sm:text-[140px] lg:text-[180px] font-black uppercase text-[#FF529A]/[0.07] tracking-widest select-none pointer-events-none z-0">
        PRICING PLAN
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FFC2DA] text-[#FF529A] text-xs font-bold shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF529A] animate-ping" />
            <span>Transparent Creator Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-black text-[#0A0A0C] tracking-tight mt-2 leading-tight">
            Invest in Leverage. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF529A] via-pink-600 to-purple-600">
              Scale Your Content.
            </span>
          </h2>
          <p className="mt-4 text-[#52525B] text-sm sm:text-lg font-medium leading-relaxed">
            Turn every single audio recording or video script into 7 days of ready-to-post social media content.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3 font-medium shadow-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {!user?.loggedIn && (
              <Link
                href="/sign-in?redirect=/pricing"
                className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-300 transition-colors shrink-0"
              >
                Sign In Now →
              </Link>
            )}
          </div>
        )}

        {/* Pricing Cards Grid (Pink & White Glassmorphism UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Card 1: Free Starter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-white/90 border border-[#FFC2DA] hover:border-[#FF529A]/60 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-xl shadow-xl hover:shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-pink-50/50 to-transparent pointer-events-none" />

            <div>
              {/* Card Top Icon & Badge Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-100 to-white border border-[#FFC2DA] flex items-center justify-center text-[#FF529A] font-black text-xl shadow-sm">
                  S
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-[#52525B] border border-slate-200">
                  Starter Tier
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#0A0A0C]">Free Starter</h3>
              <p className="text-[#71717A] text-xs mt-1 font-medium">Perfect for testing with your first transcripts</p>

              <div className="my-6">
                <span className="text-4xl sm:text-5xl font-black text-[#0A0A0C]">$0</span>
                <span className="text-[#71717A] text-sm font-medium"> / forever</span>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full bg-slate-50 hover:bg-pink-50 text-[#0A0A0C] font-extrabold py-3.5 rounded-2xl text-center text-sm block border border-[#FFC2DA] transition-all shadow-xs active:scale-95 mb-6"
              >
                {userTier === 'free' ? 'Current Free Plan' : 'Get Started Free'}
              </Link>

              {/* Key Meta Stats */}
              <div className="space-y-2.5 text-xs text-[#52525B] mb-6 pb-6 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#71717A] shrink-0" />
                  <span>3 AI generations / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#71717A] shrink-0" />
                  <span>Basic generation history</span>
                </div>
              </div>

              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#71717A] mb-4">
                INCLUDES FREE ↓
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#52525B] font-medium">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Access to all 3 creator niches</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Twitter threads & LinkedIn posts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Instant 1-click clipboard copy</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2: Pro Monthly (FEATURED PINK & WHITE GLASS CARD) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-gradient-to-b from-white via-pink-50/70 to-white border-2 border-[#FF529A] transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-2xl shadow-[0_10px_40px_rgba(255,82,154,0.2)] relative overflow-hidden group scale-[1.02]"
          >
            {/* Top Pinkish Radial Header Glow */}
            <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#FF529A]/15 to-transparent pointer-events-none" />

            <div>
              {/* Card Top Icon & Most Popular Badge Row */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF529A] to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  M
                </div>
                <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold bg-pink-100 text-[#FF529A] border border-pink-300 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF529A]" />
                  <span>✦ Most popular</span>
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#0A0A0C] relative z-10">Pro Monthly</h3>
              <p className="text-[#52525B] text-xs mt-1 font-medium relative z-10">
                Supercharged repurposing engine for creators & podcasters
              </p>

              <div className="my-6 relative z-10">
                <span className="text-4xl sm:text-5xl font-black text-[#0A0A0C]">$19</span>
                <span className="text-[#71717A] text-sm font-medium"> / month</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleCheckout('pro_monthly')}
                disabled={loadingPlan === 'pro_monthly' || userTier === 'pro_monthly' || userTier === 'pro'}
                className="w-full bg-gradient-to-r from-[#FF529A] via-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold py-3.5 rounded-2xl text-center text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-pink-500/30 active:scale-95 mb-6 relative z-10 disabled:opacity-80 cursor-pointer"
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
              <div className="space-y-2.5 text-xs text-[#52525B] mb-6 pb-6 border-b border-pink-200/80 relative z-10">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <strong className="text-[#0A0A0C]">150 AI generations per month</strong>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <span>Unlimited Cloud History Storage</span>
                </div>
              </div>

              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#FF529A] mb-4 relative z-10">
                INCLUDES EVERYTHING PRO ↓
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#52525B] font-medium relative z-10">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-pink-100 text-[#FF529A] flex items-center justify-center text-[10px] shrink-0 font-bold border border-pink-300">✓</div>
                  <span>All 4 Formats (Notes, Threads, Posts, Emails)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-pink-100 text-[#FF529A] flex items-center justify-center text-[10px] shrink-0 font-bold border border-pink-300">✓</div>
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-pink-100 text-[#FF529A] flex items-center justify-center text-[10px] shrink-0 font-bold border border-pink-300">✓</div>
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
            className="rounded-3xl bg-white/90 border border-purple-200 hover:border-[#FF529A]/60 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-xl shadow-xl hover:shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-50 to-transparent pointer-events-none" />

            <div>
              {/* Card Top Icon & Badge Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#FF529A] text-white font-black text-xl flex items-center justify-center shadow-md">
                  Y
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-700 border border-purple-300 backdrop-blur-md">
                  ⚡ 2 Months Free
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#0A0A0C]">Pro Yearly</h3>
              <p className="text-[#71717A] text-xs mt-1 font-medium">Save ~20% with yearly billing. Maximum leverage.</p>

              <div className="my-6">
                <span className="text-4xl sm:text-5xl font-black text-[#0A0A0C]">$190</span>
                <span className="text-[#71717A] text-sm font-medium"> / year</span>
                <p className="text-[11px] text-[#FF529A] font-extrabold mt-1">Equivalent to $15.83/mo (Save $38/year)</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleCheckout('pro_yearly')}
                disabled={loadingPlan === 'pro_yearly' || userTier === 'pro_yearly' || userTier === 'annual'}
                className="w-full bg-[#0A0A0C] hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl text-center text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 mb-6 disabled:opacity-80 cursor-pointer"
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
              <div className="space-y-2.5 text-xs text-[#52525B] mb-6 pb-6 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600 shrink-0" />
                  <strong className="text-[#0A0A0C]">1,800 AI generations per year</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>VIP Creator Email Support</span>
                </div>
              </div>

              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#71717A] mb-4">
                INCLUDES ALL PRO FEATURES ↓
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#52525B] font-medium">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>All current & future niche tools</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
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
