"use client";

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/lib/api/types";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

interface GoogleEnvelope {
  success: boolean;
  message: string;
  data: {
    user: User;
    token?: string;
  };
}

function GoogleLoginButtonInner() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [isStarting, setIsStarting] = useState(false);

  const exchangeCode = useMutation({
    mutationFn: async ({
      code,
      redirectUri,
    }: {
      code: string;
      redirectUri: string;
    }): Promise<User> => {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code,
          redirectUri,
        }),
      });

      const body = (await res.json().catch(() => null)) as
        | GoogleEnvelope
        | null;

      if (!res.ok || !body?.success) {
        throw new Error(body?.message ?? "Google login failed");
      }

      return body.data.user;
    },

    onSuccess: (user) => {
      setUser(user);

      toast.success("Welcome back!");

      router.replace(
        user.role === "ADMIN"
          ? "/admin"
          : user.role === "AGENT"
            ? "/provider"
            : "/dashboard",
      );
    },

    onError: (error: Error) => {
      toast.error(error.message);
      setIsStarting(false);
    },
  });

  const googleLogin = useGoogleLogin({
    flow: "auth-code",

    scope: "openid email profile",

    ux_mode: "popup",

    onSuccess: (codeResponse) => {
      if (!codeResponse.code) {
        toast.error("Google did not return an authorization code.");
        setIsStarting(false);
        return;
      }

      exchangeCode.mutate({
        code: codeResponse.code,
        redirectUri: "postmessage",
      });
    },

    onError: () => {
      toast.error("Google sign-in was cancelled.");
      setIsStarting(false);
    },
  });

  if (!CLIENT_ID) {
    return (
      <Button variant="outline" disabled fullWidth>
        Google login unavailable
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      fullWidth
      isLoading={isStarting || exchangeCode.isPending}
      onClick={() => {
        setIsStarting(true);
        googleLogin();
      }}
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
      Continue with Google
    </Button>
  );
}

export function GoogleLoginButton() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <GoogleLoginButtonInner />
    </GoogleOAuthProvider>
  );
}