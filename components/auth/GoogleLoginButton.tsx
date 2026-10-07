"use client";

import {
  GoogleOAuthProvider,
  useGoogleLogin,
  type CodeResponse,
} from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/api/types";
import { useAuthStore } from "@/stores/auth.store";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

const GOOGLE_REDIRECT_URI = "postmessage";

interface GoogleLoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token?: string;
  };
}

interface GoogleExchangeInput {
  code: string;
  redirectUri: string;
}

function getRoleRedirect(role: User["role"]): string {
  switch (role) {
    case "ADMIN":
      return "/admin";

    case "AGENT":
      return "/provider";

    default:
      return "/dashboard";
  }
}

function GoogleLoginButtonInner() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [isStarting, setIsStarting] = useState(false);

  const exchangeCode = useMutation({
    mutationFn: async ({
      code,
      redirectUri,
    }: GoogleExchangeInput): Promise<User> => {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          code,
          redirectUri,
        }),
      });

      const body = (await response.json().catch(() => null)) as
        | GoogleLoginResponse
        | null;

      if (!response.ok) {
        throw new Error(
          body?.message ||
            `Google login failed with status ${response.status}.`,
        );
      }

      if (!body?.success || !body.data?.user) {
        throw new Error(
          body?.message || "Google login failed. Please try again.",
        );
      }

      return body.data.user;
    },

    onSuccess: (user) => {
      setUser(user);

      setIsStarting(false);

      toast.success("Welcome back!");

      router.replace(getRoleRedirect(user.role));
      router.refresh();
    },

    onError: (error) => {
      setIsStarting(false);

      const message =
        error instanceof Error
          ? error.message
          : "Google login failed. Please try again.";

      toast.error(message);
    },
  });

  const googleLogin = useGoogleLogin({
    flow: "auth-code",

    ux_mode: "popup",

    scope: "openid email profile",

    onSuccess: (response: CodeResponse) => {
      if (!response.code) {
        setIsStarting(false);

        toast.error(
          "Google did not return an authorization code. Please try again.",
        );

        return;
      }

      exchangeCode.mutate({
        code: response.code,
        redirectUri: GOOGLE_REDIRECT_URI,
      });
    },

    onError: (errorResponse) => {
      console.error("Google OAuth error:", errorResponse);

      setIsStarting(false);

      toast.error("Google sign-in failed or was cancelled.");
    },
  });

  const handleGoogleLogin = () => {
    if (isStarting || exchangeCode.isPending) {
      return;
    }

    setIsStarting(true);

    try {
      googleLogin();
    } catch (error) {
      console.error("Failed to start Google login:", error);

      setIsStarting(false);

      toast.error("Unable to start Google sign-in.");
    }
  };

  const isLoading = isStarting || exchangeCode.isPending;

  return (
    <Button
      type="button"
      variant="outline"
      fullWidth
      isLoading={isLoading}
      disabled={isLoading}
      onClick={handleGoogleLogin}
      leftIcon={
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
          />

          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23Z"
          />

          <path
            fill="#FBBC05"
            d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
          />

          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1a10.99 10.99 0 0 0-9.82 6.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
          />
        </svg>
      }
    >
      {isLoading ? "Signing in with Google..." : "Continue with Google"}
    </Button>
  );
}

export function GoogleLoginButton() {
  if (!GOOGLE_CLIENT_ID) {
    return (
      <Button
        type="button"
        variant="outline"
        fullWidth
        disabled
      >
        Google login unavailable
      </Button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLoginButtonInner />
    </GoogleOAuthProvider>
  );
}