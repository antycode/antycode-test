import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button } from '@/shared/components/Button';
import cls from './AutoregPageHeader.module.scss';
import { AccCreationDrawer } from '@/features/account';
import { ReactComponent as IconPlay } from '@/shared/assets/icons/play.svg';
import { ReactComponent as IconPlusCircle } from '@/shared/assets/icons/plus-circle.svg';
import { ReactComponent as IconPause } from '@/shared/assets/icons/pause.svg';
import { ReactComponent as IconTrash } from '@/shared/assets/icons/trash.svg';
import { ReactComponent as ImportIcon } from '@/shared/assets/icons/import-1.svg';
import { ReactComponent as PassIcon } from '@/shared/assets/icons/pass.svg';
import { TestActions } from './TestActions';
import { RefetchButton } from '@/shared/components/RefetchButton/RefetchButton';
import { useAccountsStore } from '@/features/account/store';
import { FarmDrawer } from '@/features/account/components/FarmDrawer/FarmDrawer';

enum ButtonTypes {
  autoreg = 'btnAutoreg',
  farm = 'btnFarm',
  passToProfiles = 'btnPassToProfiles',
  passToUser = 'btnPassToUser',
  download = 'btnDownload',
  deleteIcon = 'btnDeleteIcon',
  deleteProfiles = 'btnDeleteProfiles',
  runProfiles = 'btnRunProfiles',
  stopProfiles = 'btnStopProfiles',
  createAccount = 'btnCreateAccount',
}

interface AutoregPageHeader {
  deleteAccounts: any; //TODO
  handleRefetch: () => void;
}

export const AutoregPageHeader = (props: AutoregPageHeader) => {
  const { deleteAccounts, handleRefetch } = props;

  const { t } = useTranslation();

  const [isAccDrawer, setIsAccDrawer] = useState(false);
  const [isFarmDrawer, setIsFarmDrawer] = useState(false);

  return (
    <div className={cls.autoregHeader}>
      <div className={cls.actionsLeft}>
        <Button className={clsx(cls.btn, cls[ButtonTypes.passToProfiles])} leftIcon={<PassIcon width={16} height={16} style={{ marginRight: '2px' }} />}>
          {t('Pass to profiles')}
        </Button>

        <Button className={clsx(cls.btn, cls[ButtonTypes.download])} leftIcon={<ImportIcon width={16} height={16} style={{ marginRight: '2px' }} />}>
          {t('Download')}
        </Button>

        <Button
          className={clsx(cls.btn, cls[ButtonTypes.deleteIcon])}
          isActionIcon
          onClick={() => {
            if (window.confirm('Удалить выбранные аккаунты?')) {
              deleteAccounts();
            }
          }}
          leftIcon={<IconTrash width={16} height={16} style={{ marginRight: '2px' }} />}
        >
          {t('Delete')}
        </Button>

        {/* TEST //TODO */}
        {/* <TestActions /> */}
      </div>

      <div className={cls.actionsRight}>
        <Button
          className={clsx(cls[ButtonTypes.createAccount])}
          color="primary"
          onClick={() => setIsAccDrawer(true)}
          leftIcon={
            <IconPlusCircle width={18} height={18} style={{ marginRight: '2px' }} />
          }
        >
          {t('Autoreg')}
        </Button>

        {/* <Button
            className={clsx(cls.btn, cls[ButtonTypes.farm])}
            onClick={() => { setIsFarmDrawer(true) }}
            leftIcon={<IconPlusCircle width={18} height={18} style={{ marginRight: '2px' }} />}
        >
            {t('Autofarm')}
        </Button> */}
      </div>
      <FarmDrawer opened={isFarmDrawer} setOpened={setIsFarmDrawer} />
      <AccCreationDrawer opened={isAccDrawer} setOpened={setIsAccDrawer} />
    </div>
  );
};
