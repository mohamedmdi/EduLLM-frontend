"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { isAuthenticated, getUserInfo } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  Calendar,
  User,
  Settings as SettingsIcon,
  Upload,
  HardDrive,
  Loader2,
} from "lucide-react";

interface UploadedFile {
  file: string;
  hash: string;
}

interface ExtendedUserInfo {
  userId: string;
  provider: string;
  isGuest: boolean;
  uniqueId?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export default function SettingsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [authChecked, setAuthChecked] = useState(false);
  const [userInfo, setUserInfo] = useState<ExtendedUserInfo | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = `/${locale}/auth/signin`;
      return;
    }
    const info = getUserInfo();
    setUserInfo(info);
    setAuthChecked(true);
  }, [locale]);

  useEffect(() => {
    const authenticateAndFetchFiles = async () => {
      if (!isAuthenticated()) {
        window.location.href = `/${locale}/auth/signin`;
        return;
      }

      const info = getUserInfo();
      setUserInfo(info);
      setAuthChecked(true);
      setLoading(true);

      try {
        const res = await fetch(`/api/list-files?user_id=${info?.userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message ?? "Failed to fetch files");
        }

        console.log("Fetched files:", data.files);
        setFiles(data.files);      } catch (err: unknown) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };    authenticateAndFetchFiles();
  }, [locale]);

  const handleDeleteFile = async (hash: string) => {
    try {
      setDeletingFiles((prev) => new Set(prev).add(hash));

      // Call backend to delete file and embeddings
      const res = await fetch(
        `http://127.0.0.1:8000/delete_file?user_id=${userInfo?.userId}&file_hash=${hash}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();      if (!res.ok || !data.success) {
        throw new Error(data.message ?? "Failed to delete file");
      }

      // Remove from local state
      setFiles((prev) => prev.filter((file) => file.hash !== hash));

      // Show success message (you can implement a toast system)
      console.log(`File deleted successfully`);
    } catch (error) {
      console.error("Failed to delete file:", error);
      // Show error message
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(hash);
        return newSet;
      });
    }
  };
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("doc")) return "📝";
    if (fileType.includes("text")) return "📋";
    return "📎";
  };

  // Don't render anything until auth is checked
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          <h1 className="text-3xl font-bold text-foreground">
            {t("fileManager.title") || "File Manager"}
          </h1>
        </div>

        {/* User Profile Section */}        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="w-5 h-5" />
              {t("fileManager.profile.title") || "Profile Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {userInfo?.avatar ? (
                <Image
                  src={userInfo.avatar}
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full border-2 border-emerald-400/40"
                />              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {userInfo?.name?.charAt(0)?.toUpperCase() ?? (
                    <User className="w-8 h-8" />
                  )}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {userInfo?.name ?? "Anonymous User"}
                </h3>
                <p className="text-muted-foreground">
                  {userInfo?.email ?? "No email"}
                </p>
                <p className="text-sm text-muted-foreground">
                  ID: {userInfo?.uniqueId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files Section */}        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <HardDrive className="w-5 h-5" />
              {t("fileManager.files.title") || "Uploaded Files"}
              {files.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {files.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500 dark:text-emerald-400" />
                <span className="ml-2 text-foreground font-medium">
                  Loading files...
                </span>
              </div>
            )}

            {!loading && files.length === 0 && (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-muted-foreground/70 dark:text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t("fileManager.files.empty") || "No files uploaded yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload files in the{" "}
                  <a
                    href={`/${locale}/chat`}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline font-medium"
                  >
                    Chat
                  </a>{" "}
                  or{" "}
                  <a
                    href={`/${locale}/qcm`}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline font-medium"
                  >
                    QCM
                  </a>{" "}
                  sections to see them here.
                </p>
              </div>
            )}

            {!loading && files.length > 0 && (
              <ScrollArea className="h-96">
                <div className="space-y-4">                  {files.map((file) => (
                    <div
                      key={file.hash}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getFileIcon(file.file.split(".").pop() ?? "file")}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {file.file}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Uploaded
                            </span>
                          </div>
                        </div>
                      </div>                      <div className="flex items-center gap-2">                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deletingFiles.has(file.hash)}
                              title={deletingFiles.has(file.hash) ? "Deleting..." : "Delete file"}
                              className="relative text-white bg-red-500 dark:bg-red-500 border-red-600 dark:border-red-600 hover:bg-red-600 dark:hover:bg-red-600 hover:border-red-700 dark:hover:border-red-700 hover:scale-110 transform transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-red-500/40 disabled:hover:scale-100 disabled:hover:shadow-none group overflow-hidden before:absolute before:inset-0 before:bg-white before:opacity-0 hover:before:opacity-10 before:transition-opacity before:duration-300"
                            >
                              <span className="relative z-10">
                                {deletingFiles.has(file.hash) ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 group-hover:animate-pulse group-hover:drop-shadow-sm" />
                                )}
                              </span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">
                                {t("fileManager.files.delete.title") ||
                                  "Delete File"}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                {t("fileManager.files.delete.description") ||
                                  `Are you sure you want to delete "${file.file}"? This will permanently remove the file and all its embeddings from the system. This action cannot be undone.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>                            <AlertDialogFooter>
                              <AlertDialogCancel className="text-foreground bg-muted hover:bg-muted/80 border-border">
                                {t("fileManager.files.delete.cancel") || "Cancel"}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFile(file.hash)}
                                className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                              >
                                {t("fileManager.files.delete.confirm") || "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}