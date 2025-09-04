"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Settings, Cookie } from "lucide-react";
import {
  getCookieConsent,
  setCookieConsent,
  getCookiePreferences,
  setCookiePreferences,
  defaultPreferences,
  type CookiePreferences,
} from "@/lib/cookies";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const hasConsent = getCookieConsent();
    if (!hasConsent) {
      setShowBanner(true);
    }
    setPreferences(getCookiePreferences());
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
    };
    setCookiePreferences(allPreferences);
    setCookieConsent(true);
    setShowBanner(false);

    // Enable Google Analytics if accepted
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleAcceptNecessary = () => {
    setCookiePreferences(defaultPreferences);
    setCookieConsent(true);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    setCookiePreferences(preferences);
    setCookieConsent(true);
    setShowBanner(false);
    setShowSettings(false);
    // Update Google Analytics consent
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: preferences.analytics ? "granted" : "denied",
      });
    }
  };

  const handlePreferenceChange = (
    key: keyof CookiePreferences,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4">
      <Card className="mx-auto max-w-4xl border-2 bg-white shadow-lg">
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg mb-2">
                Cookie Preferences
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                We use cookies to improve your experience on our site. Some
                cookies are necessary for the site to function, while others
                help us analyze usage and provide personalized content.
              </p>

              {showSettings && (
                <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-xs sm:text-sm">
                        Necessary Cookies
                      </label>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        Required for the website to function properly
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-xs sm:text-sm">
                        Analytics Cookies
                      </label>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        Help us understand how visitors use our website (Google
                        Analytics & Microsoft Clarity)
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        handlePreferenceChange("analytics", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {!showSettings ? (
                  <>
                    <Button
                      onClick={handleAcceptAll}
                      size="sm"
                      className="text-xs px-3 py-1 h-8"
                    >
                      <span className="hidden sm:inline">Accept All</span>
                      <span className="sm:hidden">Accept</span>
                    </Button>
                    <Button
                      onClick={handleAcceptNecessary}
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 h-8"
                    >
                      <span className="hidden sm:inline">Necessary Only</span>
                      <span className="sm:hidden">Essential</span>
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs px-3 py-1 h-8"
                    >
                      <Settings className="h-3 w-3" />
                      <span className="hidden sm:inline">Customize</span>
                      <span className="sm:hidden">Settings</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleSavePreferences}
                      size="sm"
                      className="text-xs px-3 py-1 h-8"
                    >
                      <span className="hidden sm:inline">Save Preferences</span>
                      <span className="sm:hidden">Save</span>
                    </Button>
                    <Button
                      onClick={() => setShowSettings(false)}
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 h-8"
                    >
                      Back
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Button
              onClick={() => setShowBanner(false)}
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
