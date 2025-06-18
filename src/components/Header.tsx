"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import SimpleLanguageSwitcher from "./SimpleLanguageSwitcher";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <nav className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16 rtl:flex-row-reverse">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 rtl:flex-row-reverse"
          >
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">EduLLM</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-4 rtl:flex-row-reverse">
            {isHomePage && (
              <>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t("nav.signIn")}
                </Button>
                <Link href={`/${locale}/chat`}>
                  <Button className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-2 rounded-full">
                    {t("nav.getStarted")}
                  </Button>
                </Link>
              </>
            )}
            {/* Language Switcher */}
            <SimpleLanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
