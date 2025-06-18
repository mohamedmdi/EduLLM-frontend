"use client";

import { Globe, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function SimpleLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer group flex items-center gap-2 px-4 py-2 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300 text-slate-300 hover:text-white"
      >
        <div className="bg-gradient-to-r from-emerald-400/20 to-teal-400/20 p-1.5 rounded-lg group-hover:from-emerald-400/30 group-hover:to-teal-400/30 transition-all duration-300">
          <Globe className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="font-medium text-sm">{currentLanguage?.flag}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>{" "}
      {isOpen && (
        <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-56 bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`cursor-pointer group w-full px-4 py-3 ltr:text-left rtl:text-right hover:bg-slate-800/50 transition-all duration-300 flex items-center gap-3 ${
                locale === lang.code
                  ? "bg-gradient-to-r from-slate-800/50 to-slate-700/50 text-white"
                  : "text-slate-300 hover:text-white"
              } ${lang.code === "ar" ? "flex-row-reverse" : ""} ${
                index === 0 ? "rounded-t-2xl" : ""
              } ${index === languages.length - 1 ? "rounded-b-2xl" : ""}`}
              dir={lang.code === "ar" ? "rtl" : "ltr"}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium flex-1">{lang.name}</span>
              {locale === lang.code && (
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
