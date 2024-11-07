import { useContext } from 'react';
import { Theme } from '@/shared/const/context';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';

interface UseThemeResult {
  toggleTheme: () => void;
  theme: Theme;
}

export function useTheme(): UseThemeResult {
  const { theme, setTheme } = useContext(ThemeContext) as ThemeContextType;

  const toggleTheme = () => {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    setTheme?.(newTheme);
  };

  return {
    theme: theme || Theme.DARK,
    toggleTheme,
  };
}
