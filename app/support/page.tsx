'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare, Mail, CheckCircle2, Send, HelpCircle, ShieldCheck } from 'lucide-react';
import FooterSection from '@/components/landing/footer';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, subject: 'Support Ticket Request', type: 'support' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit support ticket.');

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#52525B] pt-24 sm:pt-28 pb-8 sm:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-[#FF529A] mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF529A]" />
            <span>24/7 Creator Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0C] tracking-tight">
            Support & <span className="text-[#FF529A]">Help Center</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#71717A] leading-relaxed font-medium">
            Have questions about your subscription, Anthropic API keys, or custom formats? Send us a message below.
          </p>
        </div>

        <div className="aiigen-card p-8 sm:p-12 bg-white border border-[#E4E4E7] rounded-3xl shadow-xl mb-16">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0A0A0C] mb-2">Message Received!</h3>
              <p className="text-sm text-[#71717A] font-medium mb-6">
                Our support team will respond to <strong>{email}</strong> in under 2 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-pink-50 text-[#FF529A] font-extrabold text-xs rounded-xl border border-pink-200"
              >
                Send Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@yourcompany.com"
                  className="w-full rounded-xl p-3 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF529A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">
                  How can we help you?
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full rounded-xl p-3 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF529A] focus:outline-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-aiigen-primary w-full py-3.5 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Support Ticket</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
