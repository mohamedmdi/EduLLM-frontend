"use client";

import type React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useChat } from "@/hooks/useChat";
import { getUserId, isAuthenticated, generateUserId, setUserAuth } from "@/lib/auth-utils";
import AuthGuard from "@/components/auth/AuthGuard";

// Import commonly used icons directly (not dynamically)
import {
  CheckSquare, Target, Clock, HelpCircle, Zap, Brain,
  GraduationCap, FileText, User, BookOpen, Trophy,
  Settings, Star, Layers, BarChart, BookMarked,
  Lightbulb, PenTool, ArrowLeft, Download
} from 'lucide-react';

// Only lazy load heavy UI components
const ScrollArea = dynamic(() => import("@/components/ui/scroll-area").then(mod => ({ default: mod.ScrollArea })), {
  loading: () => <div className="h-full overflow-auto p-4" />
});

const FileInputArea = dynamic(() => import("@/components/ui/file-input-area").then(mod => ({ default: mod.FileInputArea })), {
  loading: () => <div className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />,
  ssr: false
});

// Import animation components directly since they're used frequently
import { AnimatedSection, HoverCard, AnimatedButton } from '@/components/PageTransition';

// Import UI components directly (they're lightweight)
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function QCMPage() {
  return (
    <AuthGuard loadingVariant="chat">
      <QCMPageContent />
    </AuthGuard>
  );
}

