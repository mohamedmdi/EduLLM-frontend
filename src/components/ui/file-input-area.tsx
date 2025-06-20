"use client";

import type React from "react";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, X, FileText } from "lucide-react";

interface FileInputAreaProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  files?: FileList;
  onFilesChange: (files: FileList | undefined) => void;
  isLoading?: boolean;
  placeholder?: string;
  acceptedFileTypes?: string;
  disabled?: boolean;
  className?: string;
  hideInput?: boolean; // New prop to hide the input field
}

export function FileInputArea({
  input,
  onInputChange,
  onSubmit,
  files,
  onFilesChange,
  isLoading = false,
  placeholder = "Type your message or drag & drop files here...",
  acceptedFileTypes = ".pdf,.doc,.docx,.txt",
  disabled = false,
  className = "",
  hideInput = false, // Default to false for backward compatibility
}: Readonly<FileInputAreaProps>) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === 'ar';

  // Arabic character validation
  const isArabicChar = (char: string) => {
    // Arabic Unicode ranges:
    // U+0600-U+06FF: Arabic
    // U+0750-U+077F: Arabic Supplement
    // U+08A0-U+08FF: Arabic Extended-A
    // U+FB50-U+FDFF: Arabic Presentation Forms-A
    // U+FE70-U+FEFF: Arabic Presentation Forms-B
    // Also allow spaces, numbers, and common punctuation
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s0-9.,!?()-]/;
    return arabicRegex.test(char);
  };

  const validateArabicInput = (text: string) => {
    if (!isRTL) return text; // No validation for non-Arabic locales
    
    // Filter out non-Arabic characters
    return text.split('').filter(char => isArabicChar(char)).join('');
  };

  const handleValidatedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalValue = e.target.value;
    const validatedValue = validateArabicInput(originalValue);
    
    // Create a new event with the validated value
    const validatedEvent = {
      ...e,
      target: {
        ...e.target,
        value: validatedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(validatedEvent);
  };

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

      const dataTransfer = new DataTransfer();
      [...existingFiles, ...droppedFiles].forEach((file) => {
        dataTransfer.items.add(file);
      });

      onFilesChange(dataTransfer.files);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const existingFiles = files ? Array.from(files) : [];

      const dataTransfer = new DataTransfer();
      [...existingFiles, ...newFiles].forEach((file) => {
        dataTransfer.items.add(file);
      });

      onFilesChange(
        dataTransfer.files.length > 0 ? dataTransfer.files : undefined
      );
    }
  };

  const removeFile = (index: number) => {
    if (!files) return;

    const fileArray = Array.from(files);
    fileArray.splice(index, 1);

    const dataTransfer = new DataTransfer();
    fileArray.forEach((file) => {
      dataTransfer.items.add(file);
    });

    onFilesChange(fileArray.length > 0 ? dataTransfer.files : undefined);
  };
  return (
    <div className={`space-y-4 ${className}`}>
      {/* File List */}
      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-start">
          {Array.from(files).map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center gap-2 backdrop-blur-sm px-3 py-2 rounded-lg text-sm dark:bg-slate-800/70 dark:border-slate-700/50 dark:text-slate-200 light:bg-slate-100 light:border-slate-300 light:text-slate-700 border flex-row"
            >
              <FileText className="h-4 w-4 dark:text-slate-400 light:text-slate-500" />
              <span className="truncate max-w-32 font-medium">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="dark:text-slate-400 dark:hover:text-red-400 light:text-slate-500 light:hover:text-red-500 transition-colors"
                disabled={disabled || isLoading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Large Upload Area (when hideInput is true) */}
      {hideInput ? (
        <div>
          <section
            className={`relative group transition-all duration-300 ${
              dragActive
                ? "ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-slate-900 scale-105"
                : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            aria-label="File drop area"
          >            <button 
              type="button"
              onClick={handleFileSelect}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFileSelect();
                }
              }}
              className={`cursor-pointer min-h-[200px] w-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 hover:from-emerald-500/10 hover:to-teal-500/10 hover:border-emerald-400/50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                dragActive 
                  ? "border-emerald-500 bg-emerald-500/10 scale-105" 
                  : "border-slate-600/50"
              }`}
              aria-label="Click to select files or drag and drop files here"
              disabled={disabled || isLoading}
            >
              <div className="text-center space-y-4">
                <div className={`p-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl w-fit mx-auto transition-transform duration-300 ${dragActive ? "scale-110" : "group-hover:scale-110"}`}>
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {dragActive ? t("qcm.dropFiles") : t("qcm.uploadFiles")}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    {t("qcm.dragDropDescription")}
                  </p>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2 inline-block">
                  <span className="text-emerald-300 text-sm font-medium">
                    .pdf, .doc, .docx, .txt
                  </span>                </div>
              </div>
            </button>

            {/* Enhanced Drag overlay */}
            {dragActive && (
              <div className="absolute inset-0 bg-emerald-500/20 border-2 border-dashed border-emerald-500 rounded-2xl flex items-center justify-center pointer-events-none backdrop-blur-sm">
                <div className="text-center">
                  <div className="p-4 bg-emerald-500/30 rounded-full w-fit mx-auto mb-4 animate-pulse">
                    <FileText className="h-16 w-16 text-emerald-200" />
                  </div>
                  <p className="text-emerald-200 text-lg font-semibold">
                    {t("qcm.dropFilesHere")}
                  </p>
                  <p className="text-emerald-300 text-sm mt-1">
                    {t("qcm.multipleFilesSupported")}
                  </p>
                </div>
              </div>
            )}
          </section>          {/* Submit button for files */}
          {files && files.length > 0 && (
            <div className="flex justify-center mt-6">              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(e as React.FormEvent);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 text-lg rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                disabled={disabled || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>{t("qcm.processing")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    <span>{t("qcm.generateQCM")}</span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (        /* Original Input Form (when hideInput is false) */
        <form onSubmit={onSubmit} className="relative">
          <section
            className={`relative group transition-all duration-200 ${
              dragActive
                ? "ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-900"
                : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            aria-label="File drop area"
          >
            <div className="flex gap-3 items-end">
              {/* Send button - positioned on left for Arabic */}
              {isRTL && (
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white h-12 w-18 px-16 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                  disabled={
                    disabled || isLoading || (!input.trim() && !files?.length)
                  }
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              )}

              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={handleValidatedInputChange}
                  placeholder={isRTL ? t('chat.placeholder') : placeholder}
                  className={`backdrop-blur-sm transition-all duration-200 min-h-[48px] dark:bg-slate-800/70 dark:border-slate-600/50 dark:text-white dark:placeholder-slate-400 light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 ${
                    isRTL 
                      ? "text-right pl-20 pr-4" 
                      : "text-left pr-20 pl-4"
                  } ${
                    dragActive ? "border-indigo-500 bg-indigo-500/10" : ""
                  }`}
                  disabled={disabled || isLoading}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {/* File attach button inside input */}
                <Button
                  type="button"
                  onClick={handleFileSelect}
                  variant="ghost"
                  size="sm"
                  className={`cursor-pointer absolute ${
                    isRTL ? "left-2" : "right-2"
                  } top-1/2 -translate-y-1/2 h-8 w-8 p-0 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/50 light:text-slate-500 light:hover:text-slate-700 light:hover:bg-slate-200/50 transition-colors`}
                  disabled={disabled || isLoading}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>

              {/* Send button - positioned on right for English/French */}
              {!isRTL && (
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white h-12 w-18 px-16 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                  disabled={
                    disabled || isLoading || (!input.trim() && !files?.length)
                  }
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            {/* Drag overlay */}
            {dragActive && (
              <div className="absolute inset-0 bg-indigo-500/10 border-2 border-dashed border-indigo-500 rounded-lg flex items-center justify-center pointer-events-none backdrop-blur-sm">
                <div className="text-center">
                  <FileText className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                  <p className="text-indigo-400 text-sm font-medium">
                    {t("chat.dropFilesHere")}
                  </p>
                </div>
              </div>
            )}
          </section>

          <div className="mt-3 flex justify-center flex-row">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-sm border dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/40 light:bg-slate-200/80 light:text-slate-600 light:border-slate-300/60 flex-row">
              <Paperclip className="h-3 w-3 text-indigo-400" />
              <span className={isRTL ? "text-right" : "text-left"}>
                {t("chat.supportedFormats")}&nbsp;
                <span className="font-semibold text-indigo-300">
                  .pdf, .doc, .docx, .txt
                </span>
              </span>
            </span>
          </div>
        </form>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes}
        disabled={disabled || isLoading}
      />
    </div>
  );
}
