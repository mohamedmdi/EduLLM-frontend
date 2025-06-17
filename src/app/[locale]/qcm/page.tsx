"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileInputArea } from "@/components/ui/file-input-area";
import {
  ArrowLeft,
  CheckSquare,
  ListChecks,
  Target,
  Clock,
  HelpCircle,
  Zap,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';

export default function QCMPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();
  const locale = useLocale();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFilesChange = (newFiles: FileList | undefined) => {
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !files?.length) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setInput("");
      setFiles(undefined);
    }, 2000);
  };

  const quickPrompts = [
    {
      icon: CheckSquare,
      text: t('qcm.prompts.generate10'),
      color: "from-emerald-400 to-teal-400",
    },
    {
      icon: Target,
      text: t('qcm.prompts.fromDocument'),
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Clock,
      text: t('qcm.prompts.quick5min'),
      color: "from-cyan-400 to-blue-400",
    },
    {
      icon: Brain,
      text: t('qcm.prompts.advanced'),
      color: "from-violet-400 to-indigo-400",
    },
    {
      icon: HelpCircle,
      text: t('qcm.prompts.trueFalse'),
      color: "from-slate-600 to-slate-700",
    },
    {
      icon: Zap,
      text: t('qcm.prompts.mixed'),
      color: "from-teal-400 to-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <Link href={`/${locale}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {t('nav.back')}
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-2.5 rounded-xl">
                <ListChecks className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">{t('qcm.title')}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="max-w-4xl mx-auto py-6 space-y-6">
            {/* Welcome Section */}
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-4 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                <ListChecks className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('qcm.welcome')}
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                {t('qcm.description')}
              </p>              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={`${prompt.text}-${index}`}
                    onClick={() =>
                      handleInputChange({
                        target: { value: prompt.text },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    className={`bg-gradient-to-r ${prompt.color} text-white p-5 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-slate-900/50 flex items-center gap-4 ltr:text-left rtl:text-right min-h-[100px] group border border-white/10 rtl:flex-row-reverse`}
                  >
                    <div className="bg-white/20 p-2.5 rounded-xl group-hover:bg-white/30 transition-colors">
                      <prompt.icon className="h-6 w-6 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-sm font-semibold leading-relaxed">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-6">
          <FileInputArea
            input={input}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            files={files}
            onFilesChange={handleFilesChange}
            isLoading={isLoading}
            placeholder={t('qcm.placeholder')}
            acceptedFileTypes=".pdf,.doc,.docx,.txt"
          />
        </div>
      </div>
    </div>
  );
}
