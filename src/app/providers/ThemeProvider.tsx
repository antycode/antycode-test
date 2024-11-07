import { useMemo, useState, useLayoutEffect, PropsWithChildren } from 'react';
import { LOCAL_STORAGE_THEME_KEY } from '@/shared/const/localStorage';
import { ThemeContext } from '@/shared/context/ThemeContext';
import { Theme } from '@/shared/const/context';

const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme;

export const ThemeProvider = (props: PropsWithChildren) => {
  const { children } = props;

  // const [theme, setTheme] = useState(storedTheme || Theme.DARK);
  const [theme, setTheme] = useState(Theme.DARK);

  useLayoutEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  const defaultProps = useMemo(
    () => ({
      theme,
      setTheme: setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={defaultProps}>{children}</ThemeContext.Provider>;
};
