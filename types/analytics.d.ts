// Custom event types for analytics consent
interface AnalyticsConsentDetail {
  analytics: boolean;
}

interface AnalyticsConsentEvent extends CustomEvent {
  detail: AnalyticsConsentDetail;
}

declare global {
  interface WindowEventMap {
    analyticsConsentChanged: AnalyticsConsentEvent;
  }
}

export {};
