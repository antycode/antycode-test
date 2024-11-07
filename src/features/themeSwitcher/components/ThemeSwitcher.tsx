import { Theme } from '@/shared/const/context';
import { useTheme } from '@/shared/hooks/useTheme';
import { Switch } from '@/shared/components/Switch/Switch';
import cls from './ThemeSwitcher.module.scss';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      className={cls.switch}
      checked={theme === Theme.LIGHT}
      onChange={toggleTheme}
    />
  );
};
