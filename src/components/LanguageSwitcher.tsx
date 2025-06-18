'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);  const switchLanguage = (newLocale: string) => {
    // Use router.push with the new locale path
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === locale);
  
  return (
    <div className="relative language-switcher">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900/80 backdrop-blur-sm border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <Globe className="h-4 w-4 mr-2" />
        {currentLanguage?.flag} {currentLanguage?.name}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors flex items-center gap-3 ${
                locale === lang.code 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300'
              } ${lang.code === 'ar' ? 'text-right' : ''}`}
              dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
