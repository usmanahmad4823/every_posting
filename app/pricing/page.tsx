'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Zap, Flame, ShieldCheck, AlertCircle, UserCheck } from 'lucide-react';

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

    // 1. REQUIRE LOGIN / SIGNUP CHECK BEFORE SUBSCRIBING
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
      console.error('[Pricing Checkout Error]:', e);
      setErrorMsg(e.message || 'Unable to connect to Stripe Checkout. Please check your configuration.');
      setLoadingPlan(null);
    }
  };

  const userTier = user?.tier || 'free';

  return (
    <div className="pt-20 sm:pt-32 pb-12 sm:pb-24 bg-[#F5F5F7] min-h-screen relative overflow-hidden bg-aiigen-dots">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="aiigen-pill mb-2 sm:mb-3 border-[#FFC2DA]">
            <span className="w-2 h-2 rounded-full bg-[#FF529A]" />
            <span className="text-[#0A0A0C] text-[10px] sm:text-xs">Transparent Creator Plans</span>
          </div>
          <h1 className="text-2xl sm:text-6xl font-extrabold text-[#0A0A0C] tracking-tight">
            Invest in Leverage. Scale Your Audience.
          </h1>
          <p className="mt-2 sm:mt-4 text-[#52525B] text-xs sm:text-xl font-medium">
            Turn every single audio recording or video script into 7 days of ready-to-post social media content.
          </p>

          {/* User Active Subscription Status Banner */}
          {user?.loggedIn && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FFC2DA] shadow-sm text-xs font-bold text-[#0A0A0C]">
              <UserCheck className="w-4 h-4 text-[#FF529A]" />
              <span>Signed in as <strong>{user.email}</strong></span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF529A] text-white text-[10px] uppercase font-extrabold ml-1">
                {userTier} Active
              </span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3 font-medium shadow-sm">
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {/* Card 1: Free Tier */}
          <div className="aiigen-card p-8 flex flex-col justify-between bg-white border border-[#E4E4E7]">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-[#52525B] border border-[#E4E4E7]">
                Starter Tier
              </span>
              <h3 className="text-2xl font-extrabold text-[#0A0A0C] mt-4">Free</h3>
              <p className="text-[#71717A] text-xs mt-1 font-medium">Perfect for testing with your first transcripts</p>

              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-[#0A0A0C]">$0</span>
                <span className="text-[#71717A] text-sm font-medium"> / forever</span>
              </div>

              <ul className="space-y-3 text-sm text-[#52525B] mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong className="text-[#0A0A0C]">3 AI generations per month</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Access to all 3 creator niches</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Twitter threads & LinkedIn posts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant 1-click clipboard copy</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="w-full btn-aiigen-secondary py-3.5 text-center text-sm font-bold block border-[#FFC2DA] hover:bg-[#FFF0F6]"
            >
              {userTier === 'free' ? 'Current Free Plan' : 'Go to Studio App'}
            </Link>
          </div>

          {/* Card 2: Pro Monthly */}
          <div className="aiigen-card p-8 flex flex-col justify-between bg-white border border-[#FFC2DA] shadow-xl relative">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#FF529A] border border-pink-200">
                Monthly Subscription
              </span>
              <h3 className="text-2xl font-extrabold text-[#0A0A0C] mt-4">Pro Monthly</h3>
              <p className="text-[#71717A] text-xs mt-1 font-medium">For active podcasters, YouTubers & coaches</p>

              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-[#0A0A0C]">$19</span>
                <span className="text-[#71717A] text-sm font-medium"> / month</span>
              </div>

              <ul className="space-y-3 text-sm text-[#52525B] mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <strong className="text-[#0A0A0C]">100 AI generations per month</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <span>All 4 formats (Notes, Threads, Posts, Emails)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <span>Full Generation History database</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('pro_monthly')}
              disabled={loadingPlan === 'pro_monthly' || userTier === 'pro_monthly' || userTier === 'pro'}
              className="w-full btn-aiigen-secondary font-extrabold py-3.5 text-center text-sm flex items-center justify-center gap-2 border-[#FFC2DA] hover:bg-pink-50 text-[#FF529A] disabled:opacity-80"
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
                  <Zap className="w-4 h-4 fill-[#FF529A]" />
                  <span>Get Pro Monthly ($19/mo)</span>
                </>
              )}
            </button>
          </div>

          {/* Card 3: Pro Yearly (BEST VALUE Card) */}
          <div className="aura-gradient-border relative flex flex-col justify-between">
            <div className="aura-gradient-border-dark p-8 flex flex-col justify-between h-full bg-[#FF529A] text-white">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold bg-white text-[#FF529A] shadow-lg flex items-center gap-1.5 border border-pink-200">
                <Zap className="w-3.5 h-3.5 fill-[#FF529A]" />
                <span>BEST VALUE - 2 MONTHS FREE</span>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                  Annual Subscription
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-4">Pro Yearly</h3>
                <p className="text-pink-100 text-xs mt-1 font-medium">Save ~20% with yearly billing. Maximum leverage.</p>

                <div className="mt-6 mb-2">
                  <span className="text-4xl font-extrabold text-white">$190</span>
                  <span className="text-pink-100 text-sm font-medium"> / year</span>
                </div>
                <p className="text-xs text-white/90 font-extrabold mb-6">
                  ⚡ Equivalent to $15.83/mo (Save $38/year)
                </p>

                <ul className="space-y-3 text-sm text-white mb-8 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <strong className="text-white">1,200 AI generations per year</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>All current & future niche tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Priority Claude 3.5 Sonnet processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>VIP Creator email support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckout('pro_yearly')}
                disabled={loadingPlan === 'pro_yearly' || userTier === 'pro_yearly' || userTier === 'annual'}
                className="w-full bg-white text-[#FF529A] hover:bg-slate-50 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-80"
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
                    <ShieldCheck className="w-4 h-4 text-[#FF529A]" />
                    <span>Get Pro Yearly ($190/yr)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
