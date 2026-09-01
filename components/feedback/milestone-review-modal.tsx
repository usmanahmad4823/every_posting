'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarRating } from './star-rating';
import { X, Sparkles, ExternalLink, CheckCircle2, Heart } from 'lucide-react';

interface MilestoneReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MilestoneReviewModal({ isOpen, onClose }: MilestoneReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          reviewText,
          source: 'milestone',
        }),
      });
    } catch (e) {
      console.warn('Milestone review submit warning:', e);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0A0A0C]/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#FFC2DA] shadow-2xl relative text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0A0A0C] p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-[#FF529A] mx-auto mb-4 border border-pink-200">
                <Sparkles className="w-6 h-6 text-[#FF529A]" />
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#FF529A] border border-pink-200 uppercase">
                Creator Milestone Reached 🚀
              </span>

              <h3 className="text-xl font-extrabold text-[#0A0A0C] mt-3">
                Enjoying EveryPosting?
              </h3>
              <p className="text-xs text-[#52525B] mt-1 mb-6 font-medium leading-relaxed">
                You&apos;ve repurposed multiple transcripts! We&apos;d love to hear your thoughts to help improve the creator studio.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center mb-2">
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us what you like or how we can make content repurposing even better..."
                  rows={3}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0A0A0C] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF529A] font-medium"
                />

                <div className="flex items-center justify-center gap-4 text-xs pt-1">
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
                    G2 Review <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:bg-[#F4F4F5] rounded-xl"
                  >
                    Maybe Later
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-aiigen-primary px-5 py-2.5 text-xs font-bold shadow-md shadow-pink-500/25"
                  >
                    {submitting ? 'Submitting...' : 'Send Review'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#0A0A0C]">Thank You for Your Support! 🎉</h3>
              <p className="text-xs text-[#71717A] mt-1 font-medium">Your feedback drives EveryPosting forward.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
