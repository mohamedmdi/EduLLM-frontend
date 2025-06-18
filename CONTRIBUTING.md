# Contributing to EduLLM Frontend

Thank you for your interest in contributing to EduLLM! This guide will help you get started with contributing to our AI-powered educational platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Git
- A code editor (VS Code recommended)

### Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/your-username/edullm-frontend.git
cd edullm-frontend

# 3. Add upstream remote
git remote add upstream https://github.com/original-user/edullm-frontend.git

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev
```

## 📋 Development Workflow

### 1. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, readable code
- Follow our coding standards
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Lint your code
npm run lint

# Build the project
npm run build

# Test in all languages
# Visit: localhost:3000/en, /fr, /ar
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description
git commit -m "feat(chat): add file upload support"
git commit -m "fix(i18n): correct Arabic translations"
git commit -m "docs: update README with new features"
```

**Commit Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## 🎯 Contribution Guidelines

### Code Style

#### TypeScript
```typescript
// ✅ Good
interface UserProps {
  name: string;
  email: string;
  isActive?: boolean;
}

function UserComponent({ name, email, isActive = true }: UserProps) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      {isActive && <span>Active</span>}
    </div>
  );
}

// ❌ Avoid
function UserComponent(props: any) {
  return <div>{props.name}</div>;
}
```

#### React Components
```typescript
// Use function components with TypeScript
export default function MyComponent({ prop1, prop2 }: Props) {
  // Component logic
  return <div>Content</div>;
}

// Use descriptive prop interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}
```

#### CSS/Tailwind
```typescript
// Use semantic class names
<div className="chat-message bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4">
  {content}
</div>

// Group related classes
<Button className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-full transition-all duration-300">
  {label}
</Button>
```

### File Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Pages**: kebab-case (`my-page.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMyHook.ts`)
- **Utils**: camelCase (`myUtility.ts`)
- **Types**: PascalCase (`MyTypes.ts`)

### Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── feature/          # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## 🌍 Internationalization

### Adding New Languages

1. **Add locale to routing configuration:**
```typescript
// src/i18n/routing.ts
export const routing = createNavigation({
  locales: ['en', 'fr', 'ar', 'es'], // Add new locale
  defaultLocale: 'en'
});
```

2. **Create translation file:**
```bash
# Create new translation file
touch src/messages/es.json
```

3. **Add translations:**
```json
{
  "nav": {
    "home": "Inicio",
    "chat": "Chat",
    "qcm": "Cuestionarios"
  }
}
```

### Translation Guidelines

- Keep translations consistent across all languages
- Use placeholders for dynamic content: `"welcome": "Hello, {name}!"`
- Test RTL languages (Arabic) thoroughly
- Provide context for translators in comments

## 🧪 Testing

### Writing Tests

#### Component Tests
```typescript
// __tests__/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    const handleClick = jest.fn();
    render(<MyComponent onAction={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### Integration Tests
```typescript
// __tests__/pages/chat.test.tsx
import { render, screen } from '@testing-library/react';
import ChatPage from '@/app/[locale]/chat/page';

