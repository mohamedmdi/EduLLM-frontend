"use client";

import type React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useChat } from "@/hooks/useChat";
import AuthGuard from "@/components/auth/AuthGuard";
import ReactMarkdown from "react-markdown";

// Lazy load heavy components
const ScrollArea = dynamic(
  () =>
    import("@/components/ui/scroll-area").then((mod) => ({
      default: mod.ScrollArea,
    })),
  {
    loading: () => <div className="h-full overflow-auto" />,
  }
);

const FileInputArea = dynamic(
  () =>
    import("@/components/ui/file-input-area").then((mod) => ({
      default: mod.FileInputArea,
    })),
  {
    loading: () => (
      <div className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
    ),
  }
);

const AnimatedSection = dynamic(
  () =>
    import("@/components/PageTransition").then((mod) => ({
      default: mod.AnimatedSection,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-slate-800/20 rounded-lg h-20" />
    ),
  }
);

const HoverCard = dynamic(
  () =>
    import("@/components/PageTransition").then((mod) => ({
      default: mod.HoverCard,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-slate-800/20 rounded-lg h-32" />
    ),
  }
);

const AnimatedButton = dynamic(
  () =>
    import("@/components/PageTransition").then((mod) => ({
      default: mod.AnimatedButton,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-slate-800/20 rounded-lg h-10 w-24" />
    ),
  }
);

// Lazy load icons
const GraduationCap = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.GraduationCap }))
);
const BookOpen = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.BookOpen }))
);
const Lightbulb = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Lightbulb }))
);
const Brain = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Brain }))
);
const User = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.User }))
);
const FileText = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.FileText }))
);

// Lazy load UI components
const Avatar = dynamic(() =>
  import("@/components/ui/avatar").then((mod) => ({ default: mod.Avatar }))
);
const AvatarFallback = dynamic(() =>
  import("@/components/ui/avatar").then((mod) => ({
    default: mod.AvatarFallback,
  }))
);
const Card = dynamic(() =>
  import("@/components/ui/card").then((mod) => ({ default: mod.Card }))
);
const CardContent = dynamic(() =>
  import("@/components/ui/card").then((mod) => ({ default: mod.CardContent }))
);

export default function ChatPage() {
  return (
    <AuthGuard loadingVariant="chat">
      <ChatPageContent />
    </AuthGuard>
  );
}

function ChatPageContent() {  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    isSubmitting,
  } = useChat();
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const t = useTranslations();
  const locale = useLocale();



  const handleFilesChange = (newFiles: FileList | undefined) => {
    setFiles(newFiles);
  };  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, {
      experimental_attachments: files,
      locale: locale // Pass the current language to include hidden language instruction
    });
    setFiles(undefined);
  };

  const quickPrompts = [
    {
      icon: BookOpen,
      text: t("chat.prompts.explain"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Lightbulb,
      text: t("chat.prompts.homework"),
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Brain,
      text: t("chat.prompts.strategies"),
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {" "}
      {/* Navigation */}
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4">
            <div className="max-w-4xl py-8 mx-auto space-y-6 pb-[180px]">
              {messages.length === 0 && (
                <AnimatedSection delay={0.2}>
                  <div className="py-12 text-center">
                    <AnimatedSection delay={0.4}>
                      <div className="flex items-center justify-center w-20 h-20 p-4 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl">
                        <GraduationCap className="w-10 h-10 text-white" />
                      </div>
                    </AnimatedSection>{" "}
                    <AnimatedSection delay={0.6}>
                      <h2 className="mb-3 text-3xl font-bold text-foreground">
                        {t("chat.welcome")}
                      </h2>
                    </AnimatedSection>
                    <AnimatedSection delay={0.8}>
                      <p className="max-w-md mx-auto mb-8 text-lg text-muted-foreground">
                        {t("chat.description")}
                      </p>
                    </AnimatedSection>
                    {/* Quick Action Buttons */}
                    <AnimatedSection delay={1.0}>
                      <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {quickPrompts.map((prompt, index) => (
                          <HoverCard
                            key={`${prompt.text}-${index}`}
                            scale={1.05}
                          >
                            {" "}
                            <AnimatedButton
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
              )}{" "}
              {messages.map((message) => {
                const isRTL = locale === "ar";
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
                    )}{" "}
                    <div className="max-w-[80%] bg-card border border-border rounded-2xl p-4">
                      <div
                        className={`whitespace-pre-wrap text-base leading-relaxed ${
                          isRTL ? "text-right" : "text-left"
                        } text-card-foreground`}
                      >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      {/* Render attachments */}{" "}
                      {message.experimental_attachments && (
                        <div className="mt-4 space-y-3">
                          <div className="flex flex-wrap gap-3 justify-start">
                            {message.experimental_attachments.map(
                              (attachment, index) => (
                                <Card
                                  key={`${attachment.name}-${attachment.url}-${index}`}
                                  className="p-3 transition-colors bg-card border-border hover:bg-accent rounded-xl w-fit"
                                >
                                  <CardContent className="flex items-center gap-2 flex-row">
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
                                      <FileText className="w-5 h-5 text-muted-foreground" />
                                    )}
                                    <span className="text-sm text-card-foreground">
                                      {attachment.name ?? "Attachment"}
                                    </span>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>{" "}
                    {isUser && (
                      <Avatar className="flex-shrink-0 w-10 h-10 mt-1 border-2 border-emerald-400/20">
                        <AvatarFallback className="bg-secondary">
                          <User className="w-5 h-5 text-secondary-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}{" "}
              {isLoading && (
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-4 border bg-card border-border rounded-2xl">
                    <div className="flex space-x-2">
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
        </div>{" "}
        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-4xl p-6 mx-auto">
            <FileInputArea
              input={input}
              onInputChange={handleInputChange}
              onSubmit={onSubmit}
              files={files}
              onFilesChange={handleFilesChange}
              isLoading={isLoading || isSubmitting}
              placeholder={t("chat.placeholder")}
              acceptedFileTypes="image/*,application/pdf,.pdf,.doc,.docx,.txt"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
