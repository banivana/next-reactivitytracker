"use client";

import { useEffect } from "react";
import clarity from "@microsoft/clarity";
import { getCookiePreferences } from "@/lib/cookies";

export function MicrosoftClarity() {
  useEffect(() => {
    // Only initialize Clarity if analytics cookies are accepted
    const preferences = getCookiePreferences();

    if (preferences.analytics) {
      const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

      if (clarityProjectId) {
        clarity.init(clarityProjectId);
      }
    }
  }, []);

  return null;
}
