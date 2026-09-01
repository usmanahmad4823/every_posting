'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarRating } from './star-rating';
import { X, ExternalLink, CheckCircle2, Heart, MessageSquare } from 'lucide-react';

interface FeedbackPromptProps {
  generationId?: string;
  onDismiss?: () => void;
}

export function FeedbackPrompt({ generationId, onDismiss }: FeedbackPromptProps) {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [submittingText, setSubmittingText] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  const handleStarSelect = async (selectedRating: number) => {
    setRating(selectedRating);

    // Instant save rating alone to API
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: selectedRating,
          generationId,
          source: 'per_generation',
        }),
      });
    } catch (e) {
      console.warn('Failed to save micro star rating:', e);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingText(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          reviewText,
          generationId,
          source: 'per_generation',
        }),
      });
    } catch (e) {
      console.warn('Failed to submit review text:', e);
    } finally {
      setSubmittingText(false);
      setSubmitted(true);
      setTimeout(() => {
        setDismissed(true);
        onDismiss?.();
      }, 2500);
    }
  };

  const handleSkipText = () => {
    setSubmitted(true);
    setTimeout(() => {
      setDismissed(true);
      onDismiss?.();
    }, 1800);
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="mt-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#FFC2DA] shadow-sm relative"
    >
      <button
        onClick={() => {
          setDismissed(true);
          onDismiss?.();
        }}
        className="absolute top-3 right-3 text-[#94A3B8] hover:text-[#0A0A0C] p-1 rounded-lg transition-colors"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <div>
            {/* Step 1: Micro Star Prompt */}
            {rating === 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF529A]" />
                  <span className="text-xs sm:text-sm font-bold text-[#0A0A0C]">
                    How was this generated result?
                  </span>
                </div>
                <StarRating value={rating} onChange={handleStarSelect} size="md" />
              </div>
            ) : (
              /* Step 2: Conditional Follow-up (4-5 Stars vs 1-3 Stars) */
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
                className="pr-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StarRating value={rating} onChange={handleStarSelect} size="sm" />
                    <span className="text-xs font-bold text-[#0A0A0C]">
                      {rating >= 4 ? 'Awesome! Mind leaving a quick review?' : 'Sorry to hear that — what went wrong?'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleTextSubmit} className="space-y-3">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={
                      rating >= 4
                        ? 'What did you love most about this generated content?'
                        : 'Tell us how we can improve this output for your niche...'
                    }
                    rows={2}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0A0A0C] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF529A] font-medium"
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* External Review Links for Positive Feedback */}
                    {rating >= 4 ? (
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[#71717A] text-[11px] font-medium">Or share publicly on:</span>
                        <a
                          href="https://www.trustpilot.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF529A] font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                        >
                          Trustpilot <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href="https://www.g2.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF529A] font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                        >
                          G2 Crowd <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#71717A] italic">
                        Your private feedback goes directly to our engineering team.
                      </span>
                    )}

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={handleSkipText}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#71717A] hover:bg-[#F4F4F5]"
                      >
                        Skip
                      </button>
                      <button
                        type="submit"
                        disabled={submittingText}
                        className="btn-aiigen-primary px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm shadow-pink-500/20"
                      >
                        {submittingText ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        ) : (
          /* Confirmation Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm font-bold text-[#0A0A0C]"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Thanks for your feedback! 🎉</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
