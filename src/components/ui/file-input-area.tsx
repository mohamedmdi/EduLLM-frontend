"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Paperclip,
  Send,
  X,
  FileText,
} from "lucide-react";

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
}: FileInputAreaProps) {
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

      onFilesChange(dataTransfer.files.length > 0 ? dataTransfer.files : undefined);
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
        <div className="flex flex-wrap gap-2">
          {Array.from(files).map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center gap-2 bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 text-slate-200 px-3 py-2 rounded-lg text-sm"
            >
              <FileText className="h-4 w-4 text-slate-400" />
              <span className="truncate max-w-32 font-medium">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-slate-400 hover:text-red-400 transition-colors"
                disabled={disabled || isLoading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={onSubmit} className="relative">
        <div 
          className={`relative group transition-all duration-200 ${
            dragActive ? "ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-900" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={onInputChange}
                placeholder={placeholder}
                className={`bg-slate-800/70 backdrop-blur-sm border-slate-600/50 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 pr-20 min-h-[48px] ${
                  dragActive ? "border-indigo-500 bg-indigo-500/10" : ""
                }`}
                disabled={disabled || isLoading}
              />
              
              {/* File attach button inside input */}
              <Button
                type="button"
                onClick={handleFileSelect}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                disabled={disabled || isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Send button */}
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white h-12 px-6 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              disabled={disabled || isLoading || (!input.trim() && !files?.length)}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Drag overlay */}
          {dragActive && (
            <div className="absolute inset-0 bg-indigo-500/10 border-2 border-dashed border-indigo-500 rounded-lg flex items-center justify-center pointer-events-none backdrop-blur-sm">
              <div className="text-center">
                <FileText className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-indigo-400 text-sm font-medium">Drop files here</p>
              </div>
            </div>
          )}
        </div>

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
      </form>
    </div>
  );
}
