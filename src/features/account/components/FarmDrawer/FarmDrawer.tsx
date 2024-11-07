import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer } from '@/shared/components/Drawer/Drawer';
import { FarmDrawerTabs } from '../../types';
import { FarmCreationForm } from './FarmCreationForm/FarmCreationForm';
import cls from './FarmDrawer.module.scss';
import { CreationFooter } from '../CreationFooter/CreationFooter';

interface FarmDrawerProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

export const FarmDrawer = (props: FarmDrawerProps) => {
  const { opened, setOpened } = props;

  const { t } = useTranslation();

  // const [activeTab, setActiveTab] = useState(FarmDrawerTabs.MainSettings);

  const onClose = useCallback(() => setOpened(false), []);

  return (
    <Drawer.Root opened={opened} onClose={onClose}>
      <Drawer.Header className={cls.farmHeader}>
          <div className={cls.farmHeaderTitle}>
              <p className={cls.farmHeaderTitleText}>
                  {t('Farm')}
              </p>
          </div>
        <Drawer.CloseButton />
      </Drawer.Header>

      <div className={cls.farmContent}>
        <div className={cls.farmMain}>
          <Drawer.Body>
            <FarmCreationForm setIsDrawerOpened={setOpened} />
          </Drawer.Body>
        </div>
      </div>
    </Drawer.Root>
  );
};
