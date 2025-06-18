
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useChat } from "@/hooks/useChat";
import { isAuthenticated, getUserInfo } from "@/lib/auth-utils";
import { Loading } from "@/components/ui/loading";

// Lazy load heavy components
const ScrollArea = dynamic(() => import("@/components/ui/scroll-area").then(mod => ({ default: mod.ScrollArea })), {
  loading: () => <div className="h-full overflow-auto" />
});

const FileInputArea = dynamic(() => import("@/components/ui/file-input-area").then(mod => ({ default: mod.FileInputArea })), {
  loading: () => <div className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
});

const AnimatedSection = dynamic(() => import('@/components/PageTransition').then(mod => ({ default: mod.AnimatedSection })), {
  loading: () => <div className="animate-pulse bg-slate-800/20 rounded-lg h-20" />
});

const HoverCard = dynamic(() => import('@/components/PageTransition').then(mod => ({ default: mod.HoverCard })), {
  loading: () => <div className="animate-pulse bg-slate-800/20 rounded-lg h-32" />
});

const AnimatedButton = dynamic(() => import('@/components/PageTransition').then(mod => ({ default: mod.AnimatedButton })), {
  loading: () => <div className="animate-pulse bg-slate-800/20 rounded-lg h-10 w-24" />
});

// Lazy load icons
const CheckSquare = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckSquare })));
const Target = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })));
const Clock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })));
const HelpCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.HelpCircle })));
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })));
const Brain = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Brain })));
const GraduationCap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GraduationCap })));
const FileText = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileText })));
const User = dynamic(() => import('lucide-react').then(mod => ({ default: mod.User })));

// Lazy load UI components
const Card = dynamic(() => import("@/components/ui/card").then(mod => ({ default: mod.Card })));
const CardContent = dynamic(() => import("@/components/ui/card").then(mod => ({ default: mod.CardContent })));
const Avatar = dynamic(() => import("@/components/ui/avatar").then(mod => ({ default: mod.Avatar })));
const AvatarFallback = dynamic(() => import("@/components/ui/avatar").then(mod => ({ default: mod.AvatarFallback })));

export default function QCMPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, isSubmitting } =
    useChat();const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [authChecked, setAuthChecked] = useState(false);

  const t = useTranslations();
  const locale = useLocale();
  // Check authentication on component mount
  useEffect(() => {    // QCM is now accessible to both authenticated and guest users
    const isAuth = isAuthenticated();
    if (isAuth) {
      getUserInfo(); // Just verify auth, but don't store the info
    }
    // Guest users are automatically allowed
    setAuthChecked(true);
  }, [locale]);  // Don't render anything until auth is checked
  if (!authChecked) {
    return <Loading variant="chat" />;
  }
  const handleFilesChange = (newFiles: FileList | undefined) => {
    setFiles(newFiles);
  };

  const quickPrompts = [
    {
      icon: CheckSquare,
      text: t("qcm.prompts.generate10"),
      color: "from-emerald-400 to-teal-400",
    },
    {
      icon: Target,
      text: t("qcm.prompts.fromDocument"),
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Clock,
      text: t("qcm.prompts.quick5min"),
      color: "from-cyan-400 to-blue-400",
    },
    {
      icon: Brain,
      text: t("qcm.prompts.advanced"),
      color: "from-violet-400 to-indigo-400",
    },
    {
      icon: HelpCircle,
      text: t("qcm.prompts.trueFalse"),
      color: "from-slate-600 to-slate-700",
    },
    {
      icon: Zap,
      text: t("qcm.prompts.mixed"),
      color: "from-teal-400 to-emerald-400",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4"><div className="max-w-4xl py-8 pb-40 mx-auto space-y-6">
            {messages.length === 0 && (
              <AnimatedSection delay={0.2}>
                <div className="py-12 text-center">
                  <AnimatedSection delay={0.4}>
                    <div className="flex items-center justify-center w-20 h-20 p-4 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                  </AnimatedSection>                  <AnimatedSection delay={0.6}>
                    <h2 className="mb-3 text-3xl font-bold text-white">
                      {t("qcm.welcome")}
                    </h2>
                  </AnimatedSection>
                  <AnimatedSection delay={0.8}>
                    <p className="max-w-md mx-auto mb-8 text-lg text-slate-400">
                      {t("qcm.description")}
                    </p>
                  </AnimatedSection>
                  {/* Quick Action Buttons */}
                  <AnimatedSection delay={1.0}>
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                      {quickPrompts.map((prompt, index) => (
                        <HoverCard key={`${prompt.text}-${index}`} scale={1.05}>                            <AnimatedButton
                            onClick={() =>
                              handleInputChange({
                                target: { value: prompt.text },
                              } as React.ChangeEvent<HTMLInputElement>)
                            }
                            className={`bg-gradient-to-r ${prompt.color} text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2`}
                          >
                            <prompt.icon className="w-5 h-5" />
                            {prompt.text}
                          </AnimatedButton>
                        </HoverCard>
                      ))}
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedSection>
            )}{" "}            {messages.map((message) => {
              const isRTL = locale === 'ar';
              const isUser = message.role === "user";
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-4 items-start ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >{!isUser && (
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="max-w-[80%] bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                    <div
                      className={`whitespace-pre-wrap text-base leading-relaxed ${
                        isRTL ? "text-right" : "text-left"
                      } ${isUser ? "text-white" : "text-slate-100"}`}
                    >
                    {message.content}
                  </div>

                  {/* Render attachments */}
                  {message.experimental_attachments && (
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap gap-3">
                        {message.experimental_attachments.map(
                          (attachment, index) => (
                            <Card
                              key={`${attachment.name}-${attachment.url}-${index}`}
                              className="p-3 transition-colors bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 rounded-xl w-fit"
                            >
                              <CardContent className="flex items-center gap-2">
                                {attachment.contentType?.startsWith(
                                  "image/"
                                ) ? (
                                  <Image
                                    src={attachment.url ?? ""}
                                    alt={attachment.name ?? "Attachment"}
                                    width={50}
                                    height={50}
                                    className="rounded-md"
                                  />
                                ) : (
                                  <FileText className="w-5 h-5 text-slate-400" />
                                )}
                                <span className="text-sm text-slate-200">
                                  {attachment.name ?? "Attachment"}
                                </span>
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>
                    </div>                  )}
                </div>

                {isUser && (
                  <Avatar className="flex-shrink-0 w-10 h-10 mt-1 border-2 border-emerald-400/20">
                    <AvatarFallback className="bg-gradient-to-r from-slate-700 to-slate-800">
                      <User className="w-5 h-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
            })}
            {isLoading && (
              <div className={`flex gap-4 items-start ${locale === "ar" ? "flex-row-reverse" : "flex-row"}`} dir={locale === "ar" ? "rtl" : "ltr"}>
                <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="p-4 border bg-slate-900/30 border-slate-800/50 rounded-2xl">
                  <div className={`flex ${locale === "ar" ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl px-6 pt-6 pb-2 mx-auto">          <FileInputArea
            input={input}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            files={files}
            onFilesChange={handleFilesChange}
            isLoading={isLoading || isSubmitting}
            placeholder={t("qcm.placeholder")}
            acceptedFileTypes=".pdf,.doc,.docx,.txt"
          />
        </div>
      </div>
    </div>
  );
}
