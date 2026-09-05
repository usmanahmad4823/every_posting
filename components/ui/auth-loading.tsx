'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export function AuthLoadingScreen({ message = 'Verifying authentication...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center relative overflow-hidden bg-aiigen-dots">
      <div className="flex flex-col items-center gap-4 text-center px-4 relative z-10">
        <div className="relative">
          <span className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#FF529A] via-purple-500 to-[#FF007A] blur-sm opacity-60 animate-pulse" />
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0C] flex items-center justify-center text-white relative shadow-xl">
            <Sparkles className="w-6 h-6 text-[#FF529A] animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-extrabold text-[#0A0A0C]">
          <Loader2 className="w-4 h-4 text-[#FF529A] animate-spin" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}
