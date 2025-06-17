"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const [files, setFiles] = useState<FileList | undefined>(undefined);

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
      text: "Explain a concept",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Lightbulb,
      text: "Help with homework",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Brain,
      text: "Study strategies",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EduLLM</h1>
              <p className="text-sm text-slate-400">
                Your AI Learning Companion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="max-w-4xl mx-auto py-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Ready to Learn Together?
                </h2>                <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
                  Upload your study materials, ask questions, or explore new
                  topics. I&apos;m here to help you succeed!
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={`${prompt.text}-${index}`}
                      onClick={() =>                        handleInputChange({
                          target: { value: prompt.text },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                      className={`bg-gradient-to-r ${prompt.color} text-white px-6 py-3 rounded-xl font-medium transition-transform flex items-center gap-2`}
                    >
                      <prompt.icon className="h-5 w-5" />
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user"
                    ? "justify-end items-center"
                    : "justify-start"
                }`}
              >
                <div
                  className={` ${
                    message.role === "user" ? "bg- border-emerald-500/20" : ""
                  }`}
                >
                  <div className="">
                    <div
                      className={`whitespace-pre-wrap text-base leading-relaxed ${
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
                          {/* Render attachments as icons*/}                          {message.experimental_attachments.map(
                            (attachment, index) => (
                              <Card
                                key={`${attachment.name}-${attachment.url}-${index}`}
                                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors p-3 rounded-xl w-fit"
                              >
                                <CardContent className="flex items-center gap-2">
                                  {attachment.contentType?.startsWith(
                                    "image/"
                                  ) ? (                                    <Image
                                      src={attachment.url ?? ""}
                                      alt={attachment.name ?? "Attachment"}
                                      width={50}
                                      height={50}
                                      className="rounded-md"
                                    />
                                  ) : (
                                    <FileText className="h-5 w-5 text-slate-400" />
                                  )}                                  <span className="text-sm text-slate-200">
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
                </div>

                {message.role === "user" && (
                  <Avatar className="h-10 w-10 mt-1 border-2 border-emerald-500/20">
                    <AvatarFallback className="bg-gradient-to-r from-slate-600 to-slate-700">
                      <User className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="bg-slate-800/50 border-slate-700">
                  <div className="p-6">
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
              </div>
            )}
          </div>
        </ScrollArea>
      </div>      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          <FileInputArea
            input={input}
            onInputChange={handleInputChange}
            onSubmit={onSubmit}
            files={files}
            onFilesChange={handleFilesChange}
            isLoading={isLoading}
            placeholder="Ask me anything about your studies..."
            acceptedFileTypes="image/*,application/pdf,.pdf,.doc,.docx,.txt"
          />
        </div>
      </div>
    </div>
  );
}
