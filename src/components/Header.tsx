"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, User, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import SimpleLanguageSwitcher from "./SimpleLanguageSwitcher";
import { useEffect, useState } from "react";
import { isAuthenticated, getUserInfo, clearUserAuth } from "@/lib/auth-utils";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const authed = isAuthenticated();
    setAuth(authed);
    setUser(authed ? getUserInfo() : null);
  }, [pathname]);

  const handleLogout = () => {
    clearUserAuth();
    window.location.href = `/${locale}/auth/signin`;
  };

  const renderAvatar = () => {
    if (user?.avatar) {
      return (
        <img
          src={user.avatar}
          alt="User Avatar"
          className="object-cover border-2 rounded-full w-9 h-9 border-emerald-400/40"
        />
      );
    } else if (user?.name) {
      return (
        <span className="flex items-center justify-center text-lg font-bold text-white border-2 rounded-full w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 border-emerald-400/40">
          {user.name.charAt(0).toUpperCase()}
        </span>
      );
    } else {
      return (
        <span className="flex items-center justify-center border-2 rounded-full w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 border-emerald-400/40">
          <User className="w-5 h-5 text-white" />
        </span>
      );
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="flex items-center justify-between h-16 rtl:flex-row-reverse">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 rtl:flex-row-reverse"
          >
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">EduLLM</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-4 rtl:flex-row-reverse">
            {auth && (
              <Button
                asChild
                variant="outline"
                className="text-white border-emerald-500 bg-emerald-500/10"
              >
                <Link href={`/${locale}/chat`} className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {t("chat.title") || "Chat"}
                </Link>
              </Button>
            )}

            {!auth ? (
              <Button
                asChild
                variant="ghost"
                className="transition-colors text-slate-400 hover:text-white"
              >
                <Link href={`/${locale}/auth/signin`}>
                  {t("nav.signIn")}
                </Link>
              </Button>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center justify-center overflow-hidden border-2 rounded-full w-9 h-9 border-emerald-400/40"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {renderAvatar()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 z-50 w-40 mt-2 border shadow-lg bg-slate-900 border-slate-700 rounded-xl">
                    <Link
                      href={`/${locale}/settings`}
                      className="block px-4 py-2 text-sm text-white hover:bg-slate-800 rounded-t-xl"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("nav.settings") || "Settings"}
                    </Link>
                    <button
                      className="block w-full px-4 py-2 text-sm text-left text-red-400 cursor-pointer hover:bg-slate-800 rounded-b-xl"
                      onClick={handleLogout}
                    >
                      {t("nav.logout") || "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Language Switcher */}
            <SimpleLanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
