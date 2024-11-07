import { ReactNode, useEffect } from 'react';
import { DrawerRoot } from './DrawerRoot/DrawerRoot';
import { DrawerBody } from './DrawerBody/DrawerBody';
import { DrawerHeader } from './DrawerHeader/DrawerHeader';
import { DrawerCloseButton } from './DrawerCloseButton/DrawerCloseButton';
import { DrawerSidebarTabs } from './DrawerSidebarTabs/DrawerSidebarTabs';
import { DrawerFooter } from './DrawerFooter/DrawerFooter';

interface DrawerProps {
  withCloseButton?: boolean;
  closeOnEscape?: boolean;
  opened: boolean;
  onClose(): void;
  children?: ReactNode;
}

export const Drawer = (props: DrawerProps) => {
  const { opened, onClose, children, closeOnEscape, withCloseButton = true } = props;

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const hasHeader = withCloseButton;

  return (
    <DrawerRoot opened={opened} onClose={onClose}>
      {hasHeader && (
        <DrawerHeader>{withCloseButton && <DrawerCloseButton />}</DrawerHeader>
      )}

      <DrawerBody>{children}</DrawerBody>
    </DrawerRoot>
  );
};

Drawer.Root = DrawerRoot;
Drawer.Header = DrawerHeader;
Drawer.CloseButton = DrawerCloseButton;
Drawer.Body = DrawerBody;
Drawer.SidebarTabs = DrawerSidebarTabs;
Drawer.Footer = DrawerFooter;
