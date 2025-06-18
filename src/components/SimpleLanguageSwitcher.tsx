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
        className="flex items-center gap-2 px-4 py-2 transition-all duration-300 border cursor-pointer group bg-slate-900/30 border-slate-800/50 rounded-xl hover:bg-slate-900/50 hover:border-slate-700/50 text-slate-300 hover:text-white"
      >
        <div className="bg-gradient-to-r from-emerald-400/20 to-teal-400/20 p-1.5 rounded-lg group-hover:from-emerald-400/30 group-hover:to-teal-400/30 transition-all duration-300">
          <Globe className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>{" "}
      {isOpen && (
        <div className="absolute w-56 mt-2 overflow-hidden duration-200 border shadow-xl top-full ltr:right-0 rtl:left-0 bg-slate-900 backdrop-blur-sm border-slate-800 rounded-2xl animate-in fade-in-0 zoom-in-95">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`cursor-pointer group w-full px-4 py-3 ltr:text-left rtl:text-right hover:bg-slate-800 transition-all duration-300 flex items-center gap-3 ${
                locale === lang.code
                  ? "bg-gradient-to-r from-slate-800 to-slate-700 text-white"
                  : "text-slate-300 hover:text-white"
              } ${lang.code === "ar" ? "flex-row-reverse" : ""} ${
                index === 0 ? "rounded-t-2xl" : ""
              } ${index === languages.length - 1 ? "rounded-b-2xl" : ""}`}
              dir={lang.code === "ar" ? "rtl" : "ltr"}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1 font-medium">{lang.name}</span>
              {locale === lang.code && (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
