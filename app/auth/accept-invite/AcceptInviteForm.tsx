"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addClientToTrainer } from "./actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Logo from "@/components/Logo";

interface AcceptInviteFormProps {
  trainerId: string;
  userId: string;
}

type Platform = "ios" | "android";

export default function AcceptInviteForm({
  trainerId,
  userId,
}: AcceptInviteFormProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlatform) {
      setError("Please select a platform");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await addClientToTrainer({
        trainerId,
        userId,
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        platform: selectedPlatform,
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "Failed to complete registration");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center pb-6">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Logo className="h-12 w-auto" />
            <span className="text-3xl font-extrabold ml-3">
              <span className="text-[#FFB915]">Reactivity</span>Tracker
            </span>
          </div>

          <div className="space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faCheck}
                className="w-8 h-8 text-green-600"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Registration Successful!
            </h1>

            <p className="text-gray-600 text-sm leading-relaxed">
              Thank you for completing your registration. We will send you a
              download link for the{" "}
              <span className="font-medium capitalize">{selectedPlatform}</span>{" "}
              app as soon as possible.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <a
            href="/dashboard"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Go to Dashboard
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[400px] shadow-lg">
      <CardHeader className="text-center pb-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Logo className="h-12 w-auto" />
          <span className="text-3xl font-extrabold ml-3">
            <span className="text-[#FFB915]">Reactivity</span>Tracker
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-xl font-bold text-gray-900">
            Complete Your Registration
          </h1>

          <p className="text-gray-600 text-sm leading-relaxed">
            Choose your platform and provide your name so your trainer can
            identify you.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Which platform will you use? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlatform("ios")}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  selectedPlatform === "ios"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <FontAwesomeIcon icon={faApple} className="w-8 h-8" />
                  <span className="text-sm font-medium">iOS</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform("android")}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  selectedPlatform === "android"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <FontAwesomeIcon icon={faAndroid} className="w-8 h-8" />
                  <span className="text-sm font-medium">Android</span>
                </div>
              </button>
            </div>
          </div>

          {/* Name Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !selectedPlatform}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Completing Registration...
              </span>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
