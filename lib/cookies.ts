export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export const COOKIE_CONSENT_KEY = 'cookie-consent';
export const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

export const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function getCookieConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
}

export function setCookieConsent(hasConsented: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOKIE_CONSENT_KEY, hasConsented.toString());
}

export function getCookiePreferences(): CookiePreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  
  const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
  if (!stored) return defaultPreferences;
  
  try {
    return { ...defaultPreferences, ...JSON.parse(stored) };
  } catch {
    return defaultPreferences;
  }
}

export function setCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
}

export function resetCookieConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  localStorage.removeItem(COOKIE_PREFERENCES_KEY);
}