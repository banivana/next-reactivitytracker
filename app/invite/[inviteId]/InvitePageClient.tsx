"use client";

import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface InvitePageClientProps {
  inviteId: string;
}

export default function InvitePageClient({ inviteId }: InvitePageClientProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setShowEmailForm(false);
        setShowConfirmationForm(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: confirmationCode,
        type: "signup",
      });

      if (error) {
        setError(error.message);
      } else {
        router.push(`/auth/accept-invite?inviteId=${inviteId}`);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "apple") => {
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `https://reactivitytracker.com/auth/callback?inviteId=${inviteId}`,
        },
      });
      if (error) {
        setError(error.message);
      }
    } catch (error) {
      console.error(`Error signing up with ${provider}:`, error);
      setError(`Failed to sign up with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push(`/login?inviteId=${inviteId}`);
  };

  if (showConfirmationForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <Card className="w-[400px] shadow-lg">
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <svg
                width="58"
                height="51"
                viewBox="0 0 58 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-auto"
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
              <span className="text-2xl font-extrabold ml-2">
                <span className="text-[#FFB915]">Reactivity</span>Tracker
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We&apos;ve sent a 6-digit confirmation code to{" "}
              <span className="font-medium">{email}</span>
            </p>

            <button
              onClick={() => {
                setShowConfirmationForm(false);
                setShowEmailForm(true);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              ← Back to email form
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConfirmation} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="confirmationCode"
                  className="text-sm font-medium"
                >
                  Confirmation Code
                </label>
                <Input
                  id="confirmationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
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
                    Verifying...
                  </span>
                ) : (
                  "Verify Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={() => {
                    // Resend code logic could go here
                    setError("Resend functionality not implemented yet");
                  }}
                  className="text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  Resend
                </button>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showEmailForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <Card className="w-[400px] shadow-lg">
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <svg
                width="58"
                height="51"
                viewBox="0 0 58 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-auto"
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
              <span className="text-2xl font-extrabold ml-2">
                <span className="text-[#FFB915]">Reactivity</span>Tracker
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Complete your registration to start using ReactivityTracker
            </p>

            <button
              onClick={() => setShowEmailForm(false)}
              className="text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              ← Back to options
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
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
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  Log in
                </button>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
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

          <div className="space-y-3 mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              Your trainer has invited you to try ReactivityTracker
            </h1>

            <p className="text-gray-600 text-sm leading-relaxed">
              Start tracking your dog&apos;s behavior patterns and use
              data-driven insights to support your training journey.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <Button
            onClick={() => setShowEmailForm(true)}
            className="w-full h-12 text-base font-medium"
            disabled={isLoading}
          >
            Continue with Email
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-medium"
            onClick={() => handleOAuthSignUp("google")}
            disabled={isLoading}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-medium"
            onClick={() => handleOAuthSignUp("apple")}
            disabled={isLoading}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                fill="currentColor"
              />
            </svg>
            Continue with Apple
          </Button>

          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleLogin}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Log in
              </button>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
