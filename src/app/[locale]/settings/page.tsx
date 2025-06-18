"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { getUserFiles, deleteUserFile } from "@/lib/file-utils";

interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  uploadDate: string;
  fileSize: number;
  fileType: string;
  status: 'processed' | 'processing' | 'error';
}

export default function SettingsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [authChecked, setAuthChecked] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
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

  const loadUserFiles = async () => {
    try {
      setLoading(true);
      const userFiles = await getUserFiles(userInfo?.uniqueId || '');
      setFiles(userFiles);
    } catch (error) {
      console.error("Failed to load user files:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load user files
  useEffect(() => {
    if (authChecked && userInfo) {
      loadUserFiles();
    }
  }, [authChecked, userInfo]);

  const handleDeleteFile = async (fileId: string, filename: string) => {
    try {
      setDeletingFiles(prev => new Set(prev).add(fileId));
      
      // Call backend to delete file and embeddings
      await deleteUserFile(userInfo.uniqueId, fileId, filename);
      
      // Remove from local state
      setFiles(prev => prev.filter(file => file.id !== fileId));
      
      // Show success message (you can implement a toast system)
      console.log(`File ${filename} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete file:", error);
      // Show error message
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('doc')) return '📝';
    if (fileType.includes('text')) return '📋';
    return '📎';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge variant="default" className="bg-green-500">Processed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-foreground">
            {t("settings.title") || "Settings"}
          </h1>
        </div>

        {/* User Profile Section */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="w-5 h-5" />
              {t("settings.profile.title") || "Profile Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {userInfo?.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border-2 border-emerald-400/40"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {userInfo?.name?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {userInfo?.name || "Anonymous User"}
                </h3>
                <p className="text-muted-foreground">{userInfo?.email || "No email"}</p>
                <p className="text-sm text-muted-foreground">
                  ID: {userInfo?.uniqueId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <HardDrive className="w-5 h-5" />
              {t("settings.files.title") || "Uploaded Files"}
              {files.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {files.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <span className="ml-2 text-muted-foreground">Loading files...</span>
              </div>
            )}
            
            {!loading && files.length === 0 && (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t("settings.files.empty") || "No files uploaded yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload files in the{" "}
                  <a href={`/${locale}/chat`} className="text-emerald-400 hover:underline">
                    Chat
                  </a>{" "}
                  or{" "}
                  <a href={`/${locale}/qcm`} className="text-emerald-400 hover:underline">
                    QCM
                  </a>{" "}
                  sections to see them here.
                </p>
              </div>
            )}
            
            {!loading && files.length > 0 && (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getFileIcon(file.fileType)}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {file.originalName}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(file.uploadDate).toLocaleDateString()}
                            </span>
                            {getStatusBadge(file.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deletingFiles.has(file.id)}
                              className="text-white"
                            >
                              {deletingFiles.has(file.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">
                                {t("settings.files.delete.title") || "Delete File"}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                {t("settings.files.delete.description") || 
                                `Are you sure you want to delete "${file.originalName}"? This will permanently remove the file and all its embeddings from the system. This action cannot be undone.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="text-foreground">
                                {t("settings.files.delete.cancel") || "Cancel"}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFile(file.id, file.filename)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                {t("settings.files.delete.confirm") || "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
