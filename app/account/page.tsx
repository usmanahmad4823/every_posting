'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, ShieldCheck, CreditCard, LogOut, ArrowRight, Key, Trash2, Edit2, Check } from 'lucide-react';
import { clearGenerationHistory, signOutUser, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/providers/user-provider';
import { PlanBadge } from '@/components/ui/plan-badge';

export default function AccountPage() {
  const { user, invalidateUser, updateUserLocally } = useUser();
  const [customKey, setCustomKey] = useState<string>('');
  const [keySaved, setKeySaved] = useState<boolean>(false);
  const [clearedMessage, setClearedMessage] = useState<boolean>(false);

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.fullName);
  const [isSavingName, setIsSavingName] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setNameInput(user.fullName);
    const savedKey = localStorage.getItem('everyposting_custom_key');
    if (savedKey) setCustomKey(savedKey);
  }, [user.fullName]);

  const handleSaveKey = () => {
    if (customKey.trim()) {
      localStorage.setItem('everyposting_custom_key', customKey.trim());
    } else {
      localStorage.removeItem('everyposting_custom_key');
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

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
    <div className="pt-20 sm:pt-28 pb-12 sm:pb-16 min-h-screen bg-[#F5F5F7]">
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
          {/* Card 1: User Profile & Subscription Tier */}
          <div className="aiigen-card p-5 sm:p-8 bg-white border border-[#E4E4E7] shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF529A] to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="bg-[#F8FAFC] border border-[#FF529A] rounded-lg px-2.5 py-1 text-sm font-bold text-[#0A0A0C] focus:outline-none"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={isSavingName}
                        className="p-1.5 rounded-lg bg-[#FF529A] text-white hover:bg-pink-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#0A0A0C]">
                        {user.fullName || 'Creator User'}
                      </h3>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-[#71717A] hover:text-[#FF529A] transition-colors p-1"
                        title="Edit Full Name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-[#71717A] font-medium">{user.email || 'usmanahmad4t12@gmail.com'}</p>
                </div>
              </div>

              <div className="flex items-center sm:justify-end">
                <PlanBadge plan={user.plan} planStatus={user.planStatus} />
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs font-bold uppercase text-[#71717A]">Monthly Generations</span>
                <div className="text-2xl font-extrabold text-[#0A0A0C] mt-1">
                  {user.generationsUsedThisMonth} / {user.plan === 'free' ? '10' : '∞'}
                </div>
                <p className="text-xs text-[#71717A] mt-1 font-medium">Resets on the 1st of every month</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs font-bold uppercase text-[#71717A]">Plan Status</span>
                <div className="text-xl font-extrabold text-[#0A0A0C] mt-1 flex items-center gap-2">
                  <PlanBadge plan={user.plan} planStatus={user.planStatus} />
                </div>
                <p className="text-xs text-[#71717A] mt-1 font-medium">Full access to Podcaster, YouTuber & Coach engines</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E4E4E7]">
              <div>
                <p className="text-xs text-[#71717A] font-medium">Want to upgrade or manage billing?</p>
              </div>
              <Link
                href="/pricing"
                className="btn-aiigen-primary text-xs font-bold px-5 py-2.5 inline-flex items-center gap-2 shadow-md shadow-pink-500/20"
              >
                <CreditCard className="w-4 h-4" />
                <span>{user.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Custom Anthropic API Key Settings */}
          <div className="aiigen-card p-5 sm:p-8 bg-white border border-[#E4E4E7] shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-[#FF529A]" />
              <h3 className="text-lg font-bold text-[#0A0A0C]">Anthropic Claude API Key</h3>
            </div>
            <p className="text-xs text-[#52525B] leading-relaxed mb-4">
              Enter your custom Anthropic Claude API key (`sk-ant-...`) to process unlimited content generations directly through your own Anthropic account.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="password"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="sk-ant-api03-xxxxxxxxxxxxxxxx"
                className="flex-1 w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0A0A0C] font-mono focus:outline-none focus:border-[#FF529A]"
              />
              <button
                onClick={handleSaveKey}
                className="w-full sm:w-auto btn-aiigen-primary text-xs font-bold px-5 py-3 shadow-md shadow-pink-500/25 shrink-0"
              >
                {keySaved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
          </div>

          {/* Card 3: Danger Zone & Actions */}
          <div className="aiigen-card p-5 sm:p-6 bg-white border border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearHistory}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>{clearedMessage ? 'History Cleared!' : 'Clear Generation History'}</span>
              </button>
            </div>

            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#0A0A0C] text-xs font-bold border border-[#E4E4E7] flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#71717A]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
