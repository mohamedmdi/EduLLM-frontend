# Documentation EduLLM Frontend (Français)

<div align="center">

![EduLLM Logo](https://img.shields.io/badge/EduLLM-Compagnon%20d'Apprentissage%20IA-emerald?style=for-the-badge&logo=graduation-cap)

**Votre Compagnon d'Apprentissage Alimenté par l'IA**

Plateforme éducative moderne et multilingue, prenant en charge l'anglais, le français et l'arabe avec support RTL complet.

</div>

---

## 📋 Table des Matières

- [🌟 Fonctionnalités](#fonctionnalités)
- [🚀 Installation](#installation)
- [🔧 Développement](#développement)
- [🌍 Internationalisation](#internationalisation)
- [📁 Structure du Projet](#structure-du-projet)
- [🎨 Système de Design](#système-de-design)
- [🔌 Intégration API](#intégration-api)
- [⚙️ Configuration](#configuration)
- [🧪 Tests](#tests)
- [📦 Déploiement](#déploiement)
- [🤝 Contribution](#contribution)
- [🔍 Dépannage](#dépannage)

---

## 🌟 Fonctionnalités

### 🎓 Fonctionnalités d'Apprentissage

#### Assistant de Chat IA
- **Conversations Interactives** : Dialoguez avec l'IA pour l'apprentissage
- **Réponses Contextuelles** : L'IA comprend le contexte de vos questions
- **Support Multi-Documents** : Uploadez des fichiers pour des réponses personnalisées
- **Historique des Conversations** : Gardez trace de vos sessions d'apprentissage

#### Générateur de QCM
- **Création Automatique** : Générez des QCM à partir de n'importe quel contenu
- **Support de Documents** : PDF, DOC, DOCX, TXT
- **Questions Personnalisées** : Adaptées à votre niveau et sujet
- **Formats Variés** : Choix multiples, vrai/faux, questions avancées

#### Gestion de Fichiers
- **Glisser-Déposer** : Interface intuitive pour l'upload
- **Prévisualisation** : Voir les fichiers avant traitement
- **Formats Supportés** :
  - 📄 PDF - Documents portables
  - 📝 DOC/DOCX - Documents Microsoft Word
  - 📋 TXT - Fichiers texte brut

### 🌍 Support Multilingue

#### Langues Supportées
- **🇺🇸 Anglais** : Interface complète en anglais
- **🇫🇷 Français** : Interface entièrement traduite
- **🇸🇦 Arabe** : Support RTL complet avec typographie arabe

#### Fonctionnalités i18n
- **Commutation Dynamique** : Changez de langue sans perdre votre place
- **URLs Localisées** : `/fr/chat`, `/ar/qcm`, etc.
- **Contenu Adapté** : Messages d'erreur, placeholders, et textes UI traduits
- **Détection Automatique** : Détection de la langue préférée du navigateur

#### Support RTL (Right-to-Left)
- **Layout Automatique** : Inversion complète pour l'arabe
- **Typographie Arabe** : Polices optimisées (Cairo, Amiri, Scheherazade New)
- **Icons et Boutons** : Positionnement approprié pour RTL
- **Formulaires** : Alignement du texte et des champs

### 🎨 Design Moderne

#### Interface Glassmorphism
- **Effets de Verre** : Arrière-plans translucides avec flou
- **Gradients Emeraude-Teal** : Couleurs cohérentes dans toute l'app
- **Animations Fluides** : Transitions de 300ms pour toutes les interactions
- **Micro-Interactions** : Feedbacks visuels pour chaque action

#### Responsive Design
- **Mobile-First** : Optimisé pour les appareils mobiles
- **Tablettes** : Layout adaptatif pour écrans moyens
- **Desktop** : Interface complète pour grands écrans
- **Breakpoints** : sm: 640px, md: 768px, lg: 1024px, xl: 1280px

---

## 🚀 Installation

### Prérequis

Assurez-vous d'avoir installé :

```bash
# Vérifiez les versions
node --version  # >= 18.0.0
npm --version   # >= 9.0.0
git --version   # Dernière version stable
```

### Installation Rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-username/edullm-frontend.git
cd edullm-frontend

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

### Configuration Avancée

#### Variables d'Environnement

Créez un fichier `.env.local` :

```bash
# API Backend (optionnel)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Configuration de développement
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# Analytics (production uniquement)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

#### Configuration TypeScript

Le projet utilise TypeScript strict. Configuration dans `tsconfig.json` :

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## 🔧 Développement

### Scripts Disponibles

```bash
# Développement avec Turbopack (plus rapide)
npm run dev

# Construction pour la production
npm run build

# Démarrage du serveur de production
npm run start

# Vérification du code (ESLint)
npm run lint

# Vérification des types TypeScript
npx tsc --noEmit

# Analyse du bundle
npm run analyze
```

### Workflow de Développement

#### 1. Démarrage

```bash
# Démarrer le serveur de développement
npm run dev

# L'application sera disponible sur :
# http://localhost:3000/en (Anglais)
# http://localhost:3000/fr (Français)  
# http://localhost:3000/ar (Arabe)
```

#### 2. Développement de Composants

```bash
# Structure recommandée pour un nouveau composant
src/components/
├── MonComposant.tsx          # Composant principal
├── MonComposant.module.css   # Styles spécifiques (si nécessaire)
└── index.ts                  # Export du composant
```

Exemple de composant :

```typescript
// src/components/MonComposant.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface MonComposantProps {
  title: string;
  onAction?: () => void;
}

export default function MonComposant({ title, onAction }: MonComposantProps) {
  const t = useTranslations();
  
  return (
    <div className="p-6 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <Button onClick={onAction} className="bg-gradient-to-r from-emerald-400 to-teal-400">
        {t('common.action')}
      </Button>
    </div>
  );
}
```

#### 3. Ajout de Traductions

```bash
# 1. Ajouter les clés dans tous les fichiers de messages
src/messages/en.json   # Anglais
src/messages/fr.json   # Français  
src/messages/ar.json   # Arabe
```

Exemple de traduction :

```json
// src/messages/fr.json
{
  "monComposant": {
    "title": "Mon Titre",
    "description": "Ma description en français",
    "actions": {
      "save": "Enregistrer",
      "cancel": "Annuler"
    }
  }
}
```

#### 4. Styles et Design

```css
/* src/app/globals.css */

/* Nouveau style pour RTL */
[dir="rtl"] .mon-classe {
  text-align: right;
  flex-direction: row-reverse;
}

/* Style glassmorphism personnalisé */
.glass-card {
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
```

---

## 🌍 Internationalisation

### Architecture i18n

Le projet utilise **next-intl** pour l'internationalisation :

```
src/i18n/
├── navigation.ts    # Navigation localisée
├── request.ts      # Configuration des requêtes
└── routing.ts      # Configuration du routing

src/messages/
├── en.json         # Traductions anglaises
├── fr.json         # Traductions françaises
└── ar.json         # Traductions arabes
```

### Utilisation dans les Composants

#### Hook useTranslations

```typescript
'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function MonComposant() {
  const t = useTranslations();
  const locale = useLocale();
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
      <p>Langue actuelle : {locale}</p>
    </div>
  );
}
```

#### Navigation Localisée

```typescript
import { Link } from '@/i18n/navigation';

export default function Navigation() {
  return (
    <nav>
      <Link href="/chat">{t('nav.chat')}</Link>
      <Link href="/qcm">{t('nav.qcm')}</Link>
    </nav>
  );
}
```

### Ajouter une Nouvelle Langue

#### 1. Configuration

```typescript
// src/i18n/routing.ts
export const routing = createNavigation({
  locales: ['en', 'fr', 'ar', 'es'], // Ajouter 'es' pour l'espagnol
  defaultLocale: 'en'
});
```

#### 2. Fichier de Traduction

```bash
# Créer le fichier de traduction
touch src/messages/es.json
```

```json
{
  "nav": {
    "home": "Inicio",
    "chat": "Chat",
    "qcm": "Cuestionarios"
  },
  "welcome": {
    "title": "Bienvenido a EduLLM",
    "description": "Tu compañero de aprendizaje con IA"
  }
}
```

#### 3. Support RTL (si nécessaire)

```typescript
// src/app/[locale]/layout.tsx
const isRTL = locale === 'ar' || locale === 'he'; // Ajouter hébreu si besoin

return (
  <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
    {/* ... */}
  </html>
);
```

---

## 📁 Structure du Projet

### Architecture Détaillée

```
edullm-frontend/
├── 📁 public/                          # Assets statiques
│   └── favicon.ico                     # Icône de l'application
│
├── 📁 src/                             # Code source
│   ├── 📁 app/                         # App Router Next.js
│   │   ├── 📁 [locale]/               # Routes localisées
│   │   │   ├── 📄 layout.tsx          # Layout avec header
│   │   │   ├── 📄 page.tsx            # Page d'accueil
│   │   │   ├── 📁 chat/               # Fonctionnalité de chat
│   │   │   │   └── 📄 page.tsx        # Page de chat
│   │   │   └── 📁 qcm/                # Générateur de QCM
│   │   │       └── 📄 page.tsx        # Page QCM
│   │   ├── 📁 api/                    # Routes API
│   │   │   └── 📁 chat/               # API de chat
│   │   │       └── 📄 route.ts        # Endpoint chat
│   │   ├── 📄 favicon.ico             # Favicon de l'app
│   │   ├── 📄 globals.css             # Styles globaux
│   │   ├── 📄 layout.tsx              # Layout racine
│   │   └── 📄 page.tsx                # Redirection racine
│   │
│   ├── 📁 components/                 # Composants React
│   │   ├── 📄 Header.tsx              # En-tête de navigation
│   │   ├── 📄 SimpleLanguageSwitcher.tsx  # Sélecteur de langue
│   │   └── 📁 ui/                     # Composants UI
│   │       ├── 📄 button.tsx          # Composant bouton
│   │       ├── 📄 input.tsx           # Composant input
│   │       ├── 📄 file-input-area.tsx # Zone d'upload
│   │       ├── 📄 scroll-area.tsx     # Zone de scroll
│   │       └── 📄 avatar.tsx          # Avatar utilisateur
│   │
│   ├── 📁 hooks/                      # Hooks React personnalisés
│   │   └── 📄 useChat.ts              # Hook pour le chat
│   │
│   ├── 📁 i18n/                       # Configuration i18n
│   │   ├── 📄 navigation.ts           # Navigation localisée
│   │   ├── 📄 request.ts              # Configuration requêtes
│   │   └── 📄 routing.ts              # Configuration routing
│   │
│   ├── 📁 lib/                        # Utilitaires
│   │   └── 📄 utils.ts                # Fonctions utilitaires
│   │
│   ├── 📁 messages/                   # Fichiers de traduction
│   │   ├── 📄 en.json                 # Traductions anglaises
│   │   ├── 📄 fr.json                 # Traductions françaises
│   │   └── 📄 ar.json                 # Traductions arabes
│   │
│   └── 📄 middleware.ts               # Middleware Next.js
│
├── 📄 components.json                 # Configuration UI components
├── 📄 eslint.config.mjs               # Configuration ESLint
├── 📄 next.config.ts                  # Configuration Next.js
├── 📄 package.json                    # Dépendances npm
├── 📄 postcss.config.mjs              # Configuration PostCSS
├── 📄 tailwind.config.js              # Configuration Tailwind
├── 📄 tsconfig.json                   # Configuration TypeScript
└── 📄 README.md                       # Documentation principale
```

### Conventions de Nommage

#### Fichiers et Dossiers
- **Composants** : PascalCase (`MonComposant.tsx`)
- **Pages** : kebab-case (`ma-page.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useMonHook.ts`)
- **Utilitaires** : camelCase (`monUtilitaire.ts`)
- **Dossiers** : kebab-case ou camelCase selon le contexte

#### Variables et Fonctions
```typescript
// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000';

// Variables : camelCase
const userName = 'John Doe';

// Fonctions : camelCase
function handleSubmit() { }

// Composants : PascalCase
function MonComposant() { }

// Types/Interfaces : PascalCase
interface MonInterface { }
type MonType = string;
```

---

## 🎨 Système de Design

### Palette de Couleurs

#### Couleurs Principales
```css
/* Couleurs d'accent */
--emerald-400: #34d399    /* Vert principal */
--teal-400: #2dd4bf       /* Bleu-vert principal */
--emerald-500: #10b981    /* Vert hover */
--teal-500: #14b8a6       /* Bleu-vert hover */

/* Couleurs de fond */
--slate-950: #020617      /* Arrière-plan principal */
--slate-900: #0f172a      /* Arrière-plan cartes */
--slate-800: #1e293b      /* Éléments interactifs */

/* Couleurs de texte */
--white: #ffffff          /* Texte principal */
--slate-300: #cbd5e1      /* Texte secondaire */
--slate-400: #94a3b8      /* Texte désactivé */
```

#### Effets Glassmorphism
```css
/* Arrière-plans vitrés */
.glass-light {
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.glass-medium {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.glass-strong {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.3);
}
```

### Typographie

#### Hiérarchie des Polices
```css
/* Polices principales */
font-family: 'Geist Sans Variable', sans-serif;    /* Interface */
font-family: 'Geist Mono Variable', monospace;     /* Code */

/* Support multilingue */
font-family: 'Cairo', 'Amiri', 'Scheherazade New', sans-serif; /* Arabe */
```

#### Tailles de Texte
```css
/* Titres */
.text-6xl { font-size: 3.75rem; }  /* h1 - Pages principales */
.text-5xl { font-size: 3rem; }     /* h1 - Sections */
.text-4xl { font-size: 2.25rem; }  /* h2 - Sous-sections */
.text-3xl { font-size: 1.875rem; } /* h3 - Cartes */
.text-2xl { font-size: 1.5rem; }   /* h4 - Composants */
.text-xl  { font-size: 1.25rem; }  /* h5 - Éléments */

/* Corps de texte */
.text-lg   { font-size: 1.125rem; } /* Texte important */
.text-base { font-size: 1rem; }     /* Texte normal */
.text-sm   { font-size: 0.875rem; } /* Texte secondaire */
.text-xs   { font-size: 0.75rem; }  /* Labels, meta */
```

### Composants de Design

#### Boutons
```typescript
// Bouton principal
<Button className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-full">
  Action Principale
</Button>

// Bouton secondaire  
<Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-6 py-3 rounded-full">
  Action Secondaire
</Button>

// Bouton fantôme
<Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800/50">
  Action Subtile
</Button>
```

#### Cartes
```typescript
// Carte principale
<div className="p-8 bg-slate-900/30 border border-slate-800/50 rounded-2xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300">
  {/* Contenu */}
</div>

// Carte glassmorphism
<div className="p-6 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-800/50 rounded-3xl backdrop-blur-sm">
  {/* Contenu */}
</div>
```

#### Formulaires
```typescript
// Input principal
<Input className="bg-slate-800/70 backdrop-blur-sm border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30" />

// Zone de texte
<textarea className="bg-slate-900/30 border border-slate-800/50 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30" />
```

---

## 🔌 Intégration API

### Architecture Backend

Le frontend communique avec un backend FastAPI via des routes API Next.js :

```
Frontend (Next.js) → API Routes → Backend (FastAPI)
```

### Configuration API

#### Route Chat
```typescript
// src/app/api/chat/route.ts
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  
  // Transmission vers le backend
  const backendRes = await fetch("http://localhost:8000/ask", {
    method: "POST",
    body: formData,
  });
  
  return NextResponse.json(await backendRes.json());
}
```

#### Hook de Chat
```typescript
// src/hooks/useChat.ts
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: FormEvent, options?: ChatOptions) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setMessages(prev => [...prev, result]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { messages, handleSubmit, isLoading };
}
```

### Gestion des Erreurs

#### Types d'Erreurs
```typescript
interface ApiError {
  message: string;
  code: string;
  details?: any;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
```

#### Gestion dans les Composants
```typescript
const [error, setError] = useState<string | null>(null);

try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  // Traitement des données
} catch (err) {
  setError(err instanceof Error ? err.message : 'Erreur inconnue');
}
```

### Upload de Fichiers

#### Composant FileInputArea
```typescript
// Gestion du drag & drop
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const files = Array.from(e.dataTransfer.files);
    onFilesChange(files);
  }
};

// Types de fichiers supportés
const acceptedTypes = [
  'application/pdf',           // PDF
  'application/msword',        // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/plain'                // TXT
];
```

---

## ⚙️ Configuration

### Next.js Configuration

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Experimental features
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
  
  // Images optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      // Polices personnalisées
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      
      // Animations personnalisées
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  
  plugins: [
    // Plugin RTL personnalisé
    function ({ addUtilities }) {
      const newUtilities = {
        '.rtl\\:text-right': {
          '[dir="rtl"] &': { 'text-align': 'right' },
        },
        '.rtl\\:flex-row-reverse': {
          '[dir="rtl"] &': { 'flex-direction': 'row-reverse' },
        },
        // ... autres utilitaires RTL
      };
      
      addUtilities(newUtilities);
    },
  ],
};
```

### ESLint Configuration

```javascript
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
  
  {
    rules: {
      // Règles TypeScript strictes
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Règles React
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      
      // Règles d'import
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external", 
            "internal",
            "parent",
            "sibling",
            "index"
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
```

---

## 🧪 Tests

### Configuration des Tests

#### Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

#### Tests de Composants
```typescript
// __tests__/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@/components/Header';

const messages = {
  nav: {
    signIn: 'Sign In',
    getStarted: 'Get Started',
  },
};

function renderWithIntl(component: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
}

describe('Header', () => {
  it('renders logo and navigation', () => {
    renderWithIntl(<Header />);
    
    expect(screen.getByText('EduLLM')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });
  
  it('shows language switcher', () => {
    renderWithIntl(<Header />);
    
    expect(screen.getByRole('button', { name: /language/i })).toBeInTheDocument();
  });
});
```

#### Tests d'Intégration
```typescript
// __tests__/pages/chat.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '@/app/[locale]/chat/page';

// Mock du hook useChat
jest.mock('@/hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    handleSubmit: jest.fn(),
    isLoading: false,
  }),
}));

describe('Chat Page', () => {
  it('renders chat interface', () => {
    render(<ChatPage />);
    
    expect(screen.getByPlaceholderText(/ask me anything/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
  
  it('handles message submission', async () => {
    const mockSubmit = jest.fn();
    jest.mocked(useChat).mockReturnValue({
      messages: [],
      handleSubmit: mockSubmit,
      isLoading: false,
    });
    
    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText(/ask me anything/i);
    const submitButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
```

### Scripts de Test

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage

# Tests de type uniquement
npm run test:types
```

---

## 📦 Déploiement

### Préparation pour le Déploiement

#### 1. Variables d'Environnement de Production

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.edullm.com
NEXT_PUBLIC_ENV=production
NODE_ENV=production

# Analytics et monitoring
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

#### 2. Optimisations de Build

```typescript
// next.config.ts (production)
const nextConfig = {
  // Compression
  compress: true,
  
  // Optimisation des images
  images: {
    domains: ['api.edullm.com', 'cdn.edullm.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Headers de cache
  async headers() {
    return [
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Déploiement sur Vercel

#### 1. Configuration Vercel

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["fra1", "iad1"],
  
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.edullm.com"
  },
  
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  
  "redirects": [
    {
      "source": "/",
      "destination": "/en",
      "permanent": false
    }
  ]
}
```

#### 2. Déploiement CLI

```bash
# Installation de Vercel CLI
npm i -g vercel

# Connexion à Vercel
vercel login

# Déploiement
vercel --prod

# Configuration des domaines
vercel domains add edullm.com
vercel alias edullm-frontend.vercel.app edullm.com
```

### Déploiement sur Netlify

#### 1. Configuration Build

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/en/:splat"
  status = 200
  force = false

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

#### 2. Variables d'Environnement

```bash
# Via Netlify CLI
netlify env:set NEXT_PUBLIC_API_URL https://api.edullm.com
netlify env:set NODE_ENV production
```

### Déploiement Docker

#### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    networks:
      - edullm-network

  backend:
    image: edullm-backend:latest
    ports:
      - "8000:8000"
    networks:
      - edullm-network

networks:
  edullm-network:
    driver: bridge
```

### Monitoring et Performance

#### 1. Web Vitals

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

#### 2. Error Monitoring

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
});
```

---

## 🤝 Contribution

### Guide de Contribution

#### 1. Fork et Configuration

```bash
# Fork du projet
git clone https://github.com/votre-username/edullm-frontend.git
cd edullm-frontend

# Configuration de l'upstream
git remote add upstream https://github.com/original-user/edullm-frontend.git

# Installation des dépendances
npm install

# Configuration des hooks pre-commit
npm run prepare
```

#### 2. Workflow de Développement

```bash
# Créer une branche de feature
git checkout -b feature/ma-super-fonctionnalite

# Développement avec commits atomiques
git add .
git commit -m "feat: ajouter fonctionnalité X"

# Push et Pull Request
git push origin feature/ma-super-fonctionnalite
```

#### 3. Standards de Code

##### Messages de Commit (Conventional Commits)
```bash
# Types de commits
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation
style:    # Formatage, pas de changement de code
refactor: # Refactoring
test:     # Tests
chore:    # Maintenance

# Exemples
git commit -m "feat(chat): ajouter support des fichiers PDF"
git commit -m "fix(i18n): corriger traduction arabe"
git commit -m "docs: mettre à jour le README"
```

##### Standards TypeScript
```typescript
// ✅ Bon
interface UserProps {
  name: string;
  email: string;
  isActive?: boolean;
}

function UserCard({ name, email, isActive = true }: UserProps) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      {isActive && <span>Actif</span>}
    </div>
  );
}

// ❌ À éviter
function UserCard(props: any) {
  return <div>{props.name}</div>;
}
```

#### 4. Tests Requis

```bash
# Avant de soumettre une PR
npm run lint          # Vérification du code
npm run test          # Tests unitaires
npm run build         # Test de build
npm run type-check    # Vérification TypeScript
```

### Processus de Review

#### 1. Checklist PR

- [ ] Tests passent
- [ ] Code linté sans erreurs
- [ ] Documentation mise à jour
- [ ] Messages de commit suivent les conventions
- [ ] Pas de console.log laissés
- [ ] Toutes les langues testées (EN/FR/AR)
- [ ] Design responsive vérifié

#### 2. Structure de PR

```markdown
## Description
Brève description des changements.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité  
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués
- [ ] Testé sur mobile

## Screenshots
[Ajouter des captures d'écran si applicable]

## Checklist
- [ ] Code vérifié
- [ ] Tests passent
- [ ] Documentation mise à jour
```

---

## 🔍 Dépannage

### Problèmes Courants

#### 1. Erreurs de Build

**Erreur**: `Module not found: Can't resolve '@/components/...'`
```bash
# Solution: Vérifier tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Erreur**: `Error: Package subpath './server' is not defined`
```bash
# Solution: Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### 2. Problèmes d'Internationalisation

**Erreur**: `ReferenceError: locale is not defined`
```typescript
// Solution: Vérifier le middleware
// src/middleware.ts
export { routing } from './src/i18n/routing';
```

**Traductions manquantes**:
```bash
# Vérifier la structure des fichiers de messages
src/messages/
├── en.json ✓
├── fr.json ✓
└── ar.json ✓

# Vérifier la syntaxe JSON
npm run lint:json
```

#### 3. Problèmes RTL

**Layout cassé en arabe**:
```css
/* Ajouter aux styles globaux */
[dir="rtl"] .problematic-class {
  flex-direction: row-reverse;
  text-align: right;
}
```

**Icons inversés**:
```css
/* Pour certains icons qui ne doivent pas être inversés */
[dir="rtl"] .icon-no-flip {
  transform: scaleX(1) !important;
}
```

#### 4. Problèmes de Performance

**Bundle trop gros**:
```bash
# Analyser le bundle
npm run build
npm run analyze

# Optimisations possibles
# 1. Lazy loading des composants
const MonComposant = lazy(() => import('./MonComposant'));

# 2. Import spécifique
import { Button } from '@/components/ui/button';
// au lieu de
import * from '@/components/ui';
```

**Hydratation lente**:
```typescript
// Utiliser le dynamic import pour les composants lourds
import dynamic from 'next/dynamic';

const ChatInterface = dynamic(() => import('./ChatInterface'), {
  ssr: false,
  loading: () => <div>Chargement...</div>
});
```

### Outils de Debug

#### 1. Next.js DevTools

```bash
# Activer le debug Next.js
DEBUG=next:* npm run dev

# Analyser les performances
npm run build -- --debug
```

#### 2. React DevTools

```bash
# Installation
npm install -g react-devtools

# Usage
react-devtools
```

#### 3. Debugging TypeScript

```typescript
// Activer les logs de type checking
// tsconfig.json
{
  "compilerOptions": {
    "verbose": true,
    "extendedDiagnostics": true
  }
}
```

### Logs et Monitoring

#### 1. Logs de Développement

```typescript
// src/lib/logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, data?: any) => {
    if (isDev) console.log(`[INFO] ${message}`, data);
  },
  
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  
  warn: (message: string, data?: any) => {
    if (isDev) console.warn(`[WARN] ${message}`, data);
  }
};
```

#### 2. Performance Monitoring

```typescript
// src/lib/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${end - start} milliseconds`);
  }
}
```

---

## 📚 Ressources Supplémentaires

### Documentation Officielle

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl.dev/)

### Communauté

- [Next.js GitHub](https://github.com/vercel/next.js)
- [React Community](https://react.dev/community)
- [TypeScript Community](https://www.typescriptlang.org/community)

### Tutoriels Recommandés

1. **Next.js App Router**: [Learn Next.js](https://nextjs.org/learn)
2. **TypeScript**: [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
3. **Tailwind CSS**: [Tailwind UI Components](https://tailwindui.com/)
4. **Internationalisation**: [Next-intl Guide](https://next-intl.dev/docs/getting-started)

---

<div align="center">

**Documentation maintenue par l'équipe EduLLM**

Pour toute question ou suggestion, n'hésitez pas à [ouvrir une issue](https://github.com/your-username/edullm-frontend/issues) ou à nous contacter.

**Fait avec ❤️ pour l'éducation et l'IA**

</div>
