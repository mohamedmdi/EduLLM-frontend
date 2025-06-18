# EduLLM Frontend - Project Summary

## Overview
EduLLM Frontend is a modern, trilingual educational platform powered by AI, featuring complete OAuth authentication with Google and Microsoft providers. The application supports English, French, and Arabic with full RTL support.

## Key Features ✨

### 🌍 Multilingual Support
- **3 Languages**: English, French, Arabic
- **RTL Support**: Complete right-to-left layout for Arabic
- **Dynamic Switching**: Language switching with URL preservation
- **Localized URLs**: `/en/`, `/fr/`, `/ar/` routing

### 🔐 Authentication System
- **OAuth Providers**: Google OAuth 2.0 and Microsoft Azure AD
- **Guest Mode**: Use without account creation
- **Session Management**: JWT tokens with database persistence
- **Profile Data**: Automatic retrieval from OAuth providers
- **Secure**: CSRF protection, secure secrets, proper OAuth 2.0 flow

### 🎓 Learning Features
- **AI Chat**: Interactive learning conversations
- **QCM Generator**: Create custom multiple-choice exams
- **File Upload**: Support for PDF, DOC, DOCX, TXT
- **Real-time Feedback**: Instant AI responses

### 🎨 Modern Design & Theme System
- **Advanced Theme System**: Light, dark, and system preference themes with real-time switching
- **Theme Features**:
  - 🌞 **Light Theme**: Clean, bright interface for daytime use
  - 🌙 **Dark Theme**: Elegant dark interface to reduce eye strain
  - 🖥️ **System Theme**: Automatically follows OS preference
  - 💾 **Persistent Storage**: Theme choice saved across sessions
  - ⚡ **Real-time Switching**: Instant theme changes without page reload
  - 🎨 **CSS Variables**: All colors use custom properties for seamless adaptation
- **UI Design**: Glassmorphism with modern glass-effect UI and backdrop blur
- **Responsive Design**: Mobile-first approach that works on all devices
- **Smooth Animations**: Fluid transitions and micro-interactions
- **RTL Theme Support**: Theme system fully compatible with Arabic RTL layout

## Technical Stack 🛠️

### Core Technologies
- **Next.js 15**: App Router with Turbopack
- **React 19**: Latest React features
- **TypeScript 5**: Full type safety
- **Tailwind CSS 4**: Utility-first styling with RTL support

### Authentication
- **NextAuth.js 5**: OAuth authentication framework
- **Prisma ORM**: Type-safe database access
- **SQLite**: Development database
- **JWT**: Secure session tokens

### Internationalization
- **next-intl**: i18n framework
- **Dynamic routing**: Locale-based URLs
- **RTL support**: Complete right-to-left layout

## Project Structure 📁

```
EduLLM-frontend/
├── prisma/                     # Database schema
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── chat/          # Chat feature
│   │   │   └── qcm/           # QCM feature
│   │   └── api/auth/          # NextAuth API routes   │   ├── components/
│   │   ├── auth/              # Auth components
│   │   ├── ThemeProvider.tsx  # Theme context provider
│   │   ├── ThemeSwitcher.tsx  # Theme switching components
│   │   └── ui/                # UI components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   └── prisma.ts          # Database client
│   ├── messages/              # Translation files
│   └── i18n/                  # i18n configuration
├── OAUTH_SETUP.md             # OAuth setup guide
├── AUTHENTICATION_STATUS.md   # Auth implementation status
├── THEME_SYSTEM.md            # Theme system documentation
├── DOCS_FR.md                 # French documentation
├── CONTRIBUTING.md            # Contributing guidelines
└── README.md                  # Main documentation
```

## Installation & Setup 🚀

### Quick Start
```bash
git clone https://github.com/mohamedmdi/EduLLM-frontend.git
cd EduLLM-frontend
npm install
npx prisma db push
npm run dev
```

### OAuth Configuration
1. Copy environment template: `cp .env.example .env`
2. Get OAuth credentials from Google Cloud Console and Azure Portal
3. Update `.env` with your credentials
4. See `OAUTH_SETUP.md` for detailed instructions

## Available Scripts 📜

```bash
npm run dev            # Development server with Turbopack
npm run build          # Production build
npm run start          # Production server
npm run lint           # ESLint code checking
npm run db:push        # Apply database schema
npm run db:studio      # Database browser UI
npm run db:generate    # Regenerate Prisma client
```

