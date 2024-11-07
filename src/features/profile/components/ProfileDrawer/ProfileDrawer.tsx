import { Drawer } from '@/shared/components/Drawer/Drawer';
import cls from './ProfileDrawer.module.scss';
import { t } from 'i18next';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import React from 'react';
import { useRowSelection } from '@/shared/hooks';

interface ProfileDrawerProps {
  opened: boolean;
  children?: React.ReactNode;
  headerComponent?: React.ReactNode;
  onNewProfileClick: () => void;
  onMassImportClick: () => void;
  openedDrawer: string;
  onClose(): void;
}

export const ProfileDrawer = (props: ProfileDrawerProps) => {
  const {
    children,
    opened,
    onClose,
    headerComponent,
    onNewProfileClick,
    onMassImportClick,
    openedDrawer,
  } = props;

  const onClickCloseDrawerButton = () => {
    if (onClose) {
      onNewProfileClick();
      onClose();
    }
  };

  return (
    <Drawer.Root opened={opened} onClose={onClose}>
      <Drawer.Header className={cls.profileHeader}>
        <div className={cls.headerProfileBtns}>
          <div className={cls.headerBtnWrapper} data-btn-new-profile-active={openedDrawer}>
            <button className={cls.headerProfileBtn} onClick={() => onNewProfileClick()}>
              {t('New profile')}
            </button>
          </div>
          <div className={cls.headerBtnWrapper} data-btn-mass-import-active={openedDrawer}>
            <button className={cls.headerProfileBtn} onClick={() => onMassImportClick()}>
              {t('Mass import')}
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
