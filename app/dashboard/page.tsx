'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  PlaySquare,
  GraduationCap,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  RotateCcw,
  Clock,
  Upload,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Key,
  Check,
  X,
  MessageSquare,
  AlertTriangle,
  Eye,
  EyeOff,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { NICHE_CONFIGS } from '@/lib/prompts';
import { NicheType, OutputFormat, GenerationResult, ToneStyle } from '@/lib/types';
import { getGenerationHistory } from '@/lib/supabase';
import { FeedbackPrompt } from '@/components/feedback/feedback-prompt';
import { MilestoneReviewModal } from '@/components/feedback/milestone-review-modal';
import { AdvancedOutputPreview } from '@/components/studio/advanced-output-preview';
import { useUser } from '@/components/providers/user-provider';
import { PlanBadge } from '@/components/ui/plan-badge';

export default function DashboardPage() {
  const { user, invalidateUser, updateUserLocally } = useUser();

  const usageCount = user.generationsUsedThisMonth;
  const usageLimit = user.monthlyGenerationLimit;
  const tier = user.plan;

  const [selectedNiche, setSelectedNiche] = useState<NicheType>('podcaster');
  const [transcript, setTranscript] = useState<string>('');
  const [selectedFormats, setSelectedFormats] = useState<OutputFormat[]>([
    'show_notes',
    'twitter_thread',
    'linkedin_post',
  ]);
  const [selectedTone, setSelectedTone] = useState<ToneStyle>('energetic');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [activeResultTab, setActiveResultTab] = useState<OutputFormat | null>(null);
  const [currentOutput, setCurrentOutput] = useState<Partial<Record<OutputFormat, string>> | null>(null);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | undefined>(undefined);
  const [history, setHistory] = useState<GenerationResult[]>([]);

  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [showKeyText, setShowKeyText] = useState<boolean>(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // HCI State: Error Handling & Form Shake
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputError, setInputError] = useState<boolean>(false);
  const [shakeInput, setShakeInput] = useState<boolean>(false);

  const activeConfig = NICHE_CONFIGS[selectedNiche];

  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);

  useEffect(() => {
    async function loadUserData() {
      // Check for payment success URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const isPaymentSuccess = urlParams.get('payment_success') === 'true';
      const successPlan = urlParams.get('plan') as any;

      if (isPaymentSuccess && successPlan) {
        // Optimistically update local user state instantly
        updateUserLocally({ plan: successPlan, planStatus: 'active' });
        // Invalidate TanStack query to fetch server source of truth
        await invalidateUser();

        setPaymentSuccessMsg(`🎉 You're now on the ${successPlan.toUpperCase()} plan! Welcome aboard!`);
      }

      const savedKey = localStorage.getItem('everyposting_custom_key');
      if (savedKey) setCustomApiKey(savedKey);

      const pastGenerations = await getGenerationHistory();
      setHistory(pastGenerations);

      const hasSeenPrompt = localStorage.getItem('everyposting_seen_review_prompt');
      if (!user.hasSeenReviewPrompt && !hasSeenPrompt && user.generationsUsedThisMonth >= 5) {
        setShowMilestoneModal(true);
      }
    }
    loadUserData();
  }, []);

  const handleCloseMilestoneModal = () => {
    setShowMilestoneModal(false);
    localStorage.setItem('everyposting_seen_review_prompt', 'true');
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('everyposting_custom_key', customApiKey);
    setShowKeyModal(false);
  };

  const handleNicheSelect = (niche: NicheType) => {
    setSelectedNiche(niche);
    const validFormats = NICHE_CONFIGS[niche].supportedFormats.map((f) => f.id);
    const updated = selectedFormats.filter((f) => validFormats.includes(f));
    if (updated.length === 0) {
      setSelectedFormats([validFormats[0]]);
    } else {
      setSelectedFormats(updated);
    }
  };

  const toggleFormat = (formatId: OutputFormat) => {
    if (selectedFormats.includes(formatId)) {
      if (selectedFormats.length === 1) return;
      setSelectedFormats(selectedFormats.filter((f) => f !== formatId));
    } else {
      setSelectedFormats([...selectedFormats, formatId]);
    }
  };

  const handleLoadSample = () => {
    setTranscript(activeConfig.sampleTranscript);
    setErrorMessage(null);
    setInputError(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTranscript(text || '');
      setErrorMessage(null);
      setInputError(false);
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!transcript || !transcript.trim()) {
      setInputError(true);
      setShakeInput(true);
      setErrorMessage('Transcript field is empty! Please paste your transcript or click "Insert Demo Sample".');
      setTimeout(() => setShakeInput(false), 500);
      return;
    }

    // Generation Limit Check
    const limit = user.monthlyGenerationLimit || 5;
    const isLimitReached = user.generationsUsedThisMonth >= limit && !customApiKey;

    if (isLimitReached) {
      setErrorMessage(`Generation limit reached (${user.generationsUsedThisMonth}/${limit} Used). Upgrade to Pro or enter your custom Anthropic API key to continue.`);
      setShowUpgradeModal(true);
      return;
    }

    setInputError(false);
    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationStep('Analyzing transcript content & tone...');

    try {
      setTimeout(() => setGenerationStep('Invoking Anthropic Claude AI...'), 800);
      setTimeout(() => setGenerationStep('Formatting platform outputs...'), 1600);

      // Get session token if logged in with Supabase
      let authToken: string | undefined;
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: sessionData } = await supabase.auth.getSession();
        authToken = sessionData.session?.access_token;
      } catch {}

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          transcript,
          niche: selectedNiche,
          selectedFormats,
          tone: selectedTone,
          customApiKey: customApiKey || undefined,
          userId: user.id || 'guest-user',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setShowUpgradeModal(true);
        }
        throw new Error(data.error || 'Failed to generate content');
      }

      setCurrentOutput(data.result.outputs);
      setCurrentGenerationId(data.result.id);
      setActiveResultTab(selectedFormats[0]);

      // Update local state and invalidate cache so usage counter persists
      const newUsage = data.generationsUsedThisMonth ?? (usageCount + 1);
      updateUserLocally({ generationsUsedThisMonth: newUsage });
      await invalidateUser();

      const hasSeenPrompt = localStorage.getItem('everyposting_seen_review_prompt');
      if (newUsage === 5 && !hasSeenPrompt) {
        setTimeout(() => setShowMilestoneModal(true), 1500);
      }

      const updatedHistory = await getGenerationHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAll = () => {
    if (!currentOutput) return;
    const compiled = Object.entries(currentOutput)
      .map(([fmt, text]) => `=== ${fmt.toUpperCase().replace('_', ' ')} ===\n\n${text}\n\n`)
      .join('\n');
    navigator.clipboard.writeText(compiled);
    setCopiedAll(true);
    triggerToast('Copied all outputs to clipboard! 📋');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadExport = (type: 'md' | 'txt' | 'json') => {
    if (!currentOutput) return;
    let content = '';
    let filename = `everyposting-${selectedNiche}-${Date.now()}`;

    if (type === 'json') {
      content = JSON.stringify(currentOutput, null, 2);
      filename += '.json';
    } else if (type === 'md') {
      content =
        `# Repurposed Content (${selectedNiche.toUpperCase()})\n\n` +
        Object.entries(currentOutput)
          .map(([fmt, text]) => `## ${fmt.replace('_', ' ').toUpperCase()}\n\n${text}\n`)
          .join('\n---\n\n');
      filename += '.md';
    } else {
      content = Object.entries(currentOutput)
        .map(([fmt, text]) => `[ ${fmt.replace('_', ' ').toUpperCase()} ]\n\n${text}\n`)
        .join('\n\n');
      filename += '.txt';
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported as .${type.toUpperCase()} file! 📥`);
  };

  const handleSelectHistoryItem = (item: GenerationResult) => {
    setSelectedNiche(item.niche);
    setCurrentOutput(item.outputs);
    setCurrentGenerationId(item.id);
    const availableFormats = Object.keys(item.outputs) as OutputFormat[];
    if (availableFormats.length > 0) {
      setActiveResultTab(availableFormats[0]);
    }
  };

  return (
    <div className="pt-20 sm:pt-28 pb-10 sm:pb-16 min-h-screen bg-[#F5F5F7]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Milestone Review Modal */}
        <MilestoneReviewModal isOpen={showMilestoneModal} onClose={handleCloseMilestoneModal} />

        {/* Manual Feedback Trigger Modal */}
        <MilestoneReviewModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />

        {paymentSuccessMsg && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-bounce">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
              <span>{paymentSuccessMsg}</span>
            </div>
            <button
              onClick={() => setPaymentSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 font-extrabold text-xs px-2 py-1 rounded bg-white/60"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header Title & Key Modal Trigger */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E4E4E7]">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-pink-50 text-[#FF529A] border border-pink-200">
                Studio Dashboard
              </span>
              <span className="text-[10px] sm:text-xs text-[#71717A] font-medium">| Repurpose AI v2.0</span>
              <PlanBadge plan={user.plan} planStatus={user.planStatus} />
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0A0A0C] tracking-tight">
              Content Repurposing Studio
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setShowKeyModal(true)}
              className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white hover:bg-pink-50 text-[#0A0A0C] border border-[#FFC2DA] text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap active:scale-95 shrink-0"
            >
              <Key className="w-3.5 h-3.5 text-[#FF529A] shrink-0" />
              <span>{customApiKey ? 'API Active' : 'Plug Key Anthropic'}</span>
            </button>

            <Link
              href="/account"
              className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0A0A0C] border border-[#E4E4E7] text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95"
            >
              <Settings className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Custom API Key Settings Modal */}
        <AnimatePresence>
          {showKeyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0A0A0C]/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#FFC2DA] shadow-2xl relative"
              >
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="absolute top-4 right-4 text-[#71717A] hover:text-[#0A0A0C]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-5 h-5 text-[#FF529A]" />
                  <h3 className="text-lg font-bold text-[#0A0A0C]">Custom Anthropic API Key</h3>
                </div>
                <p className="text-xs text-[#52525B] leading-relaxed mb-4">
                  Bring your own Anthropic Claude API Key (`sk-ant-...`) for unlimited direct generations without using free platform credits.
                </p>

                <div className="relative mb-4">
                  <input
                    type={showKeyText ? 'text' : 'password'}
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="sk-ant-api03-xxxxxxxxxxxxxxxx"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 pr-10 text-xs text-[#0A0A0C] focus:outline-none focus:border-[#FF529A] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(!showKeyText)}
                    className="absolute right-3 top-3 text-[#71717A] hover:text-[#0A0A0C]"
                    title={showKeyText ? 'Hide API key' : 'Show API key'}
                  >
                    {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setCustomApiKey('');
                      localStorage.removeItem('everyposting_custom_key');
                      setShowKeyModal(false);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Clear Key
                  </button>
                  <button
                    onClick={handleSaveApiKey}
                    className="btn-aiigen-primary px-5 py-2.5 text-xs font-bold shadow-md shadow-pink-500/25"
                  >
                    Save Key
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monthly Limit Reached Upgrade Modal */}
        <AnimatePresence>
          {showUpgradeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0A0A0C]/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#FFC2DA] shadow-2xl relative space-y-4"
              >
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute top-4 right-4 text-[#71717A] hover:text-[#0A0A0C]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF529A]">
                  <Zap className="w-6 h-6 fill-[#FF529A]" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#0A0A0C]">Generation Limit Reached!</h3>
                  <p className="text-xs text-[#52525B] leading-relaxed mt-1">
                    You have used <strong>{user.generationsUsedThisMonth} / {user.monthlyGenerationLimit || 5} generations</strong>. Upgrade to EveryPosting Pro to continue generating or plug in your personal Anthropic Claude API key!
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0A0A0C]">
                    <span>Quota Usage</span>
                    <span className="text-rose-600 font-extrabold">{user.generationsUsedThisMonth} / {user.monthlyGenerationLimit || 5} Used</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="w-full h-full bg-rose-500 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowUpgradeModal(false);
                      setShowKeyModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#0A0A0C] border border-[#E2E8F0] text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                  >
                    <Key className="w-3.5 h-3.5 text-[#FF529A]" />
                    <span>Plug API Key</span>
                  </button>

                  <Link
                    href="/pricing"
                    onClick={() => setShowUpgradeModal(false)}
                    className="btn-aiigen-primary text-xs font-extrabold px-5 py-2.5 flex items-center gap-1.5 shadow-lg shadow-pink-500/25"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Upgrade to Pro →</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-8">
          {/* LEFT SIDEBAR: Niche Selector & Usage & History */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* 1. Niche Selector Box - Sleek & Minimal Segmented Switcher */}
            <div className="aiigen-card p-3 sm:p-4 bg-white border border-[#E4E4E7]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#FF529A]" />
                  Select Niche Profile:
                </h3>
                <span className="text-[10px] font-extrabold text-[#FF529A] bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200 capitalize">
                  {selectedNiche === 'podcaster' ? 'Podcasters' : selectedNiche === 'youtuber' ? 'YouTube' : 'Coaches'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <button
                  onClick={() => handleNicheSelect('podcaster')}
                  className={`py-2 px-1.5 rounded-lg text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    selectedNiche === 'podcaster'
                      ? 'bg-white text-[#0A0A0C] font-extrabold shadow-xs border border-[#FFC2DA] ring-1 ring-[#FF529A]/20'
                      : 'text-[#64748B] hover:text-[#0A0A0C] font-semibold'
                  }`}
                >
                  <Mic className={`w-3.5 h-3.5 shrink-0 ${selectedNiche === 'podcaster' ? 'text-[#FF529A]' : 'text-[#94A3B8]'}`} />
                  <span className="text-[10px] sm:text-xs truncate">Podcasters</span>
                </button>

                <button
                  onClick={() => handleNicheSelect('youtuber')}
                  className={`py-2 px-1.5 rounded-lg text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    selectedNiche === 'youtuber'
                      ? 'bg-white text-[#0A0A0C] font-extrabold shadow-xs border border-[#FFC2DA] ring-1 ring-[#FF529A]/20'
                      : 'text-[#64748B] hover:text-[#0A0A0C] font-semibold'
                  }`}
                >
                  <PlaySquare className={`w-3.5 h-3.5 shrink-0 ${selectedNiche === 'youtuber' ? 'text-[#FF529A]' : 'text-[#94A3B8]'}`} />
                  <span className="text-[10px] sm:text-xs truncate">YouTube</span>
                </button>

                <button
                  onClick={() => handleNicheSelect('coach')}
                  className={`py-2 px-1.5 rounded-lg text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    selectedNiche === 'coach'
                      ? 'bg-white text-[#0A0A0C] font-extrabold shadow-xs border border-[#FFC2DA] ring-1 ring-[#FF529A]/20'
                      : 'text-[#64748B] hover:text-[#0A0A0C] font-semibold'
                  }`}
                >
                  <GraduationCap className={`w-3.5 h-3.5 shrink-0 ${selectedNiche === 'coach' ? 'text-[#FF529A]' : 'text-[#94A3B8]'}`} />
                  <span className="text-[10px] sm:text-xs truncate">Coaches</span>
                </button>
              </div>
            </div>

            {/* 2. Usage Meter Box - Sleek & Ultra-Minimal */}
            <div className="aiigen-card p-3 sm:p-4 bg-white border border-[#E4E4E7]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] sm:text-xs font-extrabold text-[#0A0A0C]">
                    Generation Quota:
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#FF529A]">
                    {customApiKey ? '0' : usageCount}/{customApiKey ? '∞' : (usageLimit || 5)}
                  </span>
                  <span className="text-[10px] text-[#71717A] hidden sm:inline">
                    ({customApiKey ? 'Unlimited' : `${Math.max(0, (usageLimit || 5) - usageCount)} remaining`})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase bg-slate-100 text-[#71717A] px-2 py-0.5 rounded-full border border-slate-200">
                    {customApiKey ? 'Custom Key' : `${tier} plan`}
                  </span>
                  {tier === 'free' && !customApiKey && (
                    <Link
                      href="/pricing"
                      className="text-[10px] sm:text-xs font-bold text-[#FF529A] hover:underline"
                    >
                      Upgrade →
                    </Link>
                  )}
                </div>
              </div>

              {/* Sleek Minimal Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    !customApiKey && usageCount >= (usageLimit || 5)
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-[#FF529A] to-purple-600'
                  }`}
                  style={{
                    width: `${customApiKey ? 100 : Math.min(100, (usageCount / (usageLimit || 5)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* 3. Generation History List (Desktop View Only) */}
            <div className="hidden lg:block">
              <div className="aiigen-card p-4 sm:p-5 bg-white border border-[#E4E4E7]">
                <div
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="flex items-center justify-between cursor-pointer select-none py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-pink-50 text-[#FF529A]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0A0A0C]">
                      Generation History ({history.length})
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFeedbackModal(true);
                      }}
                      className="text-[10px] sm:text-xs font-bold text-[#FF529A] hover:underline flex items-center gap-1 whitespace-nowrap shrink-0 px-1.5 py-0.5 rounded-lg bg-pink-50/80 border border-pink-200"
                    >
                      <MessageSquare className="w-3 h-3 text-[#FF529A] shrink-0" />
                      <span>Feedback</span>
                    </button>

                    <div className="p-1 rounded-lg hover:bg-slate-100 text-[#71717A] group-hover:text-[#FF529A] transition-colors shrink-0">
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isHistoryExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isHistoryExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pt-3 border-t border-[#E4E4E7] mt-3"
                    >
                      {history.length === 0 ? (
                        <div className="text-center py-6 px-4 bg-[#F8FAFC] rounded-2xl border-2 border-dashed border-[#E2E8F0] flex flex-col items-center">
                          <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF529A] mb-2 border border-pink-100">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs font-bold text-[#0A0A0C]">No generations saved yet</h4>
                          <p className="text-[11px] text-[#71717A] mt-0.5 mb-3 leading-relaxed">
                            Paste a transcript above or test with demo data to generate your first social content batch!
                          </p>
                          <button
                            onClick={handleLoadSample}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#FF529A] hover:bg-pink-50 border border-pink-200 flex items-center gap-1.5 shadow-2xs transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Insert Demo Sample →</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                          {history.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectHistoryItem(item)}
                              className="w-full text-left p-3 rounded-xl bg-[#F8FAFC] hover:bg-pink-50 border border-[#E2E8F0] hover:border-[#FF529A] transition-colors group"
                            >
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-bold text-[#0A0A0C] capitalize group-hover:text-[#FF529A]">
                                  {item.niche}
                                </span>
                                <span className="text-[10px] text-[#94A3B8]">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B] line-clamp-1 italic font-mono">
                                &quot;{item.transcriptSnippet}&quot;
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* MAIN PANEL: Input & Format Selector & Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Input & Formats Container */}
            <div className="aiigen-card p-6 sm:p-8 bg-white border border-[#E4E4E7] shadow-xl">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="icon-box-black bg-[#FF529A] p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h2 className="text-sm sm:text-lg font-extrabold text-[#0A0A0C] truncate">
                    Paste Transcript ({activeConfig.title})
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={handleLoadSample}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold bg-pink-50 text-[#FF529A] hover:bg-pink-100 border border-pink-200 flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap shadow-2xs"
                  >
                    <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>Insert Demo Sample</span>
                  </button>

                  <label className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#0A0A0C] border border-[#E4E4E7] flex items-center gap-1 sm:gap-1.5 cursor-pointer transition-colors whitespace-nowrap shadow-2xs">
                    <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>Upload .txt / .srt</span>
                    <input type="file" accept=".txt,.srt,.vtt,.md" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Tone Selection Pills */}
              <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] sm:text-xs font-bold text-[#71717A] uppercase tracking-wider shrink-0">Tone:</span>
                {(['energetic', 'professional', 'viral', 'storytelling'] as ToneStyle[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTone(t)}
                    className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold capitalize transition-all shrink-0 ${
                      selectedTone === t
                        ? 'bg-[#FF529A] text-white shadow-xs'
                        : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0A0A0C] border border-[#E2E8F0]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Textarea with HCI Error Highlight & Shake Animation */}
              <motion.div
                animate={shakeInput ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className="relative mb-4"
              >
                <textarea
                  value={transcript}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    if (e.target.value.trim()) {
                      setInputError(false);
                      setErrorMessage(null);
                    }
                  }}
                  placeholder={`Paste your episode audio transcript, YouTube script, or client call notes here... Or click "Insert Demo Sample" above to test immediately!`}
                  rows={7}
                  className={`w-full rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-[#0A0A0C] placeholder:text-[#94A3B8] focus:outline-none transition-all font-sans leading-relaxed resize-y font-medium ${
                    inputError
                      ? 'bg-rose-50/50 border-2 border-rose-500 focus:ring-2 focus:ring-rose-500'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF529A] focus:ring-1 focus:ring-[#FF529A]'
                  }`}
                />
                <div className="absolute bottom-3 right-4 text-[10px] sm:text-[11px] text-[#94A3B8] font-mono pointer-events-none">
                  {transcript ? `${transcript.split(/\s+/).filter(Boolean).length} words` : '0 words'}
                </div>
              </motion.div>

              {/* HCI Error Banner with 1-Click Recovery Action */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 font-medium shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                    {inputError && (
                      <button
                        onClick={handleLoadSample}
                        className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 font-bold text-[10px] sm:text-xs rounded-lg border border-rose-300 transition-colors shrink-0"
                      >
                        Auto-fill Demo
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Format Checkbox Selector - Minimal & 100% Understandable */}
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#71717A]">
                    Select Output Formats:
                  </label>
                  <span className="text-[10px] font-extrabold text-[#FF529A] bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                    {selectedFormats.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {activeConfig.supportedFormats.map((format) => {
                    const isChecked = selectedFormats.includes(format.id);
                    return (
                      <div
                        key={format.id}
                        onClick={() => toggleFormat(format.id)}
                        className={`p-2 sm:p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition-all group ${
                          isChecked
                            ? 'bg-pink-50/90 border-[#FF529A] text-[#0A0A0C] font-extrabold shadow-2xs ring-1 ring-[#FF529A]/30'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#0A0A0C] hover:bg-white'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                            isChecked ? 'bg-[#FF529A] border-[#FF529A] text-white scale-105 shadow-2xs' : 'border-[#CBD5E1] bg-white group-hover:border-[#FF529A]'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#FF529A]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] sm:text-xs font-extrabold text-[#0A0A0C] truncate leading-snug">
                            {format.label}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-[#64748B] font-normal truncate hidden sm:block">
                            {format.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Generate Button (#FF529A Pink) */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full relative group overflow-hidden btn-aiigen-primary font-extrabold text-xs sm:text-sm py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-2.5 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="text-xs sm:text-sm">{generationStep}</span>
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white group-hover:rotate-12 transition-transform shrink-0" />
                    <span className="truncate">Generate AI Content ({selectedFormats.length} Formats)</span>
                    <Sparkles className="w-3.5 h-3.5 text-white/80 group-hover:scale-125 transition-transform shrink-0" />
                  </>
                )}
              </button>
            </div>

            {/* ADVANCED RESULTS PANEL WITH LIVE SOCIAL CARD SIMULATOR */}
            <AnimatePresence>
              {currentOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="aiigen-card p-6 sm:p-8 bg-white border border-pink-200 shadow-2xl space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-lg font-bold text-[#0A0A0C]">Generated Content Output</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleCopyAll}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-50 text-[#FF529A] hover:bg-pink-100 border border-pink-200 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAll ? 'Copied All!' : 'Copy All'}</span>
                      </button>

                      <div className="flex items-center gap-1 bg-[#F4F4F5] p-1 rounded-xl border border-[#E4E4E7]">
                        <button
                          onClick={() => handleDownloadExport('md')}
                          className="px-2 py-1 text-[11px] font-bold text-[#0A0A0C] hover:bg-white rounded transition-colors"
                          title="Download Markdown"
                        >
                          .MD
                        </button>
                        <button
                          onClick={() => handleDownloadExport('txt')}
                          className="px-2 py-1 text-[11px] font-bold text-[#0A0A0C] hover:bg-white rounded transition-colors"
                          title="Download Plain Text"
                        >
                          .TXT
                        </button>
                        <button
                          onClick={() => handleDownloadExport('json')}
                          className="px-2 py-1 text-[11px] font-bold text-[#0A0A0C] hover:bg-white rounded transition-colors"
                          title="Download JSON"
                        >
                          .JSON
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Format Result Tabs */}
                  <div className="flex flex-wrap gap-2 pb-2 border-b border-[#E2E8F0]">
                    {Object.keys(currentOutput).map((formatKey) => {
                      const fmt = formatKey as OutputFormat;
                      const label =
                        activeConfig.supportedFormats.find((f) => f.id === fmt)?.label ||
                        fmt.replace('_', ' ').toUpperCase();
                      const isActive = activeResultTab === fmt;

                      return (
                        <button
                          key={fmt}
                          onClick={() => setActiveResultTab(fmt)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-[#FF529A] text-white shadow-md shadow-pink-500/20'
                              : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0A0A0C] border border-[#E2E8F0]'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Advanced Output Preview Card Component */}
                  {activeResultTab && currentOutput[activeResultTab] ? (
                    <AdvancedOutputPreview
                      niche={selectedNiche}
                      outputFormat={activeResultTab}
                      content={currentOutput[activeResultTab]!}
                      onContentChange={(updated) => {
                        setCurrentOutput({ ...currentOutput, [activeResultTab]: updated });
                      }}
                    />
                  ) : (
                    <div className="text-center py-10 text-[#94A3B8] text-sm font-medium">
                      Select an output format tab above to view generated content.
                    </div>
                  )}

                  {/* Per-Generation Micro-Feedback Prompt */}
                  <FeedbackPrompt generationId={currentGenerationId} />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Generation History List (Mobile View - Foldable & Positioned at the End of Screen) */}
            <div className="block lg:hidden pt-4 border-t border-[#E4E4E7] mt-8">
              <div className="aiigen-card p-4 sm:p-5 bg-white border border-[#E4E4E7]">
                <div
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="flex items-center justify-between cursor-pointer select-none py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-pink-50 text-[#FF529A]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0A0A0C]">
                      Generation History ({history.length})
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFeedbackModal(true);
                      }}
                      className="text-[10px] sm:text-xs font-bold text-[#FF529A] hover:underline flex items-center gap-1 whitespace-nowrap shrink-0 px-1.5 py-0.5 rounded-lg bg-pink-50/80 border border-pink-200"
                    >
                      <MessageSquare className="w-3 h-3 text-[#FF529A] shrink-0" />
                      <span>Feedback</span>
                    </button>

                    <div className="p-1 rounded-lg hover:bg-slate-100 text-[#71717A] group-hover:text-[#FF529A] transition-colors shrink-0">
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isHistoryExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isHistoryExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pt-3 border-t border-[#E4E4E7] mt-3"
                    >
                      {history.length === 0 ? (
                        <div className="text-center py-6 px-4 bg-[#F8FAFC] rounded-2xl border-2 border-dashed border-[#E2E8F0] flex flex-col items-center">
                          <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF529A] mb-2 border border-pink-100">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs font-bold text-[#0A0A0C]">No generations saved yet</h4>
                          <p className="text-[11px] text-[#71717A] mt-0.5 mb-3 leading-relaxed">
                            Paste a transcript above or test with demo data to generate your first social content batch!
                          </p>
                          <button
                            onClick={handleLoadSample}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#FF529A] hover:bg-pink-50 border border-pink-200 flex items-center gap-1.5 shadow-2xs transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Insert Demo Sample →</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                          {history.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectHistoryItem(item)}
                              className="w-full text-left p-3 rounded-xl bg-[#F8FAFC] hover:bg-pink-50 border border-[#E2E8F0] hover:border-[#FF529A] transition-colors group"
                            >
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-bold text-[#0A0A0C] capitalize group-hover:text-[#FF529A]">
                                  {item.niche}
                                </span>
                                <span className="text-[10px] text-[#94A3B8]">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B] line-clamp-1 italic font-mono">
                                &quot;{item.transcriptSnippet}&quot;
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Popup Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0A0A0C] text-white px-4 py-3 rounded-2xl border border-[#FF529A]/40 shadow-2xl flex items-center gap-2.5 text-xs font-bold pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-[#FF529A]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Generation Action Bar */}
      {transcript.trim().length > 0 && !isGenerating && (
        <div className="block sm:hidden fixed bottom-0 left-0 right-0 p-2.5 bg-white/95 backdrop-blur-md border-t border-[#FFC2DA] z-40 shadow-2xl">
          <button
            onClick={handleGenerate}
            className="w-full btn-aiigen-primary font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Generate AI Content ({selectedFormats.length} Formats)</span>
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>
      )}
    </div>
  );
}
