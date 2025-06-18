"use client";

import { motion } from "framer-motion";
import { GraduationCap, Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "chat" | "page";
}

export function Loading({ 
  message = "Loading...", 
  showIcon = true, 
  size = "md",
  variant = "default" 
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const containerClasses = {
    default: "flex items-center justify-center gap-3",
    chat: "min-h-screen bg-slate-950 flex items-center justify-center",
    page: "min-h-[50vh] flex items-center justify-center"
  };

  if (variant === "chat") {
    return (
      <div className={containerClasses.chat}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl"
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-lg font-semibold text-white mb-2"
          >
            Preparing EduLLM Chat
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-slate-400"
          >
            Setting up your AI learning companion...
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 1.5, ease: "easeInOut" }}
            className="mt-4 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto max-w-xs"
          />
        </motion.div>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className={containerClasses.page}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-card border border-border rounded-xl"
          >
            <Loader2 className="w-6 h-6 text-muted-foreground" />
          </motion.div>
          <p className="text-muted-foreground">{message}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={containerClasses.default}>
      {showIcon && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={`${sizeClasses[size]} text-muted-foreground`} />
        </motion.div>
      )}
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}

// Skeleton loading components for content
export function ChatMessageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-10 h-10 bg-slate-800/50 rounded-xl animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800/50 rounded animate-pulse" />
            <div className="h-4 bg-slate-800/50 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function PageContentSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="h-8 bg-card border border-border rounded animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 bg-card border border-border rounded animate-pulse" />
        <div className="h-4 bg-card border border-border rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-card border border-border rounded w-4/6 animate-pulse" />
      </div>
    </motion.div>
  );
}
