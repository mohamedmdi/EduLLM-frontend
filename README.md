# EduLLM Frontend

<div align="center">

![EduLLM Logo](https://img.shields.io/badge/EduLLM-AI%20Learning%20Companion-emerald?style=for-the-badge&logo=graduation-cap)

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-teal?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-3%20Languages-green?style=flat-square)](https://next-intl.dev/)

**Your AI-Powered Learning Companion**

A modern, multilingual educational platform powered by artificial intelligence, supporting English, French, and Arabic with full RTL support.

[🚀 Demo](#demo) • [📖 Documentation](#documentation) • [🌟 Features](#features) • [🛠️ Installation](#installation)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#features)
- [🚀 Demo](#demo)
- [🛠️ Installation](#installation)
- [🔧 Development](#development)
- [🌍 Internationalization](#internationalization)
- [📁 Project Structure](#project-structure)
- [🎨 Design System](#design-system)
- [🔌 API Integration](#api-integration)
- [📚 Documentation (Français)](#documentation-français)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

---

## 🌟 Features

### 🎓 Core Learning Features
- **AI Chat Assistant**: Interactive learning conversations with AI
- **QCM Generator**: Create custom multiple-choice quizzes from documents
- **Document Upload**: Support for PDF, DOC, DOCX, and TXT files
- **Instant Feedback**: Real-time AI responses and explanations

### 🌍 Multilingual Support
- **3 Languages**: English, French, and Arabic
- **RTL Support**: Full right-to-left layout for Arabic
- **Dynamic Switching**: Seamless language switching with URL preservation
- **Localized Content**: All UI elements and messages translated

### 🎨 Modern Design
- **Glassmorphism UI**: Modern glass-effect design with backdrop blur
- **Dark Theme**: Elegant dark mode with emerald-teal gradient accents
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Smooth transitions and micro-interactions

### 🔧 Technical Excellence
- **Next.js 15**: Latest App Router with Turbopack
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom RTL support
- **Component Library**: Reusable UI components with Radix UI

---

## 🚀 Demo

Visit the live demo at: `http://localhost:3000` (after installation)

### Screenshots

**English Interface**
```
🏠 Home → 💬 Chat → 📝 QCM
```

**Interface Française**
```
🏠 Accueil → 💬 Discussion → 📝 QCM
```

**واجهة عربية**
```
🏠 الرئيسية ← 💬 المحادثة ← 📝 الأسئلة
```

---

## 🛠️ Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or **yarn**/**pnpm**)
- **Git** for version control

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/edullm-frontend.git
cd edullm-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Setup

No environment variables required for basic functionality. For backend integration:

```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

---

## 🔧 Development

### Available Scripts

```bash
# Development with Turbopack (faster)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

### Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Make changes** to files in `src/`

3. **Test in multiple languages**:
   - English: `http://localhost:3000/en`
   - French: `http://localhost:3000/fr`
   - Arabic: `http://localhost:3000/ar`

4. **Build and test**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌍 Internationalization

### Supported Languages

| Language | Code | Direction | Status |
|----------|------|-----------|--------|
| English  | `en` | LTR       | ✅ Complete |
| Français | `fr` | LTR       | ✅ Complete |
| العربية  | `ar` | RTL       | ✅ Complete |

### Adding New Languages

1. **Create translation file**:
   ```bash
   # Add new language file
   touch src/messages/es.json  # for Spanish
   ```

2. **Update routing configuration**:
   ```typescript
   // src/i18n/routing.ts
   export const routing = createNavigation({
     locales: ['en', 'fr', 'ar', 'es'],  // Add 'es'
     defaultLocale: 'en'
   });
   ```

3. **Add translations**:
   ```json
   {
     "nav": {
       "signIn": "Iniciar Sesión",
       "getStarted": "Comenzar"
     }
   }
   ```

### RTL Support

The application automatically switches to RTL layout for Arabic:
- Text alignment: right-to-left
- Layout direction: reversed
- Icons and buttons: mirrored positioning
- Forms and inputs: proper RTL behavior

---

## 📁 Project Structure

```
edullm-frontend/
├── 📁 public/                     # Static assets
├── 📁 src/                        # Source code
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 [locale]/          # Localized routes
│   │   │   ├── 📄 layout.tsx     # Localized layout
│   │   │   ├── 📄 page.tsx       # Home page
│   │   │   ├── 📁 chat/          # Chat feature
│   │   │   └── 📁 qcm/           # QCM feature
│   │   ├── 📁 api/               # API routes
│   │   ├── 📄 globals.css        # Global styles
│   │   └── 📄 layout.tsx         # Root layout
│   ├── 📁 components/            # React components
│   │   ├── 📄 Header.tsx         # Navigation header
│   │   ├── 📄 SimpleLanguageSwitcher.tsx
│   │   └── 📁 ui/                # UI components
│   ├── 📁 hooks/                 # Custom React hooks
│   ├── 📁 i18n/                  # Internationalization
│   ├── 📁 lib/                   # Utility functions
│   ├── 📁 messages/              # Translation files
│   └── 📄 middleware.ts          # Next.js middleware
├── 📄 next.config.ts             # Next.js configuration
├── 📄 tailwind.config.js         # Tailwind configuration
└── 📄 package.json               # Dependencies
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--emerald-400: #34d399
--teal-400: #2dd4bf
--slate-950: #020617
--slate-900: #0f172a

/* Glass Effects */
--glass-bg: rgba(15, 23, 42, 0.3)
--glass-border: rgba(148, 163, 184, 0.1)
--backdrop-blur: 12px
```

### Typography

- **Primary Font**: Geist Sans (Variable)
- **Monospace**: Geist Mono (Variable)
- **Arabic**: Cairo, Amiri, Scheherazade New

### Components

All components follow a consistent design pattern:
- Glass morphism backgrounds
- Emerald-teal gradient accents
- Rounded corners (xl: 12px, 2xl: 16px)
- Smooth transitions (300ms)

---

## 🔌 API Integration

### Backend Connection

The frontend connects to a FastAPI backend at `http://localhost:8000`:

```typescript
// API Route: src/app/api/chat/route.ts
const backendRes = await fetch("http://localhost:8000/ask", {
  method: "POST",
  body: formData,
});
```

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ask`   | POST   | Send chat messages and files |

### Error Handling

```typescript
try {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: formData,
  });
} catch (error) {
  console.error("API Error:", error);
}
```

---

## 📚 Documentation (Français)

**Pour la documentation complète en français, voir:** [DOCS_FR.md](./DOCS_FR.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the EduLLM Team**

[🐛 Report Bug](https://github.com/your-username/edullm-frontend/issues) • [✨ Request Feature](https://github.com/your-username/edullm-frontend/issues) • [📖 Documentation](https://docs.edullm.com)

</div>
