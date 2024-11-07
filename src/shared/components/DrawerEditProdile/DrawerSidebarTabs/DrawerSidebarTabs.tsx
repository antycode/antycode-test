import clsx from 'clsx';
import cls from './DrawerSidebarTabs.module.scss';

interface Tab {
  id: number;
  label: string;
}

interface DrawerSidebarTabsProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab(id: number): void;
}

export const DrawerSidebarTabs = (props: DrawerSidebarTabsProps) => {
  const { tabs, activeTab, setActiveTab } = props;

  return (
    <div className={cls.sidebarTabs}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          className={clsx(cls.tab, {
            [cls.tabActive]: id === activeTab,
          })}
          onClick={() => setActiveTab(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
