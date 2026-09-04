'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, ShieldCheck, CreditCard, LogOut, ArrowRight, Key, Trash2, Edit2, Check, Eye, EyeOff } from 'lucide-react';
import { clearGenerationHistory, signOutUser, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/providers/user-provider';
import { PlanBadge } from '@/components/ui/plan-badge';
import { CustomKeySettings } from '@/components/settings/custom-key-settings';

export default function AccountPage() {
  const { user, isLoading, invalidateUser, updateUserLocally } = useUser();
  const [clearedMessage, setClearedMessage] = useState<boolean>(false);

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.fullName);
  const [isSavingName, setIsSavingName] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user.loggedIn) {
      router.push('/sign-in');
    }
  }, [isLoading, user.loggedIn, router]);

  useEffect(() => {
    setNameInput(user.fullName);
  }, [user.fullName]);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setIsSavingName(true);

    try {
      updateUserLocally({ fullName: nameInput.trim() });

      if (isSupabaseConfigured() && user.id) {
        await supabase
          .from('users')
          .update({ full_name: nameInput.trim() })
          .eq('id', user.id);
      }

      await invalidateUser();
      setIsEditingName(false);
    } catch (e) {
      console.warn('Profile name update warning:', e);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleClearHistory = async () => {
    await clearGenerationHistory();
    setClearedMessage(true);
    setTimeout(() => setClearedMessage(false), 2000);
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/sign-in');
  };

  return (
    <div className="pt-24 sm:pt-28 pb-8 sm:pb-12 min-h-screen bg-[#F5F5F7]">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E4E4E7]">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-[#FF529A] border border-pink-200">
              Account & Billing
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0A0A0C] tracking-tight mt-1">
              Account Settings
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="btn-aiigen-primary text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1.5 shadow-md shadow-pink-500/20"
          >
            <span>Back to Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-6">
          {/* Card 1: Sleek User Profile & Membership Status */}
          <div className="aiigen-card p-4 sm:p-6 bg-white border border-[#E4E4E7] shadow-lg rounded-3xl space-y-5">
            {/* User Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#FF529A] to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-xs shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="bg-[#F8FAFC] border border-[#FF529A] rounded-lg px-2.5 py-1 text-xs font-bold text-[#0A0A0C] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSaveName}
                        disabled={isSavingName}
                        className="p-1 rounded-lg bg-[#FF529A] text-white hover:bg-pink-600 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base sm:text-lg font-extrabold text-[#0A0A0C] truncate">
                        {user.fullName || 'Creator User'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditingName(true)}
                        className="text-[#71717A] hover:text-[#FF529A] transition-colors p-0.5"
                        title="Edit Full Name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-[#71717A] font-medium truncate">{user.email || 'usmanahmad4t12@gmail.com'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <PlanBadge plan={user.plan} planStatus={user.planStatus} />
                {user.plan === 'free' && (
                  <Link
                    href="/pricing"
                    className="btn-aiigen-primary text-xs font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Upgrade</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Usage Status Bar */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#0A0A0C]">Generation Quota Usage</span>
                <span className="font-bold text-[#FF529A]">
                  {user.generationsUsedThisMonth} / {user.monthlyGenerationLimit || 3} Used
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF529A] to-purple-600 transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(100, (user.generationsUsedThisMonth / (user.monthlyGenerationLimit || 3)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#71717A] font-medium">
                <span>Billing Period Quota</span>
                <span>{Math.max(0, (user.monthlyGenerationLimit || 3) - user.generationsUsedThisMonth)} generations remaining</span>
              </div>
            </div>
          </div>

          {/* Card 2: Custom Anthropic API Key Settings */}
          <CustomKeySettings />

          {/* Card 3: Danger Zone & Actions */}
          <div className="aiigen-card p-4 sm:p-5 bg-white border border-[#E4E4E7] rounded-3xl flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClearHistory}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{clearedMessage ? 'History Cleared!' : 'Clear History'}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#0A0A0C] text-xs font-bold border border-[#E4E4E7] flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
