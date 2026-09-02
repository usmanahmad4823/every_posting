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
} from 'lucide-react';
import { NICHE_CONFIGS } from '@/lib/prompts';
import { NicheType, OutputFormat, GenerationResult, ToneStyle } from '@/lib/types';
import { getGenerationHistory, getUserProfile } from '@/lib/supabase';
import { FeedbackPrompt } from '@/components/feedback/feedback-prompt';
import { MilestoneReviewModal } from '@/components/feedback/milestone-review-modal';
import { AdvancedOutputPreview } from '@/components/studio/advanced-output-preview';

export default function DashboardPage() {
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
  const [usageCount, setUsageCount] = useState<number>(3);
  const [usageLimit] = useState<number>(10);
  const [tier, setTier] = useState<'free' | 'pro' | 'lifetime'>('free');

  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  // HCI State: Error Handling & Form Shake
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputError, setInputError] = useState<boolean>(false);
  const [shakeInput, setShakeInput] = useState<boolean>(false);

  const activeConfig = NICHE_CONFIGS[selectedNiche];

  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      // Check for payment success URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const isPaymentSuccess = urlParams.get('payment_success') === 'true';
      const successPlan = urlParams.get('plan') as 'pro' | 'lifetime' | null;

      if (isPaymentSuccess && successPlan) {
        const storedUser = localStorage.getItem('everyposting_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.tier = successPlan;
            localStorage.setItem('everyposting_user', JSON.stringify(parsed));
          } catch {}
        }
        setPaymentSuccessMsg(`Congratulations! Your ${successPlan.toUpperCase()} Plan subscription is now ACTIVE!`);
      }

      const profile = await getUserProfile();
      setUsageCount(profile.generationsUsedThisMonth);
      setTier(successPlan || profile.subscriptionTier);

      const savedKey = localStorage.getItem('everyposting_custom_key');
      if (savedKey) setCustomApiKey(savedKey);

      const pastGenerations = await getGenerationHistory();
      setHistory(pastGenerations);

      const hasSeenPrompt = localStorage.getItem('everyposting_seen_review_prompt');
      if (!profile.hasSeenReviewPrompt && !hasSeenPrompt && profile.generationsUsedThisMonth >= 5) {
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

    setInputError(false);
    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationStep('Analyzing transcript content & tone...');

    try {
      setTimeout(() => setGenerationStep('Invoking Anthropic Claude AI...'), 800);
      setTimeout(() => setGenerationStep('Formatting platform outputs...'), 1600);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          niche: selectedNiche,
          selectedFormats,
          tone: selectedTone,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setCurrentOutput(data.result.outputs);
      setCurrentGenerationId(data.result.id);
      setActiveResultTab(selectedFormats[0]);

      const newUsage = usageCount + 1;
      setUsageCount(newUsage);

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
              <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase ${
                tier === 'pro'
                  ? 'bg-[#FF529A] text-white shadow-xs'
                  : tier === 'lifetime'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-[#52525B]'
              }`}>
                {tier === 'pro' && '⚡ PRO ACTIVE'}
                {tier === 'lifetime' && '👑 LIFETIME ACTIVE'}
                {tier === 'free' && 'FREE TIER'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0A0A0C] tracking-tight">
              Content Repurposing Studio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowKeyModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-pink-50 text-[#0A0A0C] border border-[#FFC2DA] text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Key className="w-4 h-4 text-[#FF529A]" />
              <span>{customApiKey ? 'API Key Active' : 'Plug Anthropic Key'}</span>
            </button>
            <Link
              href="/pricing"
              className="btn-aiigen-primary text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 shadow-sm shadow-pink-500/25"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Upgrade Plan</span>
            </Link>
            <Link
              href="/account"
              className="btn-aiigen-secondary text-xs font-semibold px-3.5 py-2.5 border-[#FFC2DA]"
            >
              Settings
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

                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="sk-ant-api03-xxxxxxxxxxxxxxxx"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0A0A0C] focus:outline-none focus:border-[#FF529A] font-mono mb-4"
                />

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR: Niche Selector & Usage & History */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Niche Selector Box */}
            <div className="aiigen-card p-5 bg-white border border-[#E4E4E7]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF529A]" />
                Select Niche Profile
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => handleNicheSelect('podcaster')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedNiche === 'podcaster'
                      ? 'bg-pink-50 border-[#FF529A] text-[#0A0A0C] font-bold shadow-sm'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#FF529A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-100 text-[#FF529A]">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0A0A0C]">Podcasters</div>
                      <div className="text-[11px] text-[#64748B] font-normal">Show Notes & Tweet Threads</div>
                    </div>
                  </div>
                  {selectedNiche === 'podcaster' && <ChevronRight className="w-4 h-4 text-[#FF529A]" />}
                </button>

                <button
                  onClick={() => handleNicheSelect('youtuber')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedNiche === 'youtuber'
                      ? 'bg-pink-50 border-[#FF529A] text-[#0A0A0C] font-bold shadow-sm'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#FF529A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-100 text-[#FF529A]">
                      <PlaySquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0A0A0C]">YouTube Creators</div>
                      <div className="text-[11px] text-[#64748B] font-normal">Twitter Threads & Blog Posts</div>
                    </div>
                  </div>
                  {selectedNiche === 'youtuber' && <ChevronRight className="w-4 h-4 text-[#FF529A]" />}
                </button>

                <button
                  onClick={() => handleNicheSelect('coach')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedNiche === 'coach'
                      ? 'bg-pink-50 border-[#FF529A] text-[#0A0A0C] font-bold shadow-sm'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#FF529A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-100 text-[#FF529A]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0A0A0C]">Coaches & Consultants</div>
                      <div className="text-[11px] text-[#64748B] font-normal">LinkedIn Posts & Emails</div>
                    </div>
                  </div>
                  {selectedNiche === 'coach' && <ChevronRight className="w-4 h-4 text-[#FF529A]" />}
                </button>
              </div>
            </div>

            {/* 2. Usage Meter Box */}
            <div className="aiigen-card p-5 bg-white border border-[#E4E4E7]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                  Monthly Generation Usage
                </span>
                <span className="text-xs font-bold text-[#0A0A0C] uppercase bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7]">
                  {customApiKey ? 'Custom API Key' : `${tier} plan`}
                </span>
              </div>

              <div className="mt-3 mb-2 flex items-center justify-between text-xs font-medium">
                <span className="text-[#334155]">
                  <strong className="text-[#0A0A0C]">{customApiKey ? '0' : usageCount}</strong> /{' '}
                  {customApiKey || tier !== 'free' ? '∞' : usageLimit} used this month
                </span>
                <span className="text-[#FF529A] font-bold">
                  {customApiKey || tier !== 'free' ? 'Unlimited' : `${usageLimit - usageCount} remaining`}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden mb-3">
                <div
                  className="h-full bg-[#FF529A] transition-all duration-300"
                  style={{
                    width: `${customApiKey || tier !== 'free' ? 100 : Math.min(100, (usageCount / usageLimit) * 100)}%`,
                  }}
                />
              </div>

              {!customApiKey && tier === 'free' && usageCount >= 8 && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 mb-3 font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>Approaching limit. Upgrade or plug your custom Anthropic API key.</span>
                </div>
              )}

              <Link
                href="/pricing"
                className="w-full text-center py-2 text-xs font-bold text-[#FF529A] hover:text-pink-800 bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-200 block transition-colors"
              >
                Upgrade to Pro →
              </Link>
            </div>

            {/* 3. Generation History List & Feedback Trigger Link */}
            <div className="aiigen-card p-5 bg-white border border-[#E4E4E7]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF529A]" />
                  Generation History ({history.length})
                </h3>

                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="text-xs font-bold text-[#FF529A] hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Feedback</span>
                </button>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#94A3B8] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] font-medium">
                  No generations saved yet. Paste a transcript to create your first content set!
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
            </div>
          </div>

          {/* MAIN PANEL: Input & Format Selector & Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Input & Formats Container */}
            <div className="aiigen-card p-6 sm:p-8 bg-white border border-[#E4E4E7] shadow-xl">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="icon-box-black bg-[#FF529A] p-2 rounded-xl">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-[#0A0A0C]">
                    Paste Transcript ({activeConfig.title})
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadSample}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-50 text-[#FF529A] hover:bg-pink-100 border border-pink-200 flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Insert Demo Sample</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#0A0A0C] border border-[#E4E4E7] flex items-center gap-1.5 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload .txt / .srt</span>
                    <input type="file" accept=".txt,.srt,.vtt,.md" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Tone Selection Pills */}
              <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-[#71717A] uppercase tracking-wider shrink-0">Tone:</span>
                {(['energetic', 'professional', 'viral', 'storytelling'] as ToneStyle[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTone(t)}
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all shrink-0 ${
                      selectedTone === t
                        ? 'bg-[#FF529A] text-white shadow-sm'
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
                  rows={8}
                  className={`w-full rounded-2xl p-4 text-sm text-[#0A0A0C] placeholder:text-[#94A3B8] focus:outline-none transition-all font-sans leading-relaxed resize-y font-medium ${
                    inputError
                      ? 'bg-rose-50/50 border-2 border-rose-500 focus:ring-2 focus:ring-rose-500'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF529A] focus:ring-1 focus:ring-[#FF529A]'
                  }`}
                />
                <div className="absolute bottom-3 right-4 text-[11px] text-[#94A3B8] font-mono pointer-events-none">
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
                    className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 font-medium shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                    {inputError && (
                      <button
                        onClick={handleLoadSample}
                        className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-300 transition-colors shrink-0"
                      >
                        Auto-fill Demo
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Format Checkbox Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
                  Select Desired Output Formats:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeConfig.supportedFormats.map((format) => {
                    const isChecked = selectedFormats.includes(format.id);
                    return (
                      <div
                        key={format.id}
                        onClick={() => toggleFormat(format.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                          isChecked
                            ? 'bg-pink-50 border-[#FF529A] text-[#0A0A0C] font-semibold shadow-sm'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#0A0A0C]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-[#FF529A] border-[#FF529A] text-white' : 'border-[#CBD5E1]'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0A0A0C]">{format.label}</div>
                          <div className="text-[10px] text-[#64748B] font-normal">{format.description}</div>
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
                className="w-full btn-aiigen-primary font-extrabold text-base py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-pink-500/25"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{generationStep}</span>
                  </div>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-white" />
                    <span>Generate AI Content ({selectedFormats.length} Formats)</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
