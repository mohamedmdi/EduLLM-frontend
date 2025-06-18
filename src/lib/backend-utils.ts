/**
 * Utility functions for backend API calls that ensure user UUID is always included
 */

import { getUserId, isAuthenticated } from './auth-utils';

export interface BackendRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: FormData | Record<string, any>;
  files?: FileList | File[];
  headers?: Record<string, string>;
}

export interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

/**
 * Make an authenticated request to the backend that includes user UUID
 * @param options Request options
 * @returns Promise with backend response
 */
export async function makeBackendRequest<T = any>(
  options: BackendRequestOptions
): Promise<BackendResponse<T>> {
  // Ensure user is authenticated
  if (!isAuthenticated()) {
    return {
      success: false,
      error: 'User must be authenticated to make backend requests',
      status: 401,
    };
  }

  const userId = getUserId();
  if (!userId) {
    return {
      success: false,
      error: 'User ID not found',
      status: 401,
    };
  }

  try {
    const { body, contentType, endpoint } = prepareRequestData(options, userId);

    const headers: Record<string, string> = {
      ...options.headers,
    };

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    const response = await fetch(endpoint, {
      method: options.method || 'POST',
      headers,
      body,
    });

    return await processResponse<T>(response);
  } catch (error) {
    console.error('Backend request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

/**
 * Prepare request data with user ID and files
 */
function prepareRequestData(options: BackendRequestOptions, userId: string) {
  let body: FormData | string | undefined;
  let contentType: string | undefined;
  let endpoint = options.endpoint;

  if (options.method === 'GET') {
    // For GET requests, add userId as query parameter
    const url = new URL(options.endpoint, window.location.origin);
    url.searchParams.append('userId', userId);
    endpoint = url.toString();
  } else if (options.data instanceof FormData) {
    body = options.data;
    body.append('userId', userId);
    addFilesToFormData(body, options.files);
  } else if (options.data) {
    // JSON data
    body = JSON.stringify({
      ...options.data,
      userId,
    });
    contentType = 'application/json';
  } else {
    // Create FormData with just userId
    body = new FormData();
    body.append('userId', userId);
    addFilesToFormData(body, options.files);
  }

  return { body, contentType, endpoint };
}

/**
 * Add files to FormData
 */
function addFilesToFormData(formData: FormData, files?: FileList | File[]) {
  if (files) {
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    fileArray.forEach((file) => {
      formData.append('file', file);
    });
  }
}

/**
 * Process the fetch response
 */
async function processResponse<T>(response: Response): Promise<BackendResponse<T>> {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    return {
      success: false,
      error: typeof data === 'string' ? data : data.error || 'Backend request failed',
      status: response.status,
    };
  }

  return {
    success: true,
    data,
    status: response.status,
  };
}

/**
 * Upload documents for a user (creates embedding folder)
 * @param files Files to upload
 * @param metadata Optional metadata
 * @returns Upload result
 */
export async function uploadDocuments(
  files: FileList | File[],
  metadata?: Record<string, any>
): Promise<BackendResponse> {
  const formData = new FormData();
  formData.append('action', 'upload');
  
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  return makeBackendRequest({
    endpoint: '/api/documents',
    method: 'POST',
    data: formData,
    files,
  });
}

/**
 * Get user's uploaded documents
 * @returns List of user documents
 */
export async function getUserDocuments(): Promise<BackendResponse> {
  return makeBackendRequest({
    endpoint: '/api/documents',
    method: 'GET',
  });
}

/**
 * Send a chat message with user context
 * @param message Chat message
 * @param files Optional file attachments
 * @returns Chat response
 */
export async function sendChatMessage(
  message: string,
  files?: FileList | File[]
): Promise<BackendResponse> {
  const formData = new FormData();
  formData.append('query', message);

  return makeBackendRequest({
    endpoint: '/api/chat',
    method: 'POST',
    data: formData,
    files,
  });
}

/**
 * Generate QCM questions with user context
 * @param prompt QCM generation prompt
 * @param options QCM options
 * @param files Optional file attachments
 * @returns QCM generation response
 */
export async function generateQCM(
  prompt: string,
  options?: {
    type?: string;
    difficulty?: string;
    questionCount?: number;
  },
  files?: FileList | File[]
): Promise<BackendResponse> {
  const formData = new FormData();
  formData.append('query', prompt);
  formData.append('request_type', 'qcm');
  
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }

  return makeBackendRequest({
    endpoint: '/api/chat', // Use existing chat endpoint for QCM
    method: 'POST',
    data: formData,
    files,
  });
}
