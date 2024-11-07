import { Drawer } from '@/shared/components/Drawer/Drawer';
import cls from './RootEditProfileDrawer.module.scss';
import { t } from 'i18next';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import React from 'react';
import { useRowSelection } from '@/shared/hooks';

interface RootEditProfileDrawerProps {
  opened: boolean;
  children?: React.ReactNode;
  headerComponent?: React.ReactNode;
  onClose(): void;
  profileToEdit: any;
}

export const RootEditProfileDrawer = (props: RootEditProfileDrawerProps) => {
  const { children, opened, onClose, headerComponent, profileToEdit } = props;
  const { setSelectedRows } = useRowSelection();

  const onClickCloseDrawerButton = () => {
    if (onClose) {
      onClose();
      setSelectedRows(new Set());
    }
  };

  return (
    <Drawer.Root opened={opened} onClose={onClose}>
      <Drawer.Header className={cls.profileHeader}>
        <div className={cls.headerProfileBtns}>
          <div className={cls.headerBtnWrapper}>
            <button className={cls.headerProfileBtn}>
              {t('Edit profile')} [{profileToEdit?.title}]
            </button>
          </div>
        </div>
        <button onClick={() => onClickCloseDrawerButton()}>
          <CloseIcon />
        </button>
        {headerComponent}
      </Drawer.Header>
      <div className={cls.profileMain}>
        <Drawer.Body>{children}</Drawer.Body>
      </div>
    </Drawer.Root>
  );
};
