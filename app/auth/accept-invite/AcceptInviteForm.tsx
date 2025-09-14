"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addClientToTrainer } from "./actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
            <svg
              width="58"
              height="51"
              viewBox="0 0 58 51"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-auto"
            >
              <path
                d="m31.6424 12.4379c-0.194 2.402 0.0197 4.8192 0.2468 7.2083c1.7834 13.0236 7.704 1.5823 5.4293 -9.4909"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m39.7444 8.44871c2.0633 -1.31488 16.2042 -11.02467 17.228 -6.03976c1.1128 5.41643 -10.2328 10.77135 -13.1562 14.32935c-6.4165 7.8092 -5.071 21.4153 -1.4807 30.155"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m28.7618 20.3423c-5.4138 7.7246 -8.8916 16.2553 -10.7349 25.2293"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m28.5156 35.3591c2.4708 -2.1985 8.7469 -0.444 7.2801 3.3641c-0.9479 2.4607 -3.5601 4.9262 -5.5526 6.6075c-0.7084 0.5977 -1.5844 1.2177 -2.4679 1.562c-0.2059 0.08 -0.7736 0.0878 -0.6171 0.2402c0.3552 0.3456 9.1734 -2.2382 9.6247 -0.4805c0.2052 0.7993 -6.4734 2.7261 -7.2802 2.8834c-4.1936 0.8165 -9.1933 0.6802 -12.8326 -1.6821c-0.8081 -0.5245 -1.0671 -1.7338 -1.7277 -2.1623c-0.0814 -0.053 -6.01008 4.4585 -9.11808 2.6429"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m41.5026 9.65137c0.1145 0.35263 0.405 0.62663 0.6441 0.90593"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m55.6079 2.26789c4.4761 -0.55898 -3.7977 3.60145 -0.2984 0.19369"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m40.3949 27.3106c-6.9318 0.9329 -9.1207 -0.0706 -11.3097 -8.5835c-6.5406 8.6583 -12.485 13.0582 -26.0852 12.6431c3.95343 2.1924 4.05427 3.7961 0 7.3933c3.39703 1.3266 2.78476 2.0703 0 3.397c3.04333 0.5776 4.05834 1.5188 4.97443 3.9964c1.65457 -1.7134 2.58287 -1.641 4.23747 0c8.3074 -9.0736 15.0946 -13.7171 28.183 -18.8463z"
                fill="#FFB915"
                stroke="black"
                strokeWidth="1.5"
              />
            </svg>
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
          <svg
            width="58"
            height="51"
            viewBox="0 0 58 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-auto"
          >
            <path
              d="m31.6424 12.4379c-0.194 2.402 0.0197 4.8192 0.2468 7.2083c1.7834 13.0236 7.704 1.5823 5.4293 -9.4909"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m39.7444 8.44871c2.0633 -1.31488 16.2042 -11.02467 17.228 -6.03976c1.1128 5.41643 -10.2328 10.77135 -13.1562 14.32935c-6.4165 7.8092 -5.071 21.4153 -1.4807 30.155"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m28.7618 20.3423c-5.4138 7.7246 -8.8916 16.2553 -10.7349 25.2293"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m28.5156 35.3591c2.4708 -2.1985 8.7469 -0.444 7.2801 3.3641c-0.9479 2.4607 -3.5601 4.9262 -5.5526 6.6075c-0.7084 0.5977 -1.5844 1.2177 -2.4679 1.562c-0.2059 0.08 -0.7736 0.0878 -0.6171 0.2402c0.3552 0.3456 9.1734 -2.2382 9.6247 -0.4805c0.2052 0.7993 -6.4734 2.7261 -7.2802 2.8834c-4.1936 0.8165 -9.1933 0.6802 -12.8326 -1.6821c-0.8081 -0.5245 -1.0671 -1.7338 -1.7277 -2.1623c-0.0814 -0.053 -6.01008 4.4585 -9.11808 2.6429"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m41.5026 9.65137c0.1145 0.35263 0.405 0.62663 0.6441 0.90593"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m55.6079 2.26789c4.4761 -0.55898 -3.7977 3.60145 -0.2984 0.19369"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m40.3949 27.3106c-6.9318 0.9329 -9.1207 -0.0706 -11.3097 -8.5835c-6.5406 8.6583 -12.485 13.0582 -26.0852 12.6431c3.95343 2.1924 4.05427 3.7961 0 7.3933c3.39703 1.3266 2.78476 2.0703 0 3.397c3.04333 0.5776 4.05834 1.5188 4.97443 3.9964c1.65457 -1.7134 2.58287 -1.641 4.23747 0c8.3074 -9.0736 15.0946 -13.7171 28.183 -18.8463z"
              fill="#FFB915"
              stroke="black"
              strokeWidth="1.5"
            />
          </svg>
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
