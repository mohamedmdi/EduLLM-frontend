# OAuth Setup Guide for EduLLM

This guide will help you set up OAuth authentication with Google and Microsoft (Azure AD) for the EduLLM application.

## Prerequisites

- A Google account for Google Cloud Console access
- A Microsoft account for Azure Portal access
- Your EduLLM application running locally or deployed

## 1. Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `edullm-auth` (or your preferred name)
4. Click "Create"

### Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and click on it
3. Click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: `EduLLM`
   - User support email: Your email
   - App logo: Optional
   - App domain: `http://localhost:3002` (for development)
   - Developer contact information: Your email
4. Click "Save and Continue"
5. On Scopes page, click "Save and Continue" (default scopes are sufficient)
6. On Test users page, add your email as a test user
7. Click "Save and Continue"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Enter name: `EduLLM Web Client`
5. Add Authorized JavaScript origins:
   - `http://localhost:3002` (for development)
   - Your production domain (when deployed)
6. Add Authorized redirect URIs:
   - `http://localhost:3002/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Click "Create"
8. Copy the Client ID and Client Secret

## 2. Microsoft Azure AD OAuth Setup

### Step 1: Register Application in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "Azure Active Directory" and select it
3. Go to "App registrations" → "New registration"
4. Fill in the registration form:
   - Name: `EduLLM`
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: Web → `http://localhost:3002/api/auth/callback/azure-ad`
5. Click "Register"

### Step 2: Configure Application

1. In the app overview, copy the "Application (client) ID"
2. Go to "Certificates & secrets" → "Client secrets" → "New client secret"
3. Add description: `EduLLM Auth Secret`
4. Choose expiration (recommended: 24 months)
5. Click "Add" and copy the secret value immediately

### Step 3: Configure API Permissions

1. Go to "API permissions"
2. The following permissions should already be granted:
   - Microsoft Graph → User.Read (Sign in and read user profile)
3. If not present, click "Add a permission" → "Microsoft Graph" → "Delegated permissions" → "User.Read"

### Step 4: Add Redirect URIs for Production

1. Go to "Authentication"
2. Under "Web" section, add your production redirect URI:
   - `https://yourdomain.com/api/auth/callback/azure-ad`
3. Check the boxes for:
   - Access tokens
   - ID tokens
4. Click "Save"

## 3. Environment Configuration

Update your `.env` file with the credentials you obtained:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters
NEXTAUTH_URL=http://localhost:3002

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft Azure AD OAuth
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret

# Database
DATABASE_URL=file:./dev.db
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 4. Testing the Setup

1. Start your application:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3002/en/auth/signin`

3. Try signing in with:
   - Google account
   - Microsoft account
   - Guest mode (for testing without OAuth)

## 5. Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Check that your redirect URIs are exactly the same in OAuth provider and your app
   - Make sure to include the protocol (http/https)

2. **"invalid_client" error**
   - Verify your client ID and secret are correct
   - Check that the OAuth application is properly configured

3. **"access_denied" error**
   - User canceled the OAuth flow
   - User doesn't have permission to sign in

4. **Environment variables not loaded**
   - Restart your development server after updating `.env`
   - Ensure `.env` is in the root directory

### Development vs Production

For production deployment:

1. Update `NEXTAUTH_URL` to your production domain
2. Add production redirect URIs to both OAuth providers
3. Use HTTPS for all production URLs
4. Consider using environment-specific client IDs/secrets

## 6. User Data Retrieved

When users sign in with OAuth, the following data is retrieved:

### Google OAuth Response
```json
{
  "id": "google-user-id",
  "name": "User Name",
  "email": "user@example.com",
  "image": "https://profile-image-url",
  "provider": "google"
}
```

### Microsoft OAuth Response
```json
{
  "id": "azure-user-id",
  "name": "User Name", 
  "email": "user@example.com",
  "image": "https://profile-image-url",
  "provider": "azure-ad"
}
```

This data is automatically stored in your database and available in the session object throughout your application.
