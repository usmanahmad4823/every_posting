'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInUser } from '@/lib/supabase';
import { useUser } from '@/components/providers/user-provider';
import { AuthLoadingScreen } from '@/components/ui/auth-loading';

export default function SignInPage() {
  const { user, isLoading, invalidateUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.loggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoading, user?.loggedIn, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setGoogleNotice(null);

    const res = await signInUser(email, password);

    if (res.success) {
      await invalidateUser();
      router.replace('/dashboard');
    } else {
      setErrorMsg(res.error || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleNotice('Google Sign-In will be available soon! Please sign in with your email and password.');
    setTimeout(() => setGoogleNotice(null), 5000);
  };

  if (isLoading || user?.loggedIn) {
    return <AuthLoadingScreen message="Redirecting to your Creator Studio..." />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row p-2 sm:p-3 lg:p-4 font-sans selection:bg-[#FF529A]/20 selection:text-[#FF529A]">
      {/* LEFT COLUMN: Visual Hero Banner Card (Hidden on small screens, flex on lg) */}
      <div className="hidden lg:flex flex-col justify-between p-10 lg:p-14 relative overflow-hidden rounded-[32px] bg-[#0A0A0C] w-1/2 min-h-[calc(100vh-2rem)] text-white shadow-2xl">
        {/* Background Visual Banner Image */}
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen scale-105 transition-transform duration-1000 hover:scale-100">
          <Image
            src="/auth-banner.png"
            alt="EveryPosting Visual Art"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent z-10 pointer-events-none" />

        {/* Top Header Tagline */}
        <div className="relative z-20 flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase">
            A WISE QUOTE
          </span>
          <div className="h-[1px] w-16 bg-white/30" />
        </div>

        {/* Bottom Hero Quote Content */}
        <div className="relative z-20 max-w-lg mb-4">
          <h2 className="font-serif text-4xl lg:text-5xl font-normal leading-[1.12] text-white tracking-tight">
            Get Everything You Want
          </h2>
          <p className="text-sm text-white/80 mt-4 leading-relaxed font-normal max-w-md">
            You can get everything you want if you work hard, trust the process, and stick to the plan.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Form Container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white min-h-[95vh] lg:min-h-0">
        {/* Top Logo */}
        <div className="flex justify-center mb-8 lg:mb-12">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0C] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-[#FF529A]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#0A0A0C]">
              Every<span className="text-[#FF529A]">Posting</span>
            </span>
          </Link>
        </div>

        {/* Center Form Box */}
        <div className="max-w-sm w-full mx-auto my-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0A0A0C] font-normal tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-[#71717A] mt-2 font-medium">
              Enter your email and password to access your account
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {googleNotice && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{googleNotice}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-[#0A0A0C] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#F4F4F5]/80 hover:bg-[#F4F4F5] border border-[#E4E4E7] focus:border-[#0A0A0C] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#0A0A0C] placeholder:text-[#A1A1AA] outline-none transition-all font-medium"
              />
            </div>

            {/* Password Input with Eye Toggle */}
            <div>
              <label className="block text-xs font-semibold text-[#0A0A0C] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#F4F4F5]/80 hover:bg-[#F4F4F5] border border-[#E4E4E7] focus:border-[#0A0A0C] focus:bg-white rounded-xl px-4 py-3 pr-10 text-sm text-[#0A0A0C] placeholder:text-[#A1A1AA] outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#0A0A0C] transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#71717A] font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D4D4D8] text-[#0A0A0C] focus:ring-[#0A0A0C] cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setGoogleNotice('Password reset links will be sent via email. Contact support if needed.')}
                className="text-xs font-semibold text-[#0A0A0C] hover:underline"
              >
                Forgot Password
              </button>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0C] hover:bg-[#27272A] text-white font-semibold text-sm py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Formality Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-slate-50 border border-[#E4E4E7] text-[#0A0A0C] font-semibold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm mt-3 active:scale-[0.99]"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>
        </div>

        {/* Bottom Footer Navigation */}
        <div className="mt-8 text-center text-xs text-[#71717A] font-medium">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-[#0A0A0C] font-bold hover:underline ml-0.5">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}


