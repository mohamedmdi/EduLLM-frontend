"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, User } from "lucide-react";
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
    window.location.href = `/${locale}/`;
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
      );    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-sm bg-background/80">
      <div className="max-w-6xl px-6 mx-auto">
        <div className={`flex items-center justify-between h-16${isRTL ? ' flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className={`flex items-center gap-3${isRTL ? ' flex-row-reverse' : ''}`}
          >            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              EduLLM
            </span>
          </Link>

          {/* Navigation Items */}
          <div className={`flex items-center gap-4${isRTL ? ' flex-row-reverse' : ''}`}>
            {/* Show Chat button for authenticated users (not on home page) */}
            
            {/* Show sign in and get started buttons on home page for non-authenticated users */}
            {isHomePage && (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="transition-colors border cursor-pointer text-muted-foreground hover:text-foreground "
                ></Button>
                <Link href={`/${locale}/chat`}>
                  <Button className="px-6 py-2 text-white rounded-full cursor-pointer bg-transparent border border-emerald-500 hover:bg-emerald-500 transition-colors">
                    {t("nav.getStarted")}
                  </Button>
                </Link>
              </>
            )}

            {/* Show Chat and QCM buttons for authenticated users (not on home page) */}
            {auth && !isHomePage && (
              <>
                <Link href={`/${locale}/chat`}>
                  <Button className="px-4 py-2 text-white rounded-full cursor-pointer bg-transparent border border-emerald-500 hover:bg-emerald-500 transition-colors">
                    {t("nav.chat") || "Chat"}
                  </Button>
                </Link>
                <Link href={`/${locale}/qcm`}>
                  <Button className="px-4 py-2 text-white rounded-full cursor-pointer bg-transparent border border-blue-500 hover:bg-blue-500 transition-colors">
                    {t("nav.qcm") || "QCM"}
                  </Button>
                </Link>
              </>
            )}

            {/* Show user avatar with dropdown for authenticated users */}
            {auth && (
              <div className="relative">
                <button
                  className="cursor-pointer flex items-center justify-center overflow-hidden border-2 rounded-full w-9 h-9 border-emerald-400/40"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {renderAvatar()}
                </button>
                {menuOpen && (
                  <div className={`absolute z-50 w-40 mt-2 border shadow-lg bg-card border-border rounded-xl${isRTL ? ' left-0' : ' right-0'}`}>
                    <Link
                      href={`/${locale}/settings`}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-t-xl"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("nav.settings") || "Settings"}
                    </Link>
                    <button
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
