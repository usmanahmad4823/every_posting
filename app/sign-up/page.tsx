'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Mic,
  Video,
  Users,
} from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="h-screen max-h-screen w-full max-w-full overflow-hidden flex flex-col lg:flex-row bg-white font-sans">
      {/* LEFT PANEL: Branded Marketing Side */}
      <div className="hidden lg:flex w-1/2 h-full max-h-screen bg-gradient-to-br from-[#FFF0F5] via-[#FCE4EC] to-[#FFD1E3] p-8 lg:p-10 flex-col justify-between relative overflow-hidden shrink-0">
        {/* Background Ambient Glow Circles */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#FF529A] flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#1A1A2E]">
              Every<span className="text-[#FF529A]">Posting</span>
            </span>
          </Link>
        </div>

        {/* Middle Value Proposition & Headline */}
        <div className="relative z-10 my-auto max-w-sm">
          {/* Niche Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-md border border-pink-200/60 shadow-sm text-[10px] font-bold text-[#FF529A] mb-3">
            <Sparkles className="w-3 h-3 fill-[#FF529A]" />
            <span>AI-Powered Content Repurposing</span>
          </div>

          {/* Headline with Two-Tone Styling */}
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#1A1A2E] leading-[1.2]">
            Turn Your Content <br />
            <span className="text-[#FF529A]">Into Multiple Platforms</span>
          </h1>

          <p className="text-xs text-[#6B7280] mt-2.5 leading-relaxed font-medium">
            Repurpose your podcasts, YouTube videos, and client calls into engaging social posts — effortlessly.
          </p>

          {/* 3 Persona Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/70 backdrop-blur-md p-2.5 rounded-xl border border-white/80 shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-[#FF529A] mb-1">
                <Mic className="w-3 h-3" />
              </div>
              <h4 className="text-[10px] font-bold text-[#1A1A2E]">Podcasters</h4>
              <p className="text-[9px] text-[#6B7280] mt-0.5 font-medium leading-tight">Show notes, tweets</p>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-2.5 rounded-xl border border-white/80 shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-[#FF529A] mb-1">
                <Video className="w-3 h-3" />
              </div>
              <h4 className="text-[10px] font-bold text-[#1A1A2E]">YouTube Creators</h4>
              <p className="text-[9px] text-[#6B7280] mt-0.5 font-medium leading-tight">Threads, captions</p>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-2.5 rounded-xl border border-white/80 shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-[#FF529A] mb-1">
                <Users className="w-3 h-3" />
              </div>
              <h4 className="text-[10px] font-bold text-[#1A1A2E]">Coaches</h4>
              <p className="text-[9px] text-[#6B7280] mt-0.5 font-medium leading-tight">LinkedIn, emails</p>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-3 border-t border-pink-200/50 flex items-center justify-between">
          <span className="font-serif italic text-base text-[#FF529A] font-bold tracking-tight">
            Create more. Do less. ✨
          </span>
          <span className="text-[10px] text-[#6B7280] font-medium">© {new Date().getFullYear()} EveryPosting</span>
        </div>
      </div>

      {/* RIGHT PANEL: Form Container Side */}
      <div className="w-full lg:w-1/2 h-full max-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-white relative overflow-y-auto lg:overflow-hidden shrink-0">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-2">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF529A] flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#1A1A2E]">
              Every<span className="text-[#FF529A]">Posting</span>
            </span>
          </Link>

          <div className="ml-auto text-xs font-medium text-[#6B7280] flex items-center gap-2">
            <span>Already have an account?</span>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-[#FF529A] font-bold hover:bg-pink-100 transition-colors text-xs"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Main Form Box */}
        <div className="my-auto max-w-sm w-full mx-auto py-1">
          {/* Logo & Headline */}
          <div className="text-center mb-3">
            <div className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-xl bg-pink-50 text-[#FF529A] mb-1.5">
              <Sparkles className="w-4.5 h-4.5 fill-[#FF529A]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
              Create <span className="text-[#FF529A]">Account</span>
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5 font-medium leading-tight max-w-xs mx-auto">
              Create your account to start repurposing content in seconds.
            </p>
          </div>

          {/* Error & Info Alerts */}
          {errorMsg && (
            <div className="mb-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {googleNotice && (
            <div className="mb-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{googleNotice}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-3">
            {/* Minimal Underline Full Name Input */}
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative flex items-center bg-transparent border-b-2 border-[#E2E8F0] focus-within:border-[#FF529A] py-1 px-0.5 transition-colors">
                <User className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0 mr-2" />
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent text-xs text-[#1A1A2E] placeholder:text-[#A1A1AA] outline-none font-medium"
                />
              </div>
            </div>

            {/* Minimal Underline Email Input */}
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">Email</label>
              <div className="relative flex items-center bg-transparent border-b-2 border-[#E2E8F0] focus-within:border-[#FF529A] py-1 px-0.5 transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0 mr-2" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-xs text-[#1A1A2E] placeholder:text-[#A1A1AA] outline-none font-medium"
                />
              </div>
            </div>

            {/* Minimal Underline Password Input */}
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">Password</label>
              <div className="relative flex items-center bg-transparent border-b-2 border-[#E2E8F0] focus-within:border-[#FF529A] py-1 px-0.5 transition-colors">
                <Lock className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-xs text-[#1A1A2E] placeholder:text-[#A1A1AA] outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#A1A1AA] hover:text-[#1A1A2E] focus:outline-none ml-1.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Minimal Underline Confirm Password Input */}
            <div>
              <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">Confirm Password</label>
              <div className="relative flex items-center bg-transparent border-b-2 border-[#E2E8F0] focus-within:border-[#FF529A] py-1 px-0.5 transition-colors">
                <Lock className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0 mr-2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent text-xs text-[#1A1A2E] placeholder:text-[#A1A1AA] outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#A1A1AA] hover:text-[#1A1A2E] focus:outline-none ml-1.5"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  id="agreedToTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#FF529A] focus:ring-[#FF529A]"
                />
                <span className="text-[10px] text-[#6B7280] font-medium leading-tight">
                  I agree to the <span className="text-[#1A1A2E] font-bold">Terms</span> &{' '}
                  <span className="text-[#1A1A2E] font-bold">Privacy Policy</span>
                </span>
              </label>
            </div>

            {/* Primary Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF529A] hover:bg-[#E04385] text-white font-bold text-xs py-2.5 rounded-full shadow-md shadow-pink-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-2.5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <span className="relative bg-white px-2.5 text-[9px] font-bold text-[#A1A1AA] uppercase tracking-wider">
              OR
            </span>
          </div>

          {/* Formality Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#1A1A2E] font-semibold text-xs py-2 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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

          {/* Bottom Nav Link */}
          <div className="mt-3 text-center text-xs text-[#6B7280] font-medium">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#FF529A] font-bold hover:underline ml-0.5">
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-[#A1A1AA] font-medium mt-auto pt-1">
          Protected by Supabase Auth & Terms of Service.
        </div>
      </div>
    </div>
  );
}





