'use client';

import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, X, ShieldAlert, Loader2, Trash2 } from 'lucide-react';
import { maskApiKey } from '@/lib/anthropic';
import { supabase } from '@/lib/supabase';
import { getSecureCustomKey, setSecureCustomKey, removeSecureCustomKey } from '@/lib/key-storage';

type ValidationStatus = 'IDLE' | 'VALIDATING' | 'VALID' | 'INVALID' | 'ERROR';

interface CustomKeySettingsProps {
  customApiKey?: string;
  onSaveKey?: (key: string) => void;
  onRemoveKey?: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const CustomKeySettings: React.FC<CustomKeySettingsProps> = ({
  customApiKey,
  onSaveKey,
  onRemoveKey,
  onClose,
  isModal = false,
}) => {
  const [inputKey, setInputKey] = useState<string>('');
  const [showRawKey, setShowRawKey] = useState<boolean>(false);
  const [status, setStatus] = useState<ValidationStatus>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [validatedKey, setValidatedKey] = useState<string | null>(null);

  useEffect(() => {
    const activeKey = customApiKey !== undefined ? customApiKey : getSecureCustomKey();
    if (activeKey) {
      setInputKey(activeKey);
      if (activeKey.startsWith('sk-ant-')) {
        setStatus('VALID');
        setStatusMessage('✓ Valid Anthropic API key');
        setValidatedKey(activeKey);
      }
    } else {
      setInputKey('');
      setStatus('IDLE');
      setStatusMessage('');
      setValidatedKey(null);
    }
  }, [customApiKey]);

  const handleValidate = async () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setStatus('INVALID');
      setStatusMessage('Enter your Anthropic API key');
      return;
    }

    setStatus('VALIDATING');
    setStatusMessage('Validating API key...');

    try {
      // Extract active Supabase session token
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const res = await fetch('/api/anthropic/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ apiKey: trimmed }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setStatus('VALID');
        setStatusMessage(data.message || '✓ API key is valid');
        setValidatedKey(trimmed);
      } else {
        setStatus('INVALID');
        setStatusMessage(data.message || '✕ Invalid Anthropic API key');
        setValidatedKey(null);
      }
    } catch (err) {
      console.warn('API key validation error:', err);
      setStatus('ERROR');
      setStatusMessage('⚠ Unable to validate the API key right now. Please try again.');
    }
  };

  const handleSave = () => {
    if (status !== 'VALID' && !validatedKey) return;
    const targetKey = validatedKey || inputKey.trim();
    if (targetKey) {
      if (onSaveKey) {
        onSaveKey(targetKey);
      } else {
        setSecureCustomKey(targetKey);
        setStatus('VALID');
        setStatusMessage('✓ API key saved securely');
      }
      if (onClose) onClose();
    }
  };

  const handleRemove = () => {
    setInputKey('');
    setStatus('IDLE');
    setStatusMessage('');
    setValidatedKey(null);
    if (onRemoveKey) {
      onRemoveKey();
    } else {
      removeSecureCustomKey();
    }
    if (onClose) onClose();
  };

  const isSavedAndActive = !!customApiKey && inputKey === customApiKey;

  return (
    <div className={`space-y-4 ${isModal ? '' : 'w-full'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 border border-[#FFC2DA] flex items-center justify-center text-[#FF529A]">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0A0A0C]">Custom Anthropic API Key</h3>
            <p className="text-[11px] text-[#71717A] font-medium">Use your own Claude API Key (`sk-ant-...`)</p>
          </div>
        </div>

        {isSavedAndActive && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Active</span>
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <input
            type={showRawKey ? 'text' : 'password'}
            value={inputKey}
            onChange={(e) => {
              setInputKey(e.target.value);
              setStatus('IDLE');
              setStatusMessage('');
              setValidatedKey(null);
            }}
            placeholder="sk-ant-api03-xxxxxxxxxxxxxxxx"
            disabled={status === 'VALIDATING'}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 pr-10 text-xs text-[#0A0A0C] font-mono focus:outline-none focus:border-[#FF529A] transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowRawKey(!showRawKey)}
            className="absolute right-3 top-3 text-[#71717A] hover:text-[#0A0A0C] transition-colors"
            title={showRawKey ? 'Hide Key' : 'Show Key'}
          >
            {showRawKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Masked Display Hint */}
        {inputKey && !showRawKey && (
          <p className="text-[11px] font-mono text-[#71717A] pl-1">
            Masked: <span className="text-[#0A0A0C] font-bold">{maskApiKey(inputKey)}</span>
          </p>
        )}

        {/* Dynamic Status Notification Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              status === 'VALID'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : status === 'INVALID'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : status === 'VALIDATING'
                ? 'bg-pink-50 text-[#FF529A] border-[#FFC2DA]'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {status === 'VALIDATING' && <Loader2 className="w-4 h-4 animate-spin shrink-0 text-[#FF529A]" />}
            {status === 'VALID' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {status === 'INVALID' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {status === 'ERROR' && <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Action Control Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E4E4E7]">
        {customApiKey ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={status === 'VALIDATING'}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Key</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleValidate}
            disabled={status === 'VALIDATING' || !inputKey.trim()}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A0A0C] text-xs font-extrabold border border-slate-200 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {status === 'VALIDATING' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Validating...</span>
              </>
            ) : (
              <span>Validate Key</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={status !== 'VALID'}
            className="btn-aiigen-primary px-5 py-2 text-xs font-extrabold shadow-md shadow-pink-500/25 rounded-xl disabled:opacity-50 cursor-pointer"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
}
