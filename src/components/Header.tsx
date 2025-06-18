"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, User, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import SimpleLanguageSwitcher from "./SimpleLanguageSwitcher";
import { useEffect, useState } from "react";
import { isAuthenticated, getUserInfo, clearUserAuth } from "@/lib/auth-utils";
import { SimpleThemeToggle } from "./ThemeSwitcher";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if the current locale is RTL - only after mount to avoid hydration issues
  const isRTL = mounted && locale === 'ar';

  // Check if we're on the home page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    setMounted(true);
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
  };  return (
    <nav className="border-b border-border backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`flex justify-between items-center h-16${isRTL ? ' flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className={`flex items-center gap-3${isRTL ? ' flex-row-reverse' : ''}`}
          >
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground">EduLLM</span>
          </Link>          {/* Navigation Items */}
          <div className={`flex items-center gap-4${isRTL ? ' flex-row-reverse' : ''}`}>
            {/* Show Chat button for authenticated users (not on home page) */}
            {auth && !isHomePage && (
              <Button
                asChild
                variant="outline"
                className="text-foreground border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
              >
                <Link href={`/${locale}/chat`} className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {t("chat.title") || "Chat"}
                </Link>
              </Button>
            )}

            {/* Show sign in and get started buttons on home page for non-authenticated users */}
            {isHomePage && !auth && (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Link href={`/${locale}/auth/signin`}>
                    {t("nav.signIn")}
                  </Link>
                </Button>
                <Link href={`/${locale}/chat`}>
                  <Button className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-2 rounded-full">
                    {t("nav.getStarted")}
                  </Button>
                </Link>
              </>
            )}

            {/* Show sign in button on non-home pages for non-authenticated users */}
            {!isHomePage && !auth && (
              <Button
                asChild
                variant="ghost"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Link href={`/${locale}/auth/signin`}>
                  {t("nav.signIn")}
                </Link>
              </Button>
            )}

            {/* Show user avatar with dropdown for authenticated users */}
            {auth && (
              <div className="relative">
                <button
                  className="flex items-center justify-center overflow-hidden border-2 rounded-full w-9 h-9 border-emerald-400/40"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {renderAvatar()}
                </button>                {menuOpen && (
                  <div className={`absolute z-50 w-40 mt-2 border shadow-lg bg-card border-border rounded-xl${isRTL ? ' left-0' : ' right-0'}`}>
                    <Link
                      href={`/${locale}/settings`}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-t-xl"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("nav.settings") || "Settings"}
                    </Link>                    <button
                      className={`block w-full px-4 py-2 text-sm text-red-400 cursor-pointer hover:bg-muted rounded-b-xl${isRTL ? ' text-right' : ' text-left'}`}
                      onClick={handleLogout}
                    >
                      {t("nav.logout") || "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Theme Switcher */}
            <SimpleThemeToggle />
            
            {/* Language Switcher */}
            <SimpleLanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
