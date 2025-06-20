# EduLLM Frontend

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)
![React](https://img.shields.io/badge/React-19.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-teal.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A modern, multilingual AI-powered educational frontend that provides an intuitive interface for document-based learning, intelligent Q&A, and interactive quiz generation with comprehensive internationalization support.

## 🎯 Features

- **🤖 AI-Powered Chat Interface**: Interactive learning conversations with document-aware AI
- **📝 QCM Generator**: Create custom multiple-choice quizzes from uploaded documents
- **📁 File Manager**: Upload, manage, and organize educational documents with real-time processing
- **🌍 Multilingual Support**: Full internationalization with English, French, and Arabic (RTL)
- **🔐 OAuth Authentication**: Secure login with Google and Microsoft accounts + Guest mode
- **🎨 Modern UI/UX**: Dark/light themes with glassmorphism design and smooth animations
- **📱 Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **⚡ Real-time Streaming**: Live AI response streaming for enhanced user experience

## 🏗️ Architecture

The frontend is built with a modern, scalable architecture using Next.js App Router:

```
EduLLM-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/            # Internationalized routes
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── layout.tsx       # Localized layout
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── chat/            # AI Chat interface
│   │   │   ├── qcm/             # Quiz generation
│   │   │   └── settings/        # File management
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── chat/            # Chat proxy
│   │   │   └── documents/       # File operations
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── Header.tsx           # Navigation
│   │   ├── auth/                # Authentication UI
│   │   ├── ui/                  # Reusable UI components
│   │   └── ThemeProvider.tsx    # Theme management
│   ├── hooks/                   # Custom React hooks
│   ├── i18n/                    # Internationalization config
│   ├── lib/                     # Utilities and configurations
│   ├── messages/                # Translation files
│   └── middleware.ts            # Next.js middleware
├── prisma/                      # Database schema
├── public/                      # Static assets
└── tailwind.config.js          # Styling configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0+
- npm 9.0+ (or pnpm/yarn)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohamedmdi/EduLLM-frontend.git
   cd EduLLM-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma db push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Setup

#### Basic Usage (Guest Mode)
No environment variables required for basic functionality.

#### OAuth Authentication (Recommended)
```bash
# Copy environment template
cp .env.example .env
```

**Required Environment Variables:**
```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
DATABASE_URL=file:./dev.db
```

📖 **See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for complete OAuth configuration**

## 📚 API Integration

### Backend Connection

The frontend connects to the EduLLM backend API at `http://localhost:8000`:

```typescript
// API Routes Configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Chat API endpoint
POST /api/chat
// File management
GET /api/documents
DELETE /api/documents
// QCM generation
POST /api/qcm
```

### Available Scripts

```bash
# Development
npm run dev              # Start with Turbopack (faster)
npm run dev:fast         # Experimental app directory mode

# Production
npm run build            # Create production build
npm run build:analyze    # Build with bundle analyzer
npm run start            # Start production server

# Database
npm run db:push          # Apply schema changes
npm run db:studio        # Browse database in browser
npm run db:generate      # Regenerate Prisma client
npm run db:migrate       # Run database migrations

# Code Quality
npm run lint             # ESLint checking
npm run auth:setup       # OAuth setup guide
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes (OAuth) |
| `NEXTAUTH_URL` | Application URL | Yes (OAuth) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `AZURE_AD_CLIENT_ID` | Microsoft Azure AD client ID | No |
| `AZURE_AD_CLIENT_SECRET` | Microsoft Azure AD client secret | No |
| `DATABASE_URL` | Database connection string | Yes |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | No |

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
```

## 🌍 Internationalization

### Supported Languages

| Language | Code | Direction | Completion |
|----------|------|-----------|------------|
| English  | `en` | LTR       | ✅ 100% |
| Français | `fr` | LTR       | ✅ 100% |
| العربية  | `ar` | RTL       | ✅ 100% |

### Translation System

```typescript
// Using translations in components
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('namespace');
  
  return (
    <h1>{t('title')}</h1>
  );
}
```

### RTL Support Features

- **Automatic Layout Flip**: CSS logical properties for RTL
- **Icon Mirroring**: Directional icons flip automatically
- **Text Alignment**: Proper right-to-left text flow
- **Form Controls**: RTL-aware input and button positioning

### Adding New Languages

1. **Create translation file**:
   ```bash
   touch src/messages/es.json  # Spanish
   ```

2. **Update routing configuration**:
   ```typescript
   // src/i18n/routing.ts
   export const routing = createNavigation({
     locales: ['en', 'fr', 'ar', 'es'],
     defaultLocale: 'en'
   });
   ```

3. **Add translations**:
   ```json
   {
     "nav": {
       "home": "Inicio",
       "chat": "Chat",
       "qcm": "Cuestionario"
     }
   }
   ```## 🎨 Design System

### Theme Architecture

EduLLM features a comprehensive theming system with light and dark modes:

```typescript
// Theme configuration
interface ThemeConfig {
  theme: 'light' | 'dark' | 'system';
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

### Color System

#### CSS Custom Properties
```css
/* Light Theme */
:root {
  --background: oklch(0.995 0 0);     /* Pure white */
  --foreground: oklch(0.165 0 0);     /* Dark text */
  --card: oklch(0.995 0 0);           /* Card backgrounds */
  --border: oklch(0.912 0 0);         /* Borders */
  --muted: oklch(0.96 0 0);           /* Muted elements */
  --accent: oklch(0.76 0.12 166);     /* Emerald accent */
}

/* Dark Theme */
[data-theme="dark"] {
  --background: oklch(0.135 0 0);     /* Dark background */
  --foreground: oklch(0.975 0 0);     /* Light text */
  --card: oklch(0.195 0 0);           /* Card backgrounds */
  --border: oklch(0.259 0 0);         /* Borders */
  --muted: oklch(0.259 0 0);          /* Muted elements */
  --accent: oklch(0.76 0.12 166);     /* Emerald accent */
}
```

#### Brand Colors
- **Primary**: Emerald (#10b981) to Teal (#14b8a6) gradient
- **Glass Effects**: Semi-transparent overlays with backdrop blur
- **Status Colors**: Success (green), Warning (yellow), Error (red)

### Typography

```css
/* Font Stack */
--font-geist-sans: 'Geist Sans', -apple-system, sans-serif;
--font-geist-mono: 'Geist Mono', 'Consolas', monospace;

/* Arabic Fonts */
--font-arabic: 'Cairo', 'Amiri', 'Scheherazade New', serif;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
```

### Component Styling

#### Glass Morphism
```css
.glass-effect {
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
```

#### Animations
```css
/* Theme transitions */
.theme-transition {
  transition: background-color 300ms ease-in-out,
              border-color 300ms ease-in-out,
              color 300ms ease-in-out;
}

/* Hover effects */
.hover-scale {
  transition: transform 200ms ease-in-out;
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

## 🔐 Authentication System

### OAuth Providers

```typescript
// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
};
```

### Session Management

```typescript
// Session data structure
interface SessionData {
  user: {
    id: string;
    uniqueId: string;
    name?: string;
    email?: string;
    image?: string;
    provider?: string;
  }
  expires: string;
}
```

### Guest Mode Features

- **Local Storage**: Guest sessions stored locally
- **Unique IDs**: Auto-generated guest identifiers
- **Full Functionality**: All features available without login
- **Seamless Upgrade**: Easy transition to authenticated account

## 📊 Data Management

### Database Schema

```prisma
// prisma/schema.prisma
model User {
  id            String    @id @default(cuid())
  uniqueId      String    @unique
  name          String?
  email         String?   @unique
  image         String?
  provider      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### File Handling

```typescript
// File upload and processing
interface FileUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  hash?: string;
}

// Supported formats
const SUPPORTED_FORMATS = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];
```

## 🛠️ Development

### Development Workflow

1. **Setup Development Environment**:
   ```bash
   npm run dev              # Start development server
   ```

2. **Test Features**:
   - **Authentication**: Visit `/en/auth/signin` for OAuth testing
   - **Guest Mode**: Use application without authentication
   - **Multilingual**: Test at `/en`, `/fr`, `/ar`
   - **Theme Switching**: Toggle between light/dark modes

3. **Database Management**:
   ```bash
   npm run db:studio        # Visual database browser
   npm run db:push          # Apply schema changes
   ```

4. **Production Build**:
   ```bash
   npm run build            # Create optimized build
   npm run start            # Test production locally
   ```

### Code Quality

```bash
# Linting and formatting
npm run lint             # ESLint checking
npx tsc --noEmit        # TypeScript validation

# Bundle analysis
npm run build:analyze    # Analyze build size
```

### Performance Optimization

- **Turbopack**: Faster development builds
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components load on demand
- **Bundle Analysis**: Track build size and optimization

## 🚨 Error Handling

### Client-Side Error Boundaries

```typescript
// Error boundary for robust error handling
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
  // Error handling implementation
}
```

### API Error Handling

```typescript
// Centralized error handling for API calls
async function apiCall(endpoint: string, options: RequestInit) {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### Toast Notifications

```typescript
// User-friendly error messages
import { toast } from 'react-hot-toast';

// Success notification
toast.success('File uploaded successfully!');

// Error notification
toast.error('Failed to upload file. Please try again.');

// Loading state
toast.loading('Uploading file...');
```

## 📈 Performance Metrics

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Features

- **Server-Side Rendering**: Fast initial page loads
- **Static Generation**: Pre-rendered pages for optimal performance
- **Image Optimization**: WebP format with responsive sizing
- **Font Optimization**: Self-hosted fonts with preloading
- **Bundle Splitting**: Efficient code loading

## 🔒 Security

### Security Features

- **Content Security Policy**: XSS protection
- **CSRF Protection**: NextAuth.js built-in protection
- **Secure Headers**: Security headers configured
- **Input Validation**: All user inputs sanitized
- **Session Security**: Secure JWT tokens with expiration

### Best Practices

```typescript
// Input sanitization example
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

// Environment variable validation
const requiredEnvVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

### Data Protection

- **User Data Isolation**: Each user's data is properly scoped
- **Local Storage**: Sensitive data never stored in localStorage
- **Cookie Security**: Secure, HttpOnly cookies for sessions
- **OAuth Scopes**: Minimal required permissions requested

## 🤝 Contributing

### Development Setup

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/yourusername/EduLLM-frontend.git
   cd EduLLM-frontend
   ```

2. **Create Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start Development**:
   ```bash
   npm run dev
   ```

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow configured rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Meaningful commit messages

```bash
# Example commit messages
git commit -m "feat: add dark mode support"
git commit -m "fix: resolve theme switching bug"
git commit -m "docs: update API documentation"
```

### Pull Request Process

1. **Code Quality**: Ensure tests pass and no lint errors
2. **Documentation**: Update README if needed
3. **Screenshots**: Include UI changes screenshots
4. **Testing**: Test in multiple languages and themes
5. **Review**: Request review from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/mohamedmdi/EduLLM-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mohamedmdi/EduLLM-frontend/discussions)
- **Documentation**: Comprehensive guides in the `/docs` folder

### Common Issues

#### OAuth Setup Problems
```bash
# Check environment variables
npm run auth:setup
```

#### Database Issues
```bash
# Reset database
rm prisma/dev.db
npx prisma db push
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 🎓 About EduLLM

EduLLM Frontend is the user interface for an AI-powered educational platform that transforms how students interact with educational content. Built with modern web technologies, it provides an intuitive, multilingual experience for document-based learning, AI-powered Q&A, and interactive quiz generation.

### Key Innovations

- **Multilingual AI**: Seamless switching between languages with preserved context
- **Document Intelligence**: Upload and instantly query educational documents
- **Adaptive UI**: Theme and language-aware interface design
- **Real-time Collaboration**: Live AI interactions with streaming responses

---

**Built with ❤️ for education • Powered by Next.js and AI**
