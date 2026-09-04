'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, ShieldCheck, AlertCircle, UserCheck, Users, HardDrive, Layers } from 'lucide-react';

export default function PricingPage() {
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
      console.error('[Pricing Checkout Error]:', e);
      setErrorMsg(e.message || 'Unable to connect to Stripe Checkout. Please check your configuration.');
      setLoadingPlan(null);
    }
  };

  const userTier = user?.tier || 'free';

  return (
    <div className="pt-24 sm:pt-28 pb-8 sm:pb-10 bg-[#FFF5F9] min-h-screen relative overflow-hidden text-[#0A0A0C]">
      {/* Background Soft Pink & Purple Glowing Orbs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF529A]/15 via-pink-200/25 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-purple-300/15 via-pink-100/30 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#FF529A_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.06] pointer-events-none" />

      {/* Massive Background Watermark Typography */}
      <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-6xl sm:text-[120px] lg:text-[140px] font-black uppercase text-[#FF529A]/[0.07] tracking-widest select-none pointer-events-none z-0">
        PRICING PLAN
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Title & Signed-In Status */}
        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#FFC2DA] text-[#FF529A] text-[11px] font-bold shadow-2xs mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF529A] animate-ping" />
            <span>Transparent Creator Plans</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#0A0A0C] tracking-tight leading-tight">
            Invest in Leverage. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF529A] via-pink-600 to-purple-600">
              Scale Your Audience.
            </span>
          </h1>
          <p className="mt-1 text-[#52525B] text-xs sm:text-sm font-medium leading-relaxed">
            Turn every single audio recording or video script into 7 days of ready-to-post social media content.
          </p>

          {/* User Active Subscription Status Banner */}
          {user?.loggedIn && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white border border-[#FFC2DA] shadow-xs text-xs font-bold text-[#0A0A0C]">
              <UserCheck className="w-3.5 h-3.5 text-[#FF529A]" />
              <span>Signed in as <strong>{user.email}</strong></span>
              <span className="px-2 py-0.5 rounded-full bg-[#FF529A] text-white text-[9px] uppercase font-extrabold ml-1">
                {userTier} Active
              </span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="max-w-xl mx-auto mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 font-medium shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {!user?.loggedIn && (
              <Link
                href="/sign-in?redirect=/pricing"
                className="px-2.5 py-0.5 bg-white hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-md border border-rose-300 transition-colors shrink-0"
              >
                Sign In Now →
              </Link>
            )}
          </div>
        )}

        {/* Pricing Cards Grid (Icons Removed, Clean Right Badge Pills) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch max-w-5xl mx-auto">
          {/* Card 1: Free Starter */}
          <div className="rounded-2xl bg-white/70 border border-[#FFC2DA] hover:border-[#FF529A]/60 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between backdrop-blur-2xl shadow-lg hover:shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-pink-50/60 to-transparent pointer-events-none" />

            <div>
              {/* Card Title & Badge Row (Aligned Horizontally) */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-lg font-black text-[#0A0A0C]">Free Starter</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-[#52525B] border border-slate-200 shrink-0">
                  Starter Tier
                </span>
              </div>
              <p className="text-[#71717A] text-[11px] font-medium">Perfect for testing with your first transcripts</p>

              <div className="my-2.5">
                <span className="text-2xl sm:text-3xl font-black text-[#0A0A0C]">$0</span>
                <span className="text-[#71717A] text-xs font-medium"> / forever</span>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full bg-slate-50 hover:bg-pink-50 text-[#0A0A0C] font-extrabold py-2.5 rounded-xl text-center text-xs block border border-[#FFC2DA] transition-all shadow-2xs active:scale-95 mb-3"
              >
                {userTier === 'free' ? 'Current Free Plan' : 'Go to Studio App'}
              </Link>

              {/* Key Meta Stats */}
              <div className="space-y-1.5 text-xs text-[#52525B] mb-3 pb-3 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  <span>3 AI generations / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  <span>Basic generation history</span>
                </div>
              </div>

              <div className="text-[9px] font-extrabold tracking-wider uppercase text-[#71717A] mb-2">
                INCLUDES FREE ↓
              </div>

              <ul className="space-y-1.5 text-xs text-[#52525B] font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] shrink-0 font-bold">✓</div>
                  <span>Access to all 3 creator niches</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] shrink-0 font-bold">✓</div>
                  <span>Twitter threads & LinkedIn posts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] shrink-0 font-bold">✓</div>
                  <span>Instant 1-click clipboard copy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Pro Monthly ($29/mo) */}
          <div className="rounded-2xl bg-gradient-to-b from-white via-pink-50/70 to-white border-2 border-[#FF529A] transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,82,154,0.18)] relative overflow-hidden group scale-[1.01]">
            {/* Top Pinkish Radial Header Glow */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#FF529A]/15 to-transparent pointer-events-none" />

            <div>
              {/* Card Title & Badge Row (Aligned Horizontally) */}
              <div className="flex items-center justify-between gap-2 mb-1 relative z-10">
                <h3 className="text-lg font-black text-[#0A0A0C]">Pro Monthly</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 text-[#FF529A] border border-pink-300 backdrop-blur-md flex items-center gap-1 shadow-2xs shrink-0">
                  <Sparkles className="w-3 h-3 text-[#FF529A]" />
                  <span>✦ Most popular</span>
                </span>
              </div>
              <p className="text-[#52525B] text-[11px] font-medium relative z-10">
                Supercharged repurposing engine for creators
              </p>

              <div className="my-2.5 relative z-10">
                <span className="text-2xl sm:text-3xl font-black text-[#0A0A0C]">$29</span>
                <span className="text-[#71717A] text-xs font-medium"> / month</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleCheckout('pro_monthly')}
                disabled={loadingPlan === 'pro_monthly' || userTier === 'pro_monthly' || userTier === 'pro'}
                className="w-full bg-gradient-to-r from-[#FF529A] via-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold py-2.5 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-pink-500/25 active:scale-95 mb-3 relative z-10 disabled:opacity-80 cursor-pointer"
              >
                {loadingPlan === 'pro_monthly' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting to Stripe...
                  </span>
                ) : userTier === 'pro_monthly' || userTier === 'pro' ? (
                  <span>✓ Pro Monthly Active</span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Choose Pro Monthly ($29/mo)</span>
                  </>
                )}
              </button>

              {/* Key Meta Stats */}
              <div className="space-y-1.5 text-xs text-[#52525B] mb-3 pb-3 border-b border-pink-200/80 relative z-10">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <strong className="text-[#0A0A0C]">150 AI generations per month</strong>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
                  <span>Unlimited Cloud History Storage</span>
                </div>
              </div>

              <div className="text-[9px] font-extrabold tracking-wider uppercase text-[#FF529A] mb-2 relative z-10">
                INCLUDES EVERYTHING PRO ↓
              </div>

              <ul className="space-y-1.5 text-xs text-[#52525B] font-medium relative z-10">
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-100 text-[#FF529A] flex items-center justify-center text-[9px] shrink-0 font-bold border border-pink-300">✓</div>
                  <span>All 4 Formats (Notes, Threads, Posts, Emails)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-100 text-[#FF529A] flex items-center justify-center text-[9px] shrink-0 font-bold border border-pink-300">✓</div>
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-100 text-[#FF529A] flex items-center justify-center text-[9px] shrink-0 font-bold border border-pink-300">✓</div>
                  <span>Full Generation History database</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Pro Yearly */}
          <div className="rounded-2xl bg-white/70 border border-purple-200 hover:border-[#FF529A]/60 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between backdrop-blur-2xl shadow-lg hover:shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-50 to-transparent pointer-events-none" />

            <div>
              {/* Card Title & Badge Row (Aligned Horizontally) */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-lg font-black text-[#0A0A0C]">Pro Yearly</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 border border-purple-300 backdrop-blur-md shrink-0">
                  ⚡ 2 Months Free
                </span>
              </div>
              <p className="text-[#71717A] text-[11px] font-medium">Save ~20% with yearly billing. Maximum leverage.</p>

              <div className="my-2.5">
                <span className="text-2xl sm:text-3xl font-black text-[#0A0A0C]">$190</span>
                <span className="text-[#71717A] text-xs font-medium"> / year</span>
                <p className="text-[10px] text-[#FF529A] font-extrabold mt-0.5">Equivalent to $15.83/mo (Save $38/year)</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleCheckout('pro_yearly')}
                disabled={loadingPlan === 'pro_yearly' || userTier === 'pro_yearly' || userTier === 'annual'}
                className="w-full bg-gradient-to-r from-[#FF529A] via-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold py-2.5 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-pink-500/25 active:scale-95 mb-3 disabled:opacity-80 cursor-pointer"
              >
                {loadingPlan === 'pro_yearly' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting to Stripe...
                  </span>
                ) : userTier === 'pro_yearly' || userTier === 'annual' ? (
                  <span>✓ Pro Yearly Active</span>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>Choose Pro Yearly ($190/yr)</span>
                  </>
                )}
              </button>

              {/* Key Meta Stats */}
              <div className="space-y-1.5 text-xs text-[#52525B] mb-3 pb-3 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <strong className="text-[#0A0A0C]">1,800 AI generations per year</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>VIP Creator Email Support</span>
                </div>
              </div>

              <div className="text-[9px] font-extrabold tracking-wider uppercase text-[#71717A] mb-2">
                INCLUDES ALL PRO FEATURES ↓
              </div>

              <ul className="space-y-1.5 text-xs text-[#52525B] font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] shrink-0 font-bold">✓</div>
                  <span>All current & future niche tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] shrink-0 font-bold">✓</div>
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] shrink-0 font-bold">✓</div>
                  <span>Unlimited Cloud History database</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
