/**
 * Helper utility to obfuscate sensitive client-side key storage,
 * preventing plain-text `sk-ant-` API key strings from being exposed in browser localStorage.
 */

const STORAGE_KEY = 'everyposting_custom_key_secure';
const LEGACY_STORAGE_KEY = 'everyposting_custom_key';
const SALT = 'EP_KEY_SALT_2026_SECURE';

function obfuscate(text: string): string {
  if (!text) return '';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
  }
  return typeof btoa !== 'undefined' ? btoa(result) : Buffer.from(result, 'binary').toString('base64');
}

function deobfuscate(encoded: string): string {
  if (!encoded) return '';
  try {
    const raw = typeof atob !== 'undefined' ? atob(encoded) : Buffer.from(encoded, 'base64').toString('binary');
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      result += String.fromCharCode(raw.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
    }
    return result;
  } catch {
    return '';
  }
}

export function setSecureCustomKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key) {
    removeSecureCustomKey();
    return;
  }
  // Remove legacy unencrypted key
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, obfuscate(key.trim()));
}

export function getSecureCustomKey(): string {
  if (typeof window === 'undefined') return '';
  
  // Auto-migrate legacy key if present
  const legacyKey = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacyKey) {
    setSecureCustomKey(legacyKey);
    return legacyKey;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? deobfuscate(stored) : '';
}

export function removeSecureCustomKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
}