## Key Files & Components 📄

### Authentication
- `src/lib/auth.ts` - NextAuth configuration with Google & Microsoft
- `src/components/auth/SignInForm.tsx` - OAuth sign-in form
- `src/components/auth/UserSession.tsx` - User session display
- `prisma/schema.prisma` - Database schema for users & sessions

### i18n & Routing
- `src/middleware.ts` - Locale routing middleware
- `src/i18n/routing.ts` - Internationalization routing config
- `src/messages/` - Translation files (en.json, fr.json, ar.json)

### UI Components
- `src/components/Header.tsx` - Navigation header with auth
- `src/components/SimpleLanguageSwitcher.tsx` - Language selector
- `src/components/ui/` - Reusable UI components

## Environment Variables 🔧

Required for OAuth:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
DATABASE_URL=file:./dev.db
```

## Documentation 📚

- **English**: README.md (main documentation)
- **French**: DOCS_FR.md (complete French documentation)
- **Theme System**: THEME_SYSTEM.md (theme implementation guide)
- **OAuth Setup**: OAUTH_SETUP.md (step-by-step OAuth guide)
- **Auth Status**: AUTHENTICATION_STATUS.md (implementation details)
- **Contributing**: CONTRIBUTING.md (contribution guidelines)

## Testing Authentication 🧪

### Guest Mode (No Setup Required)
1. Start: `npm run dev`
2. Visit: `http://localhost:3000/en/auth/signin`
3. Click: "Continue as Guest"

### OAuth Mode (Requires Setup)
1. Configure OAuth credentials in `.env`
2. Visit: `http://localhost:3000/en/auth/signin`
3. Test: "Sign in with Google" or "Sign in with Microsoft"

## Testing Themes 🎨

### Theme System Testing
1. **Navigation**: Visit any page: `http://localhost:3000/en`
2. **Theme Toggle**: Look for theme toggle button in header (sun/moon icon)
3. **Switch Themes**: Click to cycle through light → dark → system
4. **Verify Persistence**: Refresh page, theme should be maintained
5. **System Detection**: Change OS theme, verify app updates when "system" is selected

### Theme Options & Features
- **🌞 Light Theme**: Clean, bright interface with dark text on light backgrounds
- **🌙 Dark Theme**: Elegant dark interface with light text on dark backgrounds  
- **🖥️ System Theme**: Automatically follows OS preference (Windows/Mac/Linux)
- **⚡ Real-time Updates**: No page reload required for theme changes
- **💾 Persistent Storage**: Theme choice saved in browser localStorage

### Testing Checklist
- [ ] ✅ Theme toggle works on all pages (`/en`, `/fr`, `/ar`)
- [ ] ✅ Theme preference persists after browser refresh
- [ ] ✅ All components adapt correctly to theme changes
- [ ] ✅ Text contrast is sufficient in both light and dark themes
- [ ] ✅ RTL layout (Arabic) works perfectly with both themes
- [ ] ✅ System theme detection responds to OS changes
- [ ] ✅ Theme switching animations are smooth (300ms transitions)
- [ ] ✅ CSS variables update correctly for all UI elements

### Component Theme Adaptation
All components automatically adapt using CSS variables:
```css
/* Theme-aware classes */
.bg-background    /* Adapts to current theme background */
.text-foreground  /* Adapts to current theme text color */
.border-border    /* Adapts to current theme border color */
.bg-card          /* Adapts to current theme card background */
```

## Features in Action 🎯

### Multilingual Interface
- English: `http://localhost:3000/en`
- French: `http://localhost:3000/fr`
- Arabic: `http://localhost:3000/ar` (RTL layout)

### Authentication Flow
1. User clicks OAuth provider button
2. Redirected to Google/Microsoft login
3. User authenticates with their account
4. Profile data retrieved and stored
5. User returned to app with active session

## Current Status ✅

The project is **production-ready** with:
- ✅ Complete trilingual support
- ✅ Working OAuth authentication
- ✅ Database integration
- ✅ Modern responsive design
- ✅ Comprehensive documentation
- ✅ Type-safe codebase

**Next Steps**: Configure OAuth credentials for full functionality.

## Contributing 🤝

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Code style and standards
- Commit message format
- Pull request process
- Development workflow

## License 📄

This project is licensed under the MIT License - see [LICENSE](./LICENSE) for details.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
