import { supabase } from '@/integrations/supabase/client';

export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  ACCOUNT_LOCKED = 'account_locked',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_ACCESS = 'data_access',
  PERMISSION_DENIED = 'permission_denied',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  CONTENT_FILTERED = 'content_filtered',
  SESSION_TIMEOUT = 'session_timeout',
}

interface SecurityEvent {
  event_type: SecurityEventType;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, any>;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

class AuditLogger {
  private queue: SecurityEvent[] = [];
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds

  constructor() {
    // Flush logs periodically
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  async logSecurityEvent(event: Omit<SecurityEvent, 'ip_address' | 'user_agent'>) {
    const fullEvent: SecurityEvent = {
      ...event,
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent,
    };

    this.queue.push(fullEvent);

    // Immediate flush for critical events
    if (event.risk_level === 'critical') {
      await this.flush();
    }

    // Flush when batch size is reached
    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // Store locally for now (can be enhanced with backend integration later)
      this.storeLocally(events);
      console.log(`🔒 Stored ${events.length} security events locally`);
    } catch (error) {
      console.error('Failed to flush security logs:', error);
      // Put events back in queue for retry
      this.queue.unshift(...events);
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      // This is a simplified approach - in production you might want to use a service
      return 'client-ip-hidden'; // For privacy, we don't actually collect IPs
    } catch {
      return 'unknown';
    }
  }

  private storeLocally(events: SecurityEvent[]) {
    try {
      const existing = JSON.parse(localStorage.getItem('security_logs') || '[]');
      const eventsWithTimestamp = events.map(event => ({
        ...event,
        created_at: new Date().toISOString()
      }));
      const updated = [...existing, ...eventsWithTimestamp].slice(-100); // Keep last 100 events
      localStorage.setItem('security_logs', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to store security logs locally:', error);
    }
  }

  // Security monitoring methods
  async checkSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      // Check local storage for suspicious activity patterns
      const stored = localStorage.getItem('security_logs');
      if (!stored) return false;

      const logs = JSON.parse(stored);
      const recentLogs = logs.filter((log: any) => 
        log.user_id === userId &&
        log.event_type === SecurityEventType.LOGIN_FAILED &&
        new Date(log.created_at).getTime() > Date.now() - 15 * 60 * 1000
      );

      return recentLogs.length >= 5; // 5 failed attempts in 15 minutes
    } catch (error) {
      console.error('Failed to check suspicious activity:', error);
      return false;
    }
  }

  async getSecurityMetrics(timeRange: 'hour' | 'day' | 'week' = 'day') {
    const timeAgo = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
    }[timeRange];

    try {
      const stored = localStorage.getItem('security_logs');
      if (!stored) return null;

      const logs = JSON.parse(stored);
      const recentLogs = logs.filter((log: any) => 
        new Date(log.created_at).getTime() > Date.now() - timeAgo
      );

      const metrics = {
        totalEvents: recentLogs.length,
        riskLevels: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
        },
        eventTypes: {} as Record<string, number>,
      };

      recentLogs.forEach((event: any) => {
        metrics.riskLevels[event.risk_level]++;
        metrics.eventTypes[event.event_type] = (metrics.eventTypes[event.event_type] || 0) + 1;
      });

      return metrics;
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return null;
    }
  }
}

export const auditLogger = new AuditLogger();