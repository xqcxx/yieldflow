/**
 * User Analytics - Track user behavior and engagement
 */

import { analytics } from './AnalyticsService';

export interface UserSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  pageViews: string[];
  events: string[];
  wallet?: string;
}

export interface UserProfile {
  id: string;
  firstSeen: number;
  lastSeen: number;
  sessionCount: number;
  totalDeposits: number;
  totalWithdrawals: number;
  preferredStrategies: string[];
  walletAddresses: string[];
}

export class UserAnalytics {
  private sessions: Map<string, UserSession> = new Map();
  private profiles: Map<string, UserProfile> = new Map();
  private currentSession?: UserSession;

  startSession(userId?: string): UserSession {
    const session: UserSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      startTime: Date.now(),
      pageViews: [],
      events: [],
    };

    this.currentSession = session;
    this.sessions.set(session.id, session);

    if (userId) {
      this.updateProfile(userId, { sessionCount: 1 });
    }

    analytics.trackEvent('session_started', { sessionId: session.id, userId });

    return session;
  }

  endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      const duration = this.currentSession.endTime - this.currentSession.startTime;
      
      analytics.trackEvent('session_ended', {
        sessionId: this.currentSession.id,
        duration,
        pageViews: this.currentSession.pageViews.length,
        events: this.currentSession.events.length,
      });

      this.currentSession = undefined;
    }
  }

  trackPageView(page: string): void {
    if (this.currentSession) {
      this.currentSession.pageViews.push(page);
    }
    analytics.trackEvent('page_view', { page });
  }

  trackUserEvent(event: string, properties?: Record<string, any>): void {
    if (this.currentSession) {
      this.currentSession.events.push(event);
    }
    analytics.trackEvent(event, properties);
  }

  connectWallet(address: string): void {
    if (this.currentSession) {
      this.currentSession.wallet = address;
    }
    analytics.trackEvent('wallet_connected', { address });
  }

  trackDeposit(strategy: string, amount: number): void {
    analytics.trackEvent('deposit', { strategy, amount });
    
    if (this.currentSession?.userId) {
      this.updateProfile(this.currentSession.userId, {
        totalDeposits: amount,
      });
    }
  }

  trackWithdrawal(strategy: string, amount: number): void {
    analytics.trackEvent('withdrawal', { strategy, amount });
    
    if (this.currentSession?.userId) {
      this.updateProfile(this.currentSession.userId, {
        totalWithdrawals: amount,
      });
    }
  }

  private updateProfile(userId: string, updates: Partial<UserProfile>): void {
    const existing = this.profiles.get(userId);
    
    if (existing) {
      Object.assign(existing, updates, { lastSeen: Date.now() });
    } else {
      const profile: UserProfile = {
        id: userId,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        sessionCount: updates.sessionCount || 0,
        totalDeposits: updates.totalDeposits || 0,
        totalWithdrawals: updates.totalWithdrawals || 0,
        preferredStrategies: [],
        walletAddresses: [],
        ...updates,
      };
      this.profiles.set(userId, profile);
    }
  }

  getCurrentSession(): UserSession | undefined {
    return this.currentSession;
  }

  getUserProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }

  getActiveSessions(): UserSession[] {
    return Array.from(this.sessions.values()).filter(s => !s.endTime);
  }
}

export const userAnalytics = new UserAnalytics();
