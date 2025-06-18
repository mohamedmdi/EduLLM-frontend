"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FileInputArea } from "@/components/ui/file-input-area";
import {
  User,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Brain,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { useChat } from "@/hooks/useChat";
import { useTranslations, useLocale } from "next-intl";
import { isAuthenticated, getUserInfo } from "@/lib/auth-utils";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [authChecked, setAuthChecked] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const t = useTranslations();
  const locale = useLocale();

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to sign in page if not authenticated
      window.location.href = `/${locale}/auth/signin`;
      return;
    }
    
    const info = getUserInfo();
    setUserInfo(info);
    setAuthChecked(true);
  }, [locale]);  // Don't render anything until auth is checked
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  const handleFilesChange = (newFiles: FileList | undefined) => {
    setFiles(newFiles);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, {
      experimental_attachments: files,
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
    <div className="min-h-screen bg-slate-950">
      {" "}
      {/* Navigation */}
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4">
            <div className="max-w-4xl py-8 mx-auto space-y-6 pb-[180px]">
              {messages.length === 0 && (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-20 h-20 p-4 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="mb-3 text-3xl font-bold text-white">
                    {t("chat.welcome")}
                  </h2>
                  <p className="max-w-md mx-auto mb-8 text-lg text-slate-400">
                    {t("chat.description")}
                  </p>{" "}
                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={`${prompt.text}-${index}`}
                        onClick={() =>
                          handleInputChange({
                            target: { value: prompt.text },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className={`bg-gradient-to-r ${prompt.color} text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 rtl:flex-row-reverse`}
                      >
                        <prompt.icon className="w-5 h-5" />
                        {prompt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}{" "}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user"
                      ? "rtl:justify-start ltr:justify-end items-center rtl:flex-row-reverse"
                      : "rtl:justify-end ltr:justify-start rtl:flex-row-reverse"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] ${
                      message.role === "user"
                        ? "bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4"
                        : "bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4"
                    }`}
                  >
                    <div
                      className={`whitespace-pre-wrap text-base leading-relaxed rtl:text-right ${
                        message.role === "user"
                          ? "text-white"
                          : "text-slate-100"
                      }`}
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
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="flex-shrink-0 w-10 h-10 mt-1 border-2 border-emerald-400/20">
                      <AvatarFallback className="bg-gradient-to-r from-slate-700 to-slate-800">
                        <User className="w-5 h-5 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-4">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-4 border bg-slate-900/30 border-slate-800/50 rounded-2xl">
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
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-4xl p-6 mx-auto">
            <FileInputArea
              input={input}
              onInputChange={handleInputChange}
              onSubmit={onSubmit}
              files={files}
              onFilesChange={handleFilesChange}
              isLoading={isLoading}
              placeholder={t("chat.placeholder")}
              acceptedFileTypes="image/*,application/pdf,.pdf,.doc,.docx,.txt"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
