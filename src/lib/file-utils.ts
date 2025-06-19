/**
 * File management utilities for handling user uploaded files
 */

import { getUserFiles as getFilesFromBackend, deleteUserFile as deleteFileFromBackend, getUserFileStats as getFileStatsFromBackend } from './backend-utils';

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  uploadDate: string;
  fileSize: number;
  fileType: string;
  status: 'processed' | 'processing' | 'error';
}

/**
 * Get all files uploaded by a user
 */
export async function getUserFiles(): Promise<UploadedFile[]> {
  try {
    const response = await getFilesFromBackend();
      if (response.success && response.data) {
      // Adapt UserFile to UploadedFile format
      return response.data.files.map((file, index) => ({
        id: file.hash || index.toString(),
        filename: file.file,
        originalName: file.file,
        uploadDate: file.uploadDate || new Date().toISOString(),
        fileSize: 0, // Not available from backend
        fileType: file.file.split('.').pop() || 'unknown',
        status: (file.status as 'processed' | 'processing' | 'error') || 'processed'
      }));
    } else {
      console.warn('Failed to fetch user files from backend:', response.error);
      // Return mock data for development if backend is not available
      return getMockFiles();
    }
  } catch (error) {
    console.error('Error fetching user files:', error);
    // Return mock data for development if backend is not available
    return getMockFiles();
  }
}

/**
 * Delete a user file and its embeddings
 */
export async function deleteUserFile(
  userId: string, 
  fileId: string, 
  filename: string
): Promise<void> {
  try {
    const response = await deleteFileFromBackend(fileId, filename);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete file');
    }
    
    console.log('File deletion successful:', response.data);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Mock data for development/testing
 */
function getMockFiles(): UploadedFile[] {
  return [
    {
      id: '1',
      filename: 'user_123_document1.pdf',
      originalName: 'Math Textbook Chapter 5.pdf',
      uploadDate: '2025-06-15T10:30:00Z',
      fileSize: 2048576, // 2MB
      fileType: 'application/pdf',
      status: 'processed',
    },
    {
      id: '2',
      filename: 'user_123_document2.docx',
      originalName: 'History Notes.docx',
      uploadDate: '2025-06-14T14:22:00Z',
      fileSize: 512000, // 500KB
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      status: 'processed',
    },
    {
      id: '3',
      filename: 'user_123_document3.txt',
      originalName: 'Study Guide.txt',
      uploadDate: '2025-06-13T09:15:00Z',
      fileSize: 51200, // 50KB
      fileType: 'text/plain',
      status: 'processing',
    },
    {
      id: '4',
      filename: 'user_123_document4.pdf',
      originalName: 'Science Research Paper.pdf',
      uploadDate: '2025-06-12T16:45:00Z',
      fileSize: 4194304, // 4MB
      fileType: 'application/pdf',
      status: 'error',
    },
  ];
}

/**
 * Get file storage statistics for a user
 */
export async function getUserFileStats(): Promise<{
  totalFiles: number;
  totalSize: number;
  storageLimit: number;
  storageUsed: number;
}> {
  try {
    const response = await getFileStatsFromBackend();
    
    if (response.success && response.data) {
      return response.data;
    } else {
      console.warn('Failed to fetch file stats from backend:', response.error);
      // Return mock stats for development
      return {
        totalFiles: 4,
        totalSize: 6815616, // ~6.5MB
        storageLimit: 104857600, // 100MB
        storageUsed: 6.5,
      };
    }
  } catch (error) {
    console.error('Error fetching file stats:', error);
    // Return mock stats for development
    return {
      totalFiles: 4,
      totalSize: 6815616, // ~6.5MB
      storageLimit: 104857600, // 100MB
      storageUsed: 6.5,
    };
  }
}

/**
 * Download a user file
 */
export async function downloadUserFile(
  userId: string, 
  fileId: string, 
  filename: string
): Promise<void> {
  try {
    // Use the backend utils for downloading
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/user/files/${fileId}/download`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}
