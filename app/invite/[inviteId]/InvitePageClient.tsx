"use client";

import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Logo from "@/components/Logo";

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
              <Logo className="h-10 w-auto" />
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
              <Logo className="h-10 w-auto" />
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
            <Logo className="h-12 w-auto" />
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
