# Backend API Endpoints for File Management

This document describes the backend API endpoints that need to be implemented to support the settings page file management functionality.

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints require the user's unique ID to be passed in the request headers:
```
X-User-ID: <user_unique_id>
```

## Endpoints

### 1. Get User Files
**GET** `/user/files`

Returns a list of all files uploaded by the authenticated user.

**Headers:**
- `X-User-ID: string` - User's unique identifier

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "id": "file_uuid",
      "filename": "user_123_document1.pdf",
      "originalName": "Math Textbook Chapter 5.pdf",
      "uploadDate": "2025-06-15T10:30:00Z",
      "fileSize": 2048576,
      "fileType": "application/pdf",
      "status": "processed"
    }
  ]
}
```

**File Status Values:**
- `processed` - File successfully processed and embeddings created
- `processing` - File is being processed
- `error` - Error occurred during processing

### 2. Delete User File
**DELETE** `/user/files/{fileId}`

Deletes a specific file and removes all associated embeddings from the vector store.

**Headers:**
- `X-User-ID: string` - User's unique identifier

**Path Parameters:**
- `fileId: string` - Unique identifier of the file to delete

**Request Body:**
```json
{
  "filename": "user_123_document1.pdf",
  "removeEmbeddings": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "File and embeddings deleted successfully",
  "deletedFile": {
    "id": "file_uuid",
    "filename": "user_123_document1.pdf",
    "embeddingsRemoved": 45
  }
}
```

### 3. Get User File Statistics
**GET** `/user/files/stats`

Returns storage statistics for the authenticated user.

**Headers:**
- `X-User-ID: string` - User's unique identifier

**Response:**
```json
{
  "success": true,
  "totalFiles": 4,
  "totalSize": 6815616,
  "storageLimit": 104857600,
  "storageUsed": 6.5
}
```

### 4. Download User File
**GET** `/user/files/{fileId}/download`

Downloads a specific file for the authenticated user.

**Headers:**
- `X-User-ID: string` - User's unique identifier

**Path Parameters:**
- `fileId: string` - Unique identifier of the file to download

**Response:**
- Content-Type: Based on file type (application/pdf, text/plain, etc.)
- Content-Disposition: attachment; filename="original_filename.ext"
- Binary file content

## Implementation Notes

### File Storage Structure
Files should be stored using the following naming convention:
```
user_{user_id}_{unique_file_id}.{extension}
```

### Embedding Management
When deleting files:
1. Remove the physical file from storage
2. Delete all associated embeddings from the vector store/database
3. Update any indexes or metadata
4. Return count of embeddings removed

### Error Handling
All endpoints should return appropriate HTTP status codes:
- `200` - Success
- `401` - Unauthorized (invalid or missing user ID)
- `404` - File not found
- `403` - Forbidden (user doesn't own the file)
- `500` - Internal server error

Error response format:
```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

### Security Considerations
1. Always verify that the user owns the file before allowing operations
2. Validate file IDs to prevent path traversal attacks
3. Implement rate limiting for delete operations
4. Log all file operations for audit purposes

### Vector Store Integration
The backend should integrate with your vector store (e.g., Chroma, Pinecone, etc.) to:
1. Remove embeddings when files are deleted
2. Return embedding counts for verification
3. Ensure complete cleanup of user data

## Frontend Integration
The frontend automatically handles:
- Authentication state verification
- User ID extraction from auth context
- Error handling and user feedback
- Mock data fallback for development
- File type detection and display

## Testing
Use the mock data provided in `src/lib/file-utils.ts` for frontend development and testing before the backend endpoints are implemented.
