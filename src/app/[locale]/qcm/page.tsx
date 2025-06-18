"use client";

import type React from "react";
import { useState } from "react";
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
  GraduationCap,
  FileText,
  User,
} from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useChat } from "@/hooks/useChat";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

export default function QCMPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const t = useTranslations();
  const locale = useLocale();

  const handleFilesChange = (newFiles: FileList | undefined) => {
    setFiles(newFiles);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, {
      experimental_attachments: files,
    });
    setFiles(undefined);
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
    <div className="min-h-screen bg-slate-950">
      {" "}
      {/* Navigation */}
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="max-w-4xl mx-auto py-8 space-y-6 pb-40">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-4 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-6">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  {t("chat.welcome")}
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
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
                      <prompt.icon className="h-5 w-5" />
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
                    <GraduationCap className="h-5 w-5 text-white" />
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
                      message.role === "user" ? "text-white" : "text-slate-100"
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
                              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors p-3 rounded-xl w-fit"
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
                                  <FileText className="h-5 w-5 text-slate-400" />
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
                  <Avatar className="h-10 w-10 mt-1 border-2 border-emerald-400/20 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-slate-700 to-slate-800">
                      <User className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
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
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-2">
          <FileInputArea
            input={input}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            files={files}
            onFilesChange={handleFilesChange}
            isLoading={isLoading}
            placeholder={t("qcm.placeholder")}
            acceptedFileTypes=".pdf,.doc,.docx,.txt"
          />
        </div>
      </div>
    </div>
  );
}
