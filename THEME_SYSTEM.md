# Theme System Documentation

## Overview

EduLLM features a comprehensive theme system that supports light, dark, and system-preference themes with seamless switching and persistent storage.

## Features

- ✅ **Light Theme**: Clean, bright interface
- ✅ **Dark Theme**: Elegant dark interface with reduced eye strain
- ✅ **System Theme**: Automatically follows OS preference
- ✅ **Persistent Storage**: Theme choice saved in localStorage
- ✅ **Real-time Switching**: Instant theme changes without page reload
- ✅ **CSS Variables**: All colors use custom properties for seamless theming
- ✅ **Component Integration**: All UI components automatically adapt to theme
- ✅ **RTL Support**: Theme system works with right-to-left layouts

## Implementation

### Theme Provider

The theme system is implemented using React Context:

```typescript
// src/components/ThemeProvider.tsx
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

### Usage in Components

```typescript
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-background text-foreground">
      <p>Current theme: {actualTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      
      {/* Or set specific theme */}
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

### Theme Switcher Components

Two pre-built theme switcher components are available:

#### Full Theme Switcher
```typescript
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

// Dropdown with all three options (light, dark, system)
<ThemeSwitcher />
```

#### Simple Toggle
```typescript
import { SimpleThemeToggle } from '@/components/ThemeSwitcher';

// Simple toggle between light and dark
<SimpleThemeToggle />
```

## CSS Variables

### Light Theme Colors
```css
:root {
  --background: oklch(0.995 0 0);      /* Pure white background */
  --foreground: oklch(0.165 0 0);      /* Dark text */
  --card: oklch(0.995 0 0);            /* Card background */
  --card-foreground: oklch(0.165 0 0); /* Card text */
  --popover: oklch(0.995 0 0);         /* Popover background */
  --popover-foreground: oklch(0.165 0 0); /* Popover text */
  --primary: oklch(0.225 0 0);         /* Primary buttons */
  --primary-foreground: oklch(0.985 0 0); /* Primary button text */
  --secondary: oklch(0.96 0 0);        /* Secondary buttons */
  --secondary-foreground: oklch(0.225 0 0); /* Secondary button text */
  --muted: oklch(0.96 0 0);            /* Muted backgrounds */
  --muted-foreground: oklch(0.546 0 0); /* Muted text */
  --accent: oklch(0.96 0 0);           /* Accent backgrounds */
  --accent-foreground: oklch(0.225 0 0); /* Accent text */
  --destructive: oklch(0.577 0.245 27.325); /* Error/danger */
  --border: oklch(0.912 0 0);          /* Border color */
  --input: oklch(0.912 0 0);           /* Input backgrounds */
  --ring: oklch(0.698 0 0);            /* Focus rings */
}
```

### Dark Theme Colors
```css
.dark {
  --background: oklch(0.135 0 0);      /* Dark background */
  --foreground: oklch(0.975 0 0);      /* Light text */
  --card: oklch(0.195 0 0);            /* Card background */
  --card-foreground: oklch(0.975 0 0); /* Card text */
  --popover: oklch(0.195 0 0);         /* Popover background */
  --popover-foreground: oklch(0.975 0 0); /* Popover text */
  --primary: oklch(0.912 0 0);         /* Primary buttons */
  --primary-foreground: oklch(0.195 0 0); /* Primary button text */
  --secondary: oklch(0.259 0 0);       /* Secondary buttons */
  --secondary-foreground: oklch(0.975 0 0); /* Secondary button text */
  --muted: oklch(0.259 0 0);           /* Muted backgrounds */
  --muted-foreground: oklch(0.698 0 0); /* Muted text */
  --accent: oklch(0.259 0 0);          /* Accent backgrounds */
  --accent-foreground: oklch(0.975 0 0); /* Accent text */
  --destructive: oklch(0.704 0.191 22.216); /* Error/danger */
  --border: oklch(0.259 0 0);          /* Border color */
  --input: oklch(0.259 0 0);           /* Input backgrounds */
  --ring: oklch(0.546 0 0);            /* Focus rings */
}
```

### Brand Colors (Consistent Across Themes)
```css
/* These remain the same in both themes */
--emerald-400: #34d399;
--emerald-500: #10b981;
--teal-400: #2dd4bf;
--teal-500: #14b8a6;
```

## Best Practices

### Using Theme Colors in Components

❌ **Don't use hardcoded colors:**
```css
.my-component {
  background-color: #020617;
  color: #ffffff;
}
```

✅ **Use CSS variables:**
```css
.my-component {
  background-color: var(--background);
  color: var(--foreground);
}
```

✅ **Or use Tailwind classes:**
```jsx
<div className="bg-background text-foreground border-border">
  Content adapts to theme automatically
</div>
```

### Creating Theme-Aware Components

```typescript
// Good: Uses semantic color classes
function ThemedCard({ children }) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-4">
      {children}
    </div>
  );
}

// Even better: Supports custom styling while maintaining theme awareness
function ThemedCard({ children, className = "" }) {
  return (
    <div className={`bg-card text-card-foreground border border-border rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
}
```

### Handling Brand Colors

Brand colors (emerald, teal) should be used sparingly for:
- Primary action buttons
- Key highlights
- Logo and branding elements
- Success states

```jsx
// Primary action button
<button className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white">
  Get Started
</button>

// Secondary button (theme-aware)
<button className="bg-secondary text-secondary-foreground">
  Cancel
</button>
```

## Integration with Existing Components

### Updating Legacy Components

If you have components with hardcoded colors, update them systematically:

1. **Identify hardcoded colors:**
   ```bash
   grep -r "bg-slate\|text-slate\|border-slate" src/
   ```

2. **Replace with semantic classes:**
   - `bg-slate-950` → `bg-background`
   - `bg-slate-900` → `bg-card`
   - `text-white` → `text-foreground`
   - `text-slate-400` → `text-muted-foreground`
   - `border-slate-800` → `border-border`

3. **Test in both themes:**
   - Switch to light theme and verify contrast
   - Switch to dark theme and verify contrast
   - Check focus states and hover effects

## Accessibility

The theme system includes accessibility considerations:

- **High Contrast**: Both themes meet WCAG contrast requirements
- **Focus Indicators**: Clear focus rings that adapt to theme
- **Reduced Motion**: Respects `prefers-reduced-motion` for animations
- **System Preference**: Automatically detects and follows OS theme preference

## Troubleshooting

### Common Issues

1. **Component not adapting to theme:**
   - Check if using hardcoded colors instead of CSS variables
   - Ensure component is wrapped in `ThemeProvider`

2. **Flash of wrong theme on page load:**
   - Ensure theme detection happens before render
   - Consider adding a loading state

3. **Custom components breaking theme:**
   - Use semantic color classes instead of specific colors
   - Test in both light and dark themes

### Debug Theme State

```typescript
function ThemeDebugger() {
  const { theme, actualTheme } = useTheme();
  
  return (
    <div className="fixed bottom-4 right-4 bg-card p-2 border rounded">
      <p>Theme: {theme}</p>
      <p>Actual: {actualTheme}</p>
      <p>System: {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}</p>
    </div>
  );
}
```

## Future Enhancements

Potential improvements to the theme system:

- [ ] **Custom Themes**: Allow users to create custom color schemes
- [ ] **High Contrast Mode**: Additional accessibility theme
- [ ] **Seasonal Themes**: Special themes for holidays/events
- [ ] **Component-Level Theming**: Override theme for specific components
- [ ] **Theme Transitions**: Animated transitions between themes
