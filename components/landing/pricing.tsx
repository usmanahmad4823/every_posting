'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Flame, ShieldCheck, AlertCircle } from 'lucide-react';
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

  const handleCheckout = async (planType: 'pro' | 'lifetime') => {
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

      // Redirect directly to Stripe Hosted Checkout Page (checkout.stripe.com)
      window.location.href = data.url;
    } catch (e: any) {
      console.error('[Pricing Section Checkout Error]:', e);
      setErrorMsg(e.message || 'Unable to connect to Stripe Checkout.');
      setLoadingPlan(null);
    }
  };

  const userTier = user?.tier || 'free';

  return (
    <section id="pricing" className="py-24 relative z-10 bg-[#F5F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="aiigen-pill mb-3 border-[#FFC2DA]">
            <span className="w-2 h-2 rounded-full bg-[#FF529A]" />
            <span className="text-[#0A0A0C]">Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-aiigen-title tracking-tightest mt-2">
            Start Free. Upgrade for Unlimited Leverage.
          </h2>
          <p className="mt-4 text-[#52525B] text-base sm:text-lg font-medium">
            Whether you want to try it out or secure lifetime access, we have a plan built for your production scale.
          </p>
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="aiigen-card p-8 flex flex-col justify-between"
          >
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
                  <span>10 AI generations per month</span>
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
              Get Started Free
            </Link>
          </motion.div>

          {/* Card 2: Pro Monthly (Pink Aura Border & Solid Pink Card) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="aura-gradient-border relative flex flex-col justify-between"
          >
            <div className="aura-gradient-border-dark p-8 flex flex-col justify-between h-full bg-[#FF529A] text-white">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold bg-white text-[#FF529A] shadow-lg flex items-center gap-1.5 border border-pink-200">
                <Sparkles className="w-3.5 h-3.5 fill-[#FF529A]" />
                <span>MOST POPULAR</span>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                  Pro Subscription
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-4">Pro Monthly</h3>
                <p className="text-pink-100 text-xs mt-1 font-medium">For active podcasters, YouTubers & coaches</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">$29</span>
                  <span className="text-pink-100 text-sm font-medium"> / month</span>
                </div>

                <ul className="space-y-3 text-sm text-white mb-8 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <strong className="text-white">Unlimited AI generations</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>All formats (Threads, Show Notes, Emails)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Priority Claude 3.5 Sonnet processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Full Generation History database</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckout('pro')}
                disabled={loadingPlan === 'pro' || userTier === 'pro'}
                className="w-full bg-white text-[#FF529A] hover:bg-slate-50 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-80"
              >
                {loadingPlan === 'pro' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#FF529A] border-t-transparent rounded-full animate-spin" />
                    Connecting to Stripe...
                  </span>
                ) : userTier === 'pro' ? (
                  <span>✓ Pro Plan Active</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-[#FF529A]" />
                    <span>Subscribe Pro ($29/mo)</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Card 3: Lifetime Deal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="aiigen-card p-8 flex flex-col justify-between bg-white border border-[#E4E4E7]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  One-Time Pay
                </span>
                {userTier === 'lifetime' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white uppercase">
                    ● ACTIVE NOW
                  </span>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 animate-pulse">
                    <Flame className="w-4 h-4 fill-amber-500" />
                    <span>37 / 100 claimed</span>
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-extrabold text-[#0A0A0C] mt-4">Lifetime Deal</h3>
              <p className="text-[#71717A] text-xs mt-1 font-medium">Pay once, own forever. Limited launch spots.</p>

              <div className="mt-6 mb-2">
                <span className="text-4xl font-extrabold text-[#0A0A0C]">$199</span>
                <span className="text-[#71717A] text-sm font-medium"> / one-time</span>
              </div>
              <p className="text-[11px] text-[#FF529A] font-bold mb-6">
                ⚡ Never pay monthly subscription fees
              </p>

              <ul className="space-y-3 text-sm text-[#52525B] mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <strong className="text-[#0A0A0C]">Lifetime Unlimited Access</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <span>All current & future niche updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF529A] shrink-0" />
                  <span>Priority Claude 3.5 Sonnet processing</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('lifetime')}
              disabled={loadingPlan === 'lifetime' || userTier === 'lifetime'}
              className="w-full btn-aiigen-primary font-extrabold py-3.5 text-center text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 disabled:opacity-80"
            >
              {loadingPlan === 'lifetime' ? (
                <span className="flex items-center gap-2 text-white">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting to Stripe...
                </span>
              ) : userTier === 'lifetime' ? (
                <span>✓ Lifetime Active</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Get Lifetime Deal ($199)</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
