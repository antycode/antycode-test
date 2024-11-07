import React, { Dispatch, SetStateAction, useState } from 'react';
import cls from './TrashPageHeader.module.scss';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CrossIcon } from '@/shared/assets/icons/cross.svg';
import { ReactComponent as TrashIcon1 } from '@/shared/assets/icons/trash-icon-1.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { Button } from '@/shared/components/Button';
import clsx from 'clsx';
import { ReactComponent as IconPlusCircle } from '@/shared/assets/icons/plus-circle.svg';
import { useSelector } from 'react-redux';
import { fetchData } from '@/shared/config/fetch';
import { useProfilesTrashStore } from '@/features/trash/store';

interface TrashPageHeaderProps {
  onProfilesClick: () => void;
  onProxiesClick: () => void;
  onAccountsClick: () => void;
  activeComponent: string;
  deleteProfiles: () => void;
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  setLoaderIsActive: Dispatch<SetStateAction<boolean>>;
}

export const TrashPageHeader = (props: TrashPageHeaderProps) => {
  const {
    onProfilesClick,
    onProxiesClick,
    onAccountsClick,
    activeComponent,
    deleteProfiles,
    selectedRows,
    setSelectedRows,
    setLoaderIsActive,
  } = props;

  const { t } = useTranslation();

  const platform = useSelector((state: any) => state.platformReducer.platform);

  const { profilesAll, setProfilesAllData } = useProfilesTrashStore();

  const [isOpenDeleteProfilesPopup, setIsOpenDeleteProfilesPopup] = useState<boolean>(false);

  const openDeleteProfilesPopup = () => {
    setIsOpenDeleteProfilesPopup(true);
  };

  const closeDeleteProfilePopup = () => {
    setIsOpenDeleteProfilesPopup(false);
  };

  const deleteSelectedProfiles = async () => {
    await setIsOpenDeleteProfilesPopup(false);
    await deleteProfiles();
    await setSelectedRows(new Set());
  };

  const restoreData = async () => {
    const teamId = localStorage.getItem('teamId');
    setLoaderIsActive(true);
    try {
      const profileArr = [...selectedRows];
      const promises = profileArr.map((external_id) => {
        const submitData = {
          date_basket: null,
        };
        fetchData({
          url: `/profile/${external_id}`,
          method: 'PATCH',
          data: submitData,
          team: teamId,
        });
      });
      await Promise.all(promises);
      const profiles = profilesAll.filter(
        (profile: any) => !profileArr.includes(profile.external_id),
      );
      setProfilesAllData(profiles);
      setLoaderIsActive(false);
      setSelectedRows(new Set());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={cls.trashHeader}>
      <div className={cls.actionsLeft}>
        <button
          className={cls.btn}
          data-trash-profiles-active={activeComponent}
          onClick={() => onProfilesClick()}>
          {t('Profiles')}
        </button>
        <button
          className={cls.btn}
          data-trash-proxies-active={activeComponent}
          onClick={() => onProxiesClick()}>
          {t('Proxies')}
        </button>
        <button className={cls.btn} disabled data-trash-accounts-active={activeComponent} onClick={() => onAccountsClick()}>{t('Accounts')}</button>
      </div>
      <div className={cls.actionsRight}>
        <Button
          color="primary"
          disabled={selectedRows.size == 0}
          onClick={restoreData}
          leftIcon={<IconPlusCircle width={18} height={18} style={{ marginRight: '2px' }} />}>
          <p
            className={clsx(
              platform && platform === 'Windows' ? cls.addProxyTextWin : cls.addProxyText,
            )}>
            {t('Restore')}
          </p>
        </Button>
        <Button
          className={cls.btnClear}
          leftIcon={<CrossIcon />}
          disabled={selectedRows.size == 0}
          onClick={openDeleteProfilesPopup}>
          <p
            className={clsx(
              platform && platform === 'Windows' ? cls.addProxyTextWin : cls.addProxyText,
            )}>
            {t('Clear')}
          </p>
        </Button>
      </div>
      <ModalWindow modalWindowOpen={isOpenDeleteProfilesPopup} onClose={closeDeleteProfilePopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <TrashIcon1 />
            <p className={cls.modalTitle}>{t('Delete profile')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => closeDeleteProfilePopup()} />
        </div>
        <div className={cls.modalContent}>
          <div className={cls.warningTextContent}>
            <p className={cls.warningText1}>
              {t('Are you sure you want to delete the selected profiles?')}
            </p>
            <p className={cls.warningText2}>{t('The files will be deleted permanently')}</p>
          </div>
          <div className={cls.approveContent}>
            <button className={cls.btnCancel} onClick={() => closeDeleteProfilePopup()}>
              {t('Cancel')}
            </button>
            <button className={cls.btnDelete} onClick={() => deleteSelectedProfiles()}>
              {t('Delete')}
            </button>
          </div>
        </div>
      </ModalWindow>
    </div>
  );
};
