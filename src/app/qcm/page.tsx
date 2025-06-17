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

export default function QCMPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

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
      text: "Generate 10 multiple choice questions",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Target,
      text: "Create exam from uploaded document",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Clock,
      text: "Quick 5-minute quiz",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Brain,
      text: "Advanced difficulty level",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: HelpCircle,
      text: "True/False questions",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Zap,
      text: "Mixed question types",
      color: "from-pink-500 to-pink-600",
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
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-md">
              <ListChecks className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EduLLM QCM</h1>
              <p className="text-sm text-slate-400">
                AI-Powered Exam Generator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="max-w-4xl mx-auto py-6 space-y-6">
            {/* Welcome Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-6">
                <ListChecks className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Create Custom QCM Exams
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
                Upload your study materials or provide topics to generate personalized multiple choice questions and exams.
              </p>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">                {quickPrompts.map((prompt, index) => (
                  <button
                    key={`${prompt.text}-${index}`}
                    onClick={() =>
                      handleInputChange({
                        target: { value: prompt.text },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    className={`bg-gradient-to-r ${prompt.color} text-white p-4 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg flex items-center gap-3 text-left`}
                  >
                    <prompt.icon className="h-6 w-6 flex-shrink-0" />
                    <span className="text-sm">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          <FileInputArea
            input={input}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            files={files}
            onFilesChange={handleFilesChange}
            isLoading={isLoading}
            placeholder="Describe the exam you want to create or drag & drop files here..."
            acceptedFileTypes=".pdf,.doc,.docx,.txt"
          />
        </div>
      </div>
    </div>
  );
}
