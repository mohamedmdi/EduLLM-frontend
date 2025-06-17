"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Paperclip,
  Send,
  User,
  GraduationCap,
  X,
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
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const existingFiles = files ? Array.from(files) : [];

      const combined = existingFiles.concat(droppedFiles).slice(0, 3);
      const dt = new DataTransfer();
      combined.forEach((file) => dt.items.add(file));

      setFiles(dt.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const existingFiles = files ? Array.from(files) : [];

      const combined = existingFiles.concat(newFiles).slice(0, 3);
      const dt = new DataTransfer();
      combined.forEach((file) => dt.items.add(file));

      setFiles(dt.files);
    }
  };

  const removeFile = (index: number) => {
    if (files) {
      const dt = new DataTransfer();
      for (let i = 0; i < files.length; i++) {
        if (i !== index) {
          dt.items.add(files[i]);
        }
      }
      setFiles(dt.files);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, {
      experimental_attachments: files,
    });
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
                  Upload your study materials, ask questions, or explore new
                  topics. I'm here to help you succeed!
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleInputChange({
                          target: { value: prompt.text },
                        } as any)
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
                          {/* Render attachments as icons*/}
                          {message.experimental_attachments.map(
                            (attachment, index) => (
                              <Card
                                key={index}
                                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors p-3 rounded-xl w-fit"
                              >
                                <CardContent className="flex items-center gap-2">
                                  {attachment.contentType?.startsWith(
                                    "image/"
                                  ) ? (
                                    <Image
                                      src={attachment.url || ""}
                                      alt={attachment.name || "Attachment"}
                                      width={50}
                                      height={50}
                                      className="rounded-md"
                                    />
                                  ) : (
                                    <FileText className="h-5 w-5 text-slate-400" />
                                  )}
                                  <span className="text-sm text-slate-200">
                                    {attachment.name || "Attachment"}
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
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm p-6">
        <div className="max-w-4xl mx-auto">
          {/* File Preview */}
          {files && files.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3">
              {Array.from(files).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3 border border-slate-700"
                >
                  <FileText className="h-5 w-5 text-slate-400" />
                  <span className="truncate max-w-40 font-medium text-slate-200">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="cursor-pointer h-6 w-6 p-0 hover:bg-slate-700 rounded-full"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={onSubmit} className="flex gap-4 items-center">
            <div
              className={`flex-1 relative ${
                dragActive ? "ring-2 ring-emerald-500/50 bg-slate-800/50" : ""
              } rounded-2xl`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything about your studies..."
                className="pr-14 py-4 text-lg bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 rounded-2xl focus:border-emerald-500 focus:ring-0 h-12"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={files && files.length >= 3 || isLoading}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-slate-700 hover:p-0 hover:m-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5 text-slate-400" />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isLoading || (!input.trim() && !files?.length)}
              className="cursor-pointer px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-md text-lg font-medium"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*,application/pdf,.pdf,.doc,.docx,.txt"
            className="hidden"
          />

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
            <p className="text-sm text-slate-400">
              Upload images & PDFs • Drag & drop supported
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
