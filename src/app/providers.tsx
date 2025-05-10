'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode, useEffect, createContext, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

interface ThemeContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

// Create Theme Context
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

export function Providers({ children }: ProvidersProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initialize theme and set mounted state
    // Always use dark mode in this application
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply theme class to document only when mounted
    if (mounted) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  const contextValue: ThemeContextType = {
    theme,
    setTheme: (newTheme: 'dark' | 'light') => {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ClerkProvider>
        {children}
      </ClerkProvider>
    </ThemeContext.Provider>
  );
} 