function QCMPageContent() {
  const { messages, handleSubmit, isLoading, isSubmitting, clearMessages } =
    useChat();
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [followUpInput, setFollowUpInput] = useState("");

  const t = useTranslations();
  const locale = useLocale();

  // Reset processing state when messages arrive
  useEffect(() => {
    if (messages.length > 0 && isProcessingPrompt) {
      setIsProcessingPrompt(false);
    }
  }, [messages.length, isProcessingPrompt]);

  const handleFilesChange = (newFiles: FileList | undefined) => {
    setFiles(newFiles);
  };

  const handleBackToPrompts = () => {
    clearMessages();
    setIsProcessingPrompt(false);
  };const handlePromptWithFiles = async (promptText: string, attachedFiles?: FileList) => {
    if (!promptText.trim() && !attachedFiles?.length) return;    // Set processing state immediately to trigger UI change
    setIsProcessingPrompt(true);    // Add language instruction to the prompt - Language-specific for QCM
    const languageInstructions = {
      en: "Please respond in English.",
      fr: "Veuillez répondre en français.",
      ar: "يرجى الرد باللغة العربية."
    };
    
    const languageInstruction = languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.en;
    const enhancedPrompt = `${promptText}\n\n${languageInstruction}`;

    // If PDF generation is enabled, handle it differently
    if (generatePDF) {
      await handlePDFGeneration(enhancedPrompt, attachedFiles);
      return;
    }

    // Create a synthetic event for handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
      currentTarget: {}
    } as React.FormEvent<HTMLFormElement>;    // Use the handleSubmit function with proper event and options
    await handleSubmit(syntheticEvent, {
      experimental_attachments: attachedFiles,
      customText: enhancedPrompt,
      locale: locale // Pass the current language to the backend
    });
  };

  const handlePDFGeneration = async (promptText: string, attachedFiles?: FileList) => {
    try {
      let userId = getUserId();
      if (!userId) {
        if (!isAuthenticated()) {
          userId = generateUserId('guest');
          setUserAuth(userId, 'guest');
        } else {
          console.error("User authentication failed");
          return;
        }
      }      const formData = new FormData();
      formData.append("query", promptText.trim());
      formData.append("userId", userId);
      formData.append("generatePDF", "true");
      formData.append("locale", locale); // Add language preference

      if (attachedFiles) {
        Array.from(attachedFiles).forEach((file) => {
          formData.append("file", file);
        });      }

      // Call the API for PDF generation
      const res = await fetch("/api/qcm", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const blob = await res.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qcm-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);        // Also show the text response
        const languageInstructions = {
          en: "Please respond in English.",
          fr: "Veuillez répondre en français.",
          ar: "يرجى الرد باللغة العربية."
        };
        const languageInstruction = languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.en;
        
        handleSubmit({
          preventDefault: () => {},
        } as React.FormEvent, {
          experimental_attachments: attachedFiles,
          customText: promptText + " (PDF generated and downloaded)\n\n" + languageInstruction,
          locale: locale
        });      } else {
        console.error("PDF generation failed");
        // Fall back to regular chat response
        const languageInstructions = {
          en: "Please respond in English.",
          fr: "Veuillez répondre en français.",
          ar: "يرجى الرد باللغة العربية."
        };
        const languageInstruction = languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.en;
        
        handleSubmit({
          preventDefault: () => {},
        } as React.FormEvent, {
          experimental_attachments: attachedFiles,
          customText: promptText + " (PDF generation failed - showing text response)\n\n" + languageInstruction,
          locale: locale
        });
      }    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fall back to regular chat response
      const languageInstructions = {
        en: "Please respond in English.",
        fr: "Veuillez répondre en français.",
        ar: "يرجى الرد باللغة العربية."
      };
      const languageInstruction = languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.en;
      
      handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent, {
        experimental_attachments: attachedFiles,
        customText: promptText + " (PDF generation failed - showing text response)\n\n" + languageInstruction,
        locale: locale
      });
    }
  };

  const handlePromptClick = (promptText: string) => {
    handlePromptWithFiles(promptText, files);
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
    {
      icon: BookOpen,
      text: t("qcm.prompts.comprehensive"),
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Trophy,
      text: t("qcm.prompts.exam"),
      color: "from-amber-400 to-orange-400",
    },
    {
      icon: Settings,
      text: t("qcm.prompts.custom"),
      color: "from-gray-500 to-gray-600",
    },
    {
      icon: Star,
      text: t("qcm.prompts.beginner"),
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: Layers,
      text: t("qcm.prompts.multipleChoice"),
      color: "from-indigo-400 to-purple-400",
    },
    {
      icon: BarChart,
      text: t("qcm.prompts.practice"),
      color: "from-red-400 to-pink-400",
    },
    {
      icon: BookMarked,
      text: t("qcm.prompts.revision"),
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Lightbulb,
      text: t("qcm.prompts.conceptual"),
      color: "from-yellow-400 to-amber-400",
    },
    {
      icon: PenTool,
      text: t("qcm.prompts.essay"),
      color: "from-pink-400 to-rose-400",
    },
  ];return (
    <div className="min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">        <ScrollArea className="h-full px-4">
          <div className="max-w-7xl py-8 pb-40 mx-auto space-y-12">
            {messages.length === 0 && !isProcessingPrompt && (
              <AnimatedSection delay={0.2}>
                <div className="text-center space-y-8">
                  {/* Header Section */}
                  <AnimatedSection delay={0.4}>
                    <div className="flex items-center justify-center w-20 h-20 p-4 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                  </AnimatedSection>
                    <AnimatedSection delay={0.6}>
                    <h1 className="text-4xl font-bold text-white mb-4">
                      {t("qcm.welcome")}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
                      {t("qcm.description")}
                    </p>
                  </AnimatedSection>
                  
                  {/* Upload Section */}
                  <AnimatedSection delay={0.8}>
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-semibold text-white mb-2">
                          Upload Study Materials
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                          Upload your documents to generate customized questions based on your study materials
                        </p>
                      </div>
                      <div className="w-full max-w-4xl mx-auto">                        <FileInputArea
                          input=""
                          onInputChange={() => {}}
                          onSubmit={(e) => {
                            e.preventDefault();
                            // Only submit if there are files, since this is the upload-only area
                            if (files && files.length > 0) {
                              handleSubmit(e, {
                                experimental_attachments: files
                              });
                            }
                          }}
                          files={files}
                          onFilesChange={handleFilesChange}
                          isLoading={isLoading || isSubmitting}
                          placeholder={t("qcm.placeholder")}
                          acceptedFileTypes=".pdf,.doc,.docx,.txt"
                          className="w-full"
                          hideInput={true}
                        />
                      </div>
                    </div>
                  </AnimatedSection>
                  
                  {/* Quick Action Prompts Section */}
                  <AnimatedSection delay={1.0}>
                    <div className="space-y-6">                      <div className="text-center">
                        <h2 className="text-2xl font-semibold text-white">
                          Quick Start Options
                        </h2>
                        <div className="flex flex-col items-center gap-3 mt-4">
                          {files && files.length > 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm">
                              <FileText className="w-4 h-4" />
                              <span>{files.length} file{files.length > 1 ? 's' : ''} ready - Click any prompt to generate with your files</span>
                            </div>
                          )}
                          
                          {/* PDF Generation Toggle */}
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800/30 border border-slate-700/50 rounded-full">
                            <Download className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300">Generate PDF</span>
                            <button
                              onClick={() => setGeneratePDF(!generatePDF)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                                generatePDF ? 'bg-emerald-500' : 'bg-slate-600'
                              }`}
                              role="switch"
                              aria-checked={generatePDF}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  generatePDF ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {quickPrompts.map((prompt, index) => (
                          <HoverCard key={`${prompt.text}-${index}`} scale={1.02}>
                            <button
                              type="button"
                              onClick={() => handlePromptClick(prompt.text)}
                              className={`w-full h-40 bg-gradient-to-br ${prompt.color} cursor-pointer group transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/20 rounded-2xl p-5 border border-emerald-100/10 dark:border-slate-700/50 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:-translate-y-1 flex flex-col justify-between`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                                  <prompt.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white font-semibold text-base mb-2 leading-tight line-clamp-2">
                                    {prompt.text.split(' ').slice(0, 4).join(' ')}
                                  </h3>
                                </div>
                              </div>
                              <div className="mt-auto">
                                <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
                                  {prompt.text.split(' ').slice(4).join(' ') || t("qcm.clickToUse")}
                                </p>
                              </div>
                            </button>
                          </HoverCard>
                        ))}                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedSection>            )}
            
            {/* Show loading state when processing prompt but no messages yet */}
            {isProcessingPrompt && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <div className="flex items-center justify-center w-20 h-20 p-4 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-white">Processing your request...</h2>                  <p className="text-slate-400 max-w-md mx-auto">
                    We&apos;re analyzing your materials and generating customized questions. This may take a moment.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce"></div>
                  <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            )}

            {/* Back Button and PDF Toggle - Show when there are messages */}
            {(messages.length > 0 || isProcessingPrompt) && (
              <div className="flex items-center justify-between">                <AnimatedButton
                  onClick={handleBackToPrompts}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Prompts</span>
                </AnimatedButton>
                
                {/* PDF Generation Toggle */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Generate PDF</span>
                  <button
                    onClick={() => setGeneratePDF(!generatePDF)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      generatePDF ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                    role="switch"
                    aria-checked={generatePDF}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        generatePDF ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
            
            {/* Messages Section */}
            {messages.map((message) => {
              const isRTL = locale === 'ar';
              const isUser = message.role === "user";
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-4 items-start ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="max-w-[80%] bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
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
                                  {attachment.contentType?.startsWith("image/") ? (
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
                      </div>
                    )}
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
            
            {/* Loading State */}
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
                    ></div>                    <div
                      className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Input Field for Continued Conversation - Show when there are messages */}
            {messages.length > 0 && (
              <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-slate-700/50 p-4">
                <div className="max-w-7xl mx-auto">                  <FileInputArea
                    input={followUpInput}
                    onInputChange={(e) => setFollowUpInput(e.target.value)}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (followUpInput?.trim()) {
                        // Add language instruction to follow-up questions
                        const languageInstructions = {
                          en: "Please respond in English.",
                          fr: "Veuillez répondre en français.",
                          ar: "يرجى الرد باللغة العربية."
                        };
                        const languageInstruction = languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.en;
                        const enhancedQuery = `${followUpInput}\n\n${languageInstruction}`;
                        
                        const syntheticEvent = {
                          preventDefault: () => {},
                          target: {},
                          currentTarget: {}
                        } as React.FormEvent<HTMLFormElement>;
                        
                        handleSubmit(syntheticEvent, {
                          experimental_attachments: files,
                          customText: enhancedQuery,
                          locale: locale
                        });
                        
                        // Reset the input
                        setFollowUpInput("");
                      }
                    }}
                    files={files}
                    onFilesChange={handleFilesChange}
                    isLoading={isLoading || isSubmitting}
                    placeholder={t("chat.placeholder")}
                    acceptedFileTypes=".pdf,.doc,.docx,.txt"
                    className="w-full"
                    hideInput={false}
                  />
                  
                  {/* PDF Generation Toggle for follow-up */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-slate-500">
                      Continue the conversation or ask follow-up questions
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                      <Download className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-300">PDF</span>
                      <button
                        onClick={() => setGeneratePDF(!generatePDF)}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 focus:ring-offset-slate-900 ${
                          generatePDF ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                        role="switch"
                        aria-checked={generatePDF}
                      >
                        <span
                          className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                            generatePDF ? 'translate-x-4' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
