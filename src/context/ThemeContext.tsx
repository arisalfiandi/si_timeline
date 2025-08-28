// src/components/layout/ThemeProvider.tsx (contoh nama file)
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Penting untuk reset CSS bawaan MUI
import { Plus_Jakarta_Sans } from 'next/font/google';

export const plus = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Buat tema MUI yang dinamis
  const muiTheme = createTheme({
    direction: 'ltr',
    palette: {
      mode: theme,
    },
    typography: {
      fontFamily: plus.style.fontFamily,
      h1: {
        fontWeight: 600,
        fontSize: '2.25rem',
        lineHeight: '2.75rem',
        fontFamily: plus.style.fontFamily,
      },
      h2: {
        fontWeight: 600,
        fontSize: '1.875rem',
        lineHeight: '2.25rem',
        fontFamily: plus.style.fontFamily,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: '1.75rem',
        fontFamily: plus.style.fontFamily,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.3125rem',
        lineHeight: '1.6rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: '1.6rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: '1.2rem',
      },
      button: {
        textTransform: 'capitalize',
        fontWeight: 400,
      },
      body1: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: '1.334rem',
      },
      body2: {
        fontSize: '0.75rem',
        letterSpacing: '0rem',
        fontWeight: 400,
        lineHeight: '1rem',
      },
      subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 400,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 400,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '.MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation': {
            boxShadow:
              'rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px !important',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '7px',
          },
        },
      },
    },
    colorSchemes: { light: true, dark: true },
    cssVariables: {
      colorSchemeSelector: 'class',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Bungkus aplikasi dengan MuiThemeProvider */}
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
