'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, User, Mail, Lock, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpUser } from '@/lib/supabase';
import { useUser } from '@/components/providers/user-provider';
import { AuthLoadingScreen } from '@/components/ui/auth-loading';

export default function SignUpPage() {
  const { user, isLoading, invalidateUser } = useUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.loggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoading, user?.loggedIn, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setGoogleNotice(null);

    // Validation 1: Confirm Password
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both password fields match.');
      setLoading(false);
      return;
    }

    // Validation 2: Terms & Confirmation Checkbox
    if (!agreedToTerms) {
      setErrorMsg('Please check the confirmation box to agree to the terms.');
      setLoading(false);
      return;
    }

    const res = await signUpUser(fullName, email, password);

    if (res.success) {
      await invalidateUser();
      router.replace('/dashboard');
    } else {
      setErrorMsg(res.error || 'Failed to create account in Supabase.');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setGoogleNotice('Google Sign-In will be available soon! Please sign up with your email and password.');
    setTimeout(() => setGoogleNotice(null), 5000);
  };

  if (isLoading || user?.loggedIn) {
    return <AuthLoadingScreen message="Redirecting to your Creator Studio..." />;
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-12 bg-gradient-to-b from-[#FAF8F5] via-[#F5F3EF] to-[#EAE5DD] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#0A0A0C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#FF529A]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#0A0A0C]">
              Every<span className="text-[#FF529A]">Posting</span>
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold text-[#0A0A0C] tracking-tight">
            Welcome to EveryPosting
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-2 font-medium max-w-sm mx-auto leading-relaxed">
            Create your account to start repurposing content in seconds.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/5">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {googleNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>{googleNotice}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-3.5">
            {/* Full Name Field */}
            <div className="relative flex items-center bg-white border border-[#E4E4E7] focus-within:border-[#0A0A0C] focus-within:ring-2 focus-within:ring-[#0A0A0C]/10 rounded-full shadow-sm px-4 py-3.5 transition-all">
              <User className="w-5 h-5 text-[#71717A] shrink-0" />
              <div className="h-5 w-[1px] bg-[#E4E4E7] mx-3 shrink-0" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-transparent text-sm text-[#0A0A0C] placeholder:text-[#A1A1AA] outline-none font-medium"
              />
            </div>

            {/* Email Address Field */}
            <div className="relative flex items-center bg-white border border-[#E4E4E7] focus-within:border-[#0A0A0C] focus-within:ring-2 focus-within:ring-[#0A0A0C]/10 rounded-full shadow-sm px-4 py-3.5 transition-all">
              <Mail className="w-5 h-5 text-[#71717A] shrink-0" />
              <div className="h-5 w-[1px] bg-[#E4E4E7] mx-3 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hi@potarastudio.com"
                className="w-full bg-transparent text-sm text-[#0A0A0C] placeholder:text-[#A1A1AA] outline-none font-medium"
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center bg-white border border-[#E4E4E7] focus-within:border-[#0A0A0C] focus-within:ring-2 focus-within:ring-[#0A0A0C]/10 rounded-full shadow-sm px-4 py-3.5 transition-all">
              <Lock className="w-5 h-5 text-[#71717A] shrink-0" />
              <div className="h-5 w-[1px] bg-[#E4E4E7] mx-3 shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-sm text-[#0A0A0C] placeholder:text-[#A1A1AA] outline-none font-medium"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="relative flex items-center bg-white border border-[#E4E4E7] focus-within:border-[#0A0A0C] focus-within:ring-2 focus-within:ring-[#0A0A0C]/10 rounded-full shadow-sm px-4 py-3.5 transition-all">
              <Lock className="w-5 h-5 text-[#71717A] shrink-0" />
              <div className="h-5 w-[1px] bg-[#E4E4E7] mx-3 shrink-0" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-transparent text-sm text-[#0A0A0C] placeholder:text-[#A1A1AA] outline-none font-medium"
              />
            </div>

            {/* Checkbox / Click to Verify Confirmation */}
            <div className="flex items-center gap-3 pt-1 px-1">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                  agreedToTerms
                    ? 'bg-[#0A0A0C] border-[#0A0A0C] text-white'
                    : 'bg-white border-[#D4D4D8] text-transparent hover:border-[#A1A1AA]'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <label
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className="text-xs text-[#71717A] font-medium leading-tight cursor-pointer select-none"
              >
                I confirm my details & agree to the{' '}
                <span className="text-[#0A0A0C] font-semibold underline">Terms & Privacy Policy</span>
              </label>
            </div>

            {/* Primary Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0C] hover:bg-[#27272A] text-white font-bold text-sm py-4 rounded-full shadow-lg shadow-black/10 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-3"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E4E4E7]" />
            </div>
            <span className="relative bg-white/90 px-3 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
              Or
            </span>
          </div>

          {/* Formality Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-white hover:bg-slate-50 border border-[#E4E4E7] text-[#0A0A0C] font-semibold text-sm py-3.5 rounded-full shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>Sign in with Google</span>
          </button>

          {/* Footer Navigation Link */}
          <div className="mt-6 text-center text-xs sm:text-sm text-[#71717A] font-medium">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#0A0A0C] font-bold hover:underline ml-0.5">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