describe('Chat Page', () => {
  it('renders chat interface', () => {
    render(<ChatPage />);
    expect(screen.getByPlaceholderText(/ask me anything/i)).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test MyComponent.test.tsx
```

## 🎨 Design System

### Colors

Use our predefined color palette:

```typescript
// Primary colors
const colors = {
  emerald: '#34d399',
  teal: '#2dd4bf',
  slate: {
    950: '#020617',
    900: '#0f172a',
    800: '#1e293b',
    // ...
  }
};
```

### Components

Follow our glassmorphism design:

```typescript
// Card component example
<div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
  {content}
</div>

// Button component example
<Button className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500">
  {label}
</Button>
```

## 🎨 Theme System Development

### Working with Themes

EduLLM uses a comprehensive theme system supporting light, dark, and system themes. When contributing:

#### Using Theme-Aware Classes
```typescript
// ✅ Use theme-aware CSS variables
<div className="bg-background text-foreground border-border">
  Content adapts to current theme
</div>

// ❌ Avoid hardcoded colors
<div className="bg-white text-black border-gray-300">
  Fixed colors don't adapt to themes
</div>
```

#### Available CSS Variables
```css
/* Background & Surface */
--background         /* Main background */
--foreground         /* Main text color */
--card              /* Card backgrounds */
--card-foreground   /* Card text */
--muted             /* Muted backgrounds */
--muted-foreground  /* Muted text */

/* Interactive Elements */
--primary           /* Primary buttons/links */
--primary-foreground
--secondary         /* Secondary elements */
--secondary-foreground

/* Status Colors */
--destructive       /* Error/danger states */
--destructive-foreground
--accent            /* Accent elements */
--accent-foreground

/* Borders & Separators */
--border            /* Standard borders */
--input             /* Input borders */
--ring              /* Focus rings */
```

#### Theme Provider Usage
```typescript
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-background text-foreground">
      <button 
        onClick={toggleTheme}
        className="bg-primary text-primary-foreground"
      >
        Switch to {actualTheme === 'light' ? 'dark' : 'light'} theme
      </button>
    </div>
  );
}
```

#### Testing Themes
When developing components:
1. Test in both light and dark themes
2. Verify system theme detection works
3. Check theme persistence across page reloads
4. Ensure smooth theme transitions

```bash
# Test theme switching
# 1. Open localhost:3000
# 2. Click theme toggle in header
# 3. Refresh page (theme should persist)
# 4. Change system theme (should auto-update if system theme selected)
```

## 📝 Documentation

### Code Documentation

```typescript
/**
 * Hook for managing chat functionality
 * @param initialMessages - Initial messages array
 * @returns Chat state and handlers
 */
export function useChat(initialMessages: Message[] = []) {
  // Implementation
}

/**
 * Component for displaying a chat message
 * @param message - The message to display
 * @param isUser - Whether the message is from user
 */
interface MessageProps {
  message: string;
  isUser: boolean;
}
```

### README Updates

When adding new features:

1. Update the features list
2. Add setup instructions if needed
3. Include examples of usage
4. Update screenshots if UI changed

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try to reproduce the bug
3. Test in different browsers/languages
4. Gather system information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 91]
- Language: [e.g. Arabic]
- Version: [e.g. 1.0.0]
```

## ✨ Feature Requests

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Use Case**
Describe your use case and why this feature would be valuable.

**Proposed Solution**
If you have ideas on how to implement this feature.

**Additional Context**
Any other context, screenshots, or examples.
```

## 🔍 Pull Request Guidelines

### PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows our style guidelines
- [ ] Tests pass (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated
- [ ] All languages tested (EN/FR/AR)
- [ ] Mobile responsiveness checked
- [ ] No console.log statements left
- [ ] Commit messages follow conventions

### PR Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed
- [ ] Tested on mobile devices
- [ ] Tested in all supported languages

## Screenshots
Add screenshots if applicable, especially for UI changes.

## Related Issues
Closes #[issue number]
```

### Review Process

1. **Automated Checks**: CI/CD will run tests and linting
2. **Code Review**: Maintainers will review your code
3. **Testing**: Manual testing in different environments
4. **Approval**: At least one maintainer approval required
5. **Merge**: Squash and merge to main branch

## 🎯 Areas for Contribution

### High Priority

- **Performance optimizations**
- **Accessibility improvements**
- **Mobile experience enhancements**
- **Additional language support**
- **Test coverage improvements**

### Medium Priority

- **New UI components**
- **Documentation improvements**
- **Developer experience tools**
- **Error handling enhancements**

### Low Priority

- **Code refactoring**
- **Minor UI polishing**
- **Additional examples**

## 💡 Getting Help

### Community

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bug reports and feature requests
- **Discord/Slack**: For real-time chat (if available)

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl.dev/)

## 📄 License

By contributing to EduLLM, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to EduLLM! Your contributions help make education more accessible and effective through AI technology. 🚀

**Happy coding!** 💻✨
