import { Button } from '../../Button';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import cls from './DrawerCloseButton.module.scss';
import clsx from 'clsx';
import { useContext } from 'react';
import { DrawerContext } from '../Drawer.context';

interface DrawerCloseButtonProps {
  className?: string;
}

export const DrawerCloseButton = (props: DrawerCloseButtonProps) => {
  const { className } = props;

  const { onClose } = useContext(DrawerContext);

  return (
    <Button
      className={clsx(cls.drawerCloseButton, className)}
      variant="unstyled"
      onClick={onClose}
    >
      <CloseIcon />
    </Button>
  );
};
