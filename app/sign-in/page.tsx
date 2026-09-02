'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, User, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInUser } from '@/lib/supabase';

import { useUser } from '@/components/providers/user-provider';

export default function SignInPage() {
  const { invalidateUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await signInUser(email, password);

    if (res.success) {
      await invalidateUser();
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#F5F5F7] flex items-center justify-center relative overflow-hidden bg-aiigen-dots">
      <div className="max-w-md w-full px-4 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#FF529A] flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#0A0A0C]">
              Every<span className="text-[#FF529A]">Posting</span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-[#0A0A0C] tracking-tight">Welcome Back</h1>
          <p className="text-xs text-[#71717A] mt-1 font-medium">Sign in to your creator studio account</p>
        </div>

        <div className="aiigen-card p-6 sm:p-8 bg-white border border-[#E4E4E7] shadow-xl">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usman@everyposting.co"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#0A0A0C] focus:outline-none focus:border-[#FF529A] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#0A0A0C] focus:outline-none focus:border-[#FF529A] font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-aiigen-primary font-extrabold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 mt-2"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <User className="w-4 h-4 text-white" />
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E4E4E7] text-center text-xs text-[#71717A] font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#FF529A] font-bold hover:underline">
              Create a free account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
