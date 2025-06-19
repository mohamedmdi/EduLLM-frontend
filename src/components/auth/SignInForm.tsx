"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { generateUserId, setUserAuth } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const t = useTranslations("SignIn");
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSignIn = async (provider: string) => {
    setIsLoading(true);
    setMessage(null);

    try {
      setMessage({ type: "success", text: t("authenticating", { provider }) });      // Use NextAuth signIn function for real OAuth
      const callbackUrl = returnTo ? `/${returnTo}` : "/chat";
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setMessage({ type: "error", text: t("signInError") });
        setIsLoading(false);
      } else if (result?.url) {
        setMessage({ type: "success", text: t("signInSuccess") });
        // Redirect to the OAuth provider
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage({ type: "error", text: t("signInError") });
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    setMessage({ type: "success", text: t("settingUpGuest") });

    // Brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 1000));    // Generate a unique guest ID using auth utils
    const guestId = generateUserId('guest');
    setUserAuth(guestId, 'guest');
      console.log(`Continue as guest, unique ID: ${guestId}`);

    // Redirect based on returnTo parameter or default to chat
    const redirectPath = returnTo ? `/${returnTo}` : "/chat";
    window.location.href = redirectPath;
  };
  return (
    <div className="space-y-6">
      {/* Status message */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm ${
            message.type === "success"
              ? "bg-emerald-900/20 border-emerald-500/20 text-emerald-400"
              : "bg-red-900/20 border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <Button
          onClick={() => handleSignIn("google")}
          disabled={isLoading}
          className="cursor-pointer w-full flex items-center justify-center px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-medium">{t("signInWith")} Google</span>
          </div>
        </Button>
        <Button
          onClick={() => handleSignIn("azure-ad")}
          disabled={isLoading}
          className="cursor-pointer w-full flex items-center justify-center px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z" />
                <path fill="#00a4ef" d="M13 1h10v10H13z" />
                <path fill="#7fba00" d="M1 13h10v10H1z" />
                <path fill="#ffb900" d="M13 13h10v10H13z" />
              </svg>
            )}
            <span className="font-medium">{t("signInWith")} Microsoft</span>
          </div>
        </Button>
      </div>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-900/30 text-slate-400">
              {t("orContinueAs")}
            </span>
          </div>
        </div>

        <div className="mt-6">
          {" "}
          <Button
            onClick={handleGuestSignIn}
            disabled={isLoading}
            className="cursor-pointer w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{t("settingUp")}</span>
              </div>
            ) : (
              t("continueAsGuest")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
