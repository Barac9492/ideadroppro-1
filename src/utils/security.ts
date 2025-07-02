import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

// Enhanced content sanitization
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
  });
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Rate limiting implementation
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>();
  private windowMs: number;
  private maxAttempts: number;

  constructor(windowMs: number = 60000, maxAttempts: number = 10) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry || now > entry.resetTime) {
      this.storage.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxAttempts) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingAttempts(key: string): number {
    const entry = this.storage.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - entry.count);
  }
}

export const rateLimiter = new RateLimiter();

// Secure local storage with encryption
const ENCRYPTION_KEY = 'user-session-key';

export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const encrypted = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to encrypt and store data:', error);
    }
  },

  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt stored data:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

// Session timeout management
export class SessionManager {
  private timeoutId: NodeJS.Timeout | null = null;
  private warningTimeoutId: NodeJS.Timeout | null = null;
  private onTimeout: () => void;
  private onWarning: () => void;
  private timeoutDuration: number;
  private warningDuration: number;

  constructor(
    onTimeout: () => void,
    onWarning: () => void,
    timeoutDuration: number = 30 * 60 * 1000, // 30 minutes
    warningDuration: number = 25 * 60 * 1000 // 25 minutes
  ) {
    this.onTimeout = onTimeout;
    this.onWarning = onWarning;
    this.timeoutDuration = timeoutDuration;
    this.warningDuration = warningDuration;
  }

  startSession(): void {
    this.resetTimeout();
  }

  resetTimeout(): void {
    this.clearTimeouts();
    
    this.warningTimeoutId = setTimeout(() => {
      this.onWarning();
    }, this.warningDuration);

    this.timeoutId = setTimeout(() => {
      this.onTimeout();
    }, this.timeoutDuration);
  }

  extendSession(): void {
    this.resetTimeout();
  }

  endSession(): void {
    this.clearTimeouts();
  }

  private clearTimeouts(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }
}

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length === 64; // 32 bytes = 64 hex chars
};

// Security headers utility
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://wutnxfgyikjisfqczyjh.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
};