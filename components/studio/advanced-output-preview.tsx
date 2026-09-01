'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  CheckCircle2,
  ExternalLink,
  Edit3,
  MessageCircle,
  Repeat2,
  Heart,
  ThumbsUp,
  Bookmark,
} from 'lucide-react';
import { OutputFormat, NicheType } from '@/lib/types';
import { useSparkleBurst } from '@/components/ui/sparkle-burst';

interface AdvancedOutputPreviewProps {
  niche: NicheType;
  outputFormat: OutputFormat;
  content: string;
  onContentChange?: (updatedContent: string) => void;
  readOnly?: boolean;
}

export function AdvancedOutputPreview({
  niche,
  outputFormat,
  content,
  onContentChange,
  readOnly = false,
}: AdvancedOutputPreviewProps) {
  const [editedText, setEditedText] = useState<string>(content);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activePlatformPreview, setActivePlatformPreview] = useState<'twitter' | 'linkedin' | 'instagram' | 'article'>(
    outputFormat === 'twitter_thread'
      ? 'twitter'
      : outputFormat === 'linkedin_post'
      ? 'linkedin'
      : outputFormat === 'quote_graphics'
      ? 'instagram'
      : 'article'
  );

  const { triggerBurst, SparkleContainer } = useSparkleBurst();

  const handleTextChange = (text: string) => {
    setEditedText(text);
    onContentChange?.(text);
  };

  const handleCopy = (textToCopy: string, label: string, e: React.MouseEvent<HTMLElement>) => {
    triggerBurst(e);
    navigator.clipboard.writeText(textToCopy);
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 2200);
  };

  const getTwitterIntentUrl = () => {
    const text = encodeURIComponent(editedText.slice(0, 280));
    return `https://twitter.com/intent/tweet?text=${text}`;
  };

  const getLinkedInShareUrl = () => {
    return `https://www.linkedin.com/feed/`;
  };

  const textLength = editedText.length;
  const wordCount = editedText.split(/\s+/).filter(Boolean).length;
  const tweetLimit = 280;

  return (
    <div className="bg-white rounded-3xl border border-[#E4E4E7] shadow-xl overflow-hidden relative">
      <SparkleContainer />

      {/* MINIMAL PREMIUM SEGMENTED CONTROL NAVBAR (NO EMOJIS) */}
      <div className="bg-[#F8FAFC] px-4 sm:px-6 py-3 border-b border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Minimal Segmented Control Navbar */}
        <div className="w-full sm:w-auto flex items-center bg-[#F1F5F9] p-1 rounded-2xl border border-[#E2E8F0] overflow-x-auto">
          <button
            onClick={() => setActivePlatformPreview('twitter')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activePlatformPreview === 'twitter'
                ? 'bg-white text-[#0A0A0C] border border-[#E2E8F0] shadow-sm font-bold'
                : 'text-[#64748B] hover:text-[#0A0A0C]'
            }`}
          >
            Twitter / X
          </button>
          <button
            onClick={() => setActivePlatformPreview('linkedin')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activePlatformPreview === 'linkedin'
                ? 'bg-white text-[#0A0A0C] border border-[#E2E8F0] shadow-sm font-bold'
                : 'text-[#64748B] hover:text-[#0A0A0C]'
            }`}
          >
            LinkedIn
          </button>
          <button
            onClick={() => setActivePlatformPreview('instagram')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activePlatformPreview === 'instagram'
                ? 'bg-white text-[#0A0A0C] border border-[#E2E8F0] shadow-sm font-bold'
                : 'text-[#64748B] hover:text-[#0A0A0C]'
            }`}
          >
            Instagram / TikTok
          </button>
          <button
            onClick={() => setActivePlatformPreview('article')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activePlatformPreview === 'article'
                ? 'bg-white text-[#0A0A0C] border border-[#E2E8F0] shadow-sm font-bold'
                : 'text-[#64748B] hover:text-[#0A0A0C]'
            }`}
          >
            Substack / Blog
          </button>
        </div>

        {/* Minimal Live Edit Toggle */}
        {!readOnly && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all shrink-0 ${
              isEditing
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white hover:bg-[#F1F5F9] border-[#E2E8F0] text-[#0A0A0C]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
          </button>
        )}
      </div>

      {/* PLATFORM PREVIEW BODY (Simulates actual social UI) */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activePlatformPreview === 'twitter' && (
            <motion.div
              key="twitter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] shadow-sm max-w-2xl mx-auto"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#FF529A] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                  EP
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#0A0A0C]">Your Creator Handle</span>
                    <CheckCircle2 className="w-4 h-4 text-[#0088FF] fill-[#0088FF] stroke-white" />
                    <span className="text-xs text-[#64748B]">@yourname · 1m</span>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={editedText}
                      onChange={(e) => handleTextChange(e.target.value)}
                      rows={6}
                      className="w-full mt-2 bg-white border border-[#FF529A] rounded-xl p-3 text-xs text-[#0A0A0C] font-sans leading-relaxed focus:outline-none"
                    />
                  ) : (
                    <div className="mt-2 text-xs sm:text-sm text-[#0A0A0C] font-sans leading-relaxed whitespace-pre-line">
                      {editedText}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#64748B] text-xs pt-4 mt-3 border-t border-[#E2E8F0]">
                    <span className="flex items-center gap-1 hover:text-[#0088FF] transition-colors">
                      <MessageCircle className="w-4 h-4" /> 18
                    </span>
                    <span className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                      <Repeat2 className="w-4 h-4" /> 42
                    </span>
                    <span className="flex items-center gap-1 hover:text-[#FF007A] transition-colors">
                      <Heart className="w-4 h-4" /> 189
                    </span>
                    <span className="flex items-center gap-1 hover:text-[#0088FF] transition-colors">
                      <Bookmark className="w-4 h-4" /> 35
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePlatformPreview === 'linkedin' && (
            <motion.div
              key="linkedin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-md max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-extrabold text-sm">
                  IN
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0A0A0C]">Your Name • Executive Creator</div>
                  <div className="text-[11px] text-[#64748B]">Repurposed via EveryPosting Engine • 1h</div>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  rows={8}
                  className="w-full bg-[#F8FAFC] border border-[#0A66C2] rounded-xl p-3 text-xs text-[#0A0A0C] font-sans leading-relaxed focus:outline-none"
                />
              ) : (
                <div className="text-xs sm:text-sm text-[#0A0A0C] font-sans leading-relaxed whitespace-pre-line">
                  {editedText}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[#64748B] pt-4 mt-4 border-t border-[#E2E8F0]">
                <span className="flex items-center gap-1 text-[#0A66C2] font-bold">
                  <ThumbsUp className="w-4 h-4" /> 142 Likes
                </span>
                <span>38 Comments • 12 Reposts</span>
              </div>
            </motion.div>
          )}

          {activePlatformPreview === 'instagram' && (
            <motion.div
              key="instagram"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#FFF0F6] p-6 rounded-2xl border border-[#FFC2DA] max-w-xl mx-auto text-center"
            >
              <div className="bg-white p-6 rounded-2xl border border-[#FFC2DA] shadow-lg mb-4">
                <span className="px-3 py-1 rounded-full bg-pink-50 text-[#FF529A] text-[11px] font-extrabold uppercase tracking-wider mb-3 inline-block">
                  Carousel Slide Preview
                </span>
                <p className="text-sm font-bold text-[#0A0A0C] leading-snug font-sans">
                  &quot;{editedText.slice(0, 180)}...&quot;
                </p>
              </div>

              <div className="text-left text-xs text-[#64748B] font-mono bg-white p-3 rounded-xl border border-[#E2E8F0]">
                <strong className="text-[#0A0A0C]">Caption & Hashtags:</strong>
                <p className="mt-1 line-clamp-3">{editedText}</p>
              </div>
            </motion.div>
          )}

          {activePlatformPreview === 'article' && (
            <motion.div
              key="article"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm max-w-3xl mx-auto"
            >
              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  rows={10}
                  className="w-full bg-[#F8FAFC] border border-[#FF529A] rounded-xl p-4 text-xs sm:text-sm text-[#0A0A0C] font-mono leading-relaxed focus:outline-none"
                />
              ) : (
                <div className="text-xs sm:text-sm text-[#1E293B] font-sans leading-relaxed whitespace-pre-line max-h-[320px] overflow-y-auto">
                  {editedText}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTION BAR: DIRECT 1-CLICK COPY & SOCIAL WEB INTENTS */}
      <div className="bg-[#F8FAFC] px-6 py-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Metric Counters */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#64748B]">
          <span>
            <strong className="text-[#0A0A0C]">{wordCount}</strong> words
          </span>
          <span>•</span>
          <span>
            <strong className="text-[#0A0A0C]">{textLength}</strong> characters
          </span>
          {activePlatformPreview === 'twitter' && (
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                textLength > tweetLimit ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {textLength}/{tweetLimit} chars
            </span>
          )}
        </div>

        {/* Action Buttons: 1-Click Copy & Direct Social Open Links */}
        <div className="flex flex-wrap items-center gap-2">
          {activePlatformPreview === 'twitter' && (
            <a
              href={getTwitterIntentUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#0A0A0C] hover:bg-[#262626] text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Post to Twitter / X</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {activePlatformPreview === 'linkedin' && (
            <a
              href={getLinkedInShareUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#0A66C2] hover:bg-[#084e96] text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Post to LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={(e) => handleCopy(editedText, 'formatted', e)}
            className="btn-aiigen-primary px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-pink-500/25"
          >
            {copiedType === 'formatted' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Ready Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
