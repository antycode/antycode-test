import React, {Dispatch, SetStateAction, useCallback, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileCreationForm } from './ProfileCreationForm/ProfileCreationForm';
import { ProfileDrawer } from '../ProfileDrawer/ProfileDrawer';
import {ProfileMassImportForm} from "@/features/profile/components/ProfileCreationDrawer/ProfileMassImportForm/ProfileMassImportForm";
import {useDispatch} from "react-redux";
import {setIsProfileCreationDrawer} from "@/store/reducers/Drawers";

interface ProfileCreationDrawerProps {
  opened: boolean;
}

export const ProfileCreationDrawer = (props: ProfileCreationDrawerProps) => {
  const { opened } = props;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [openedDrawer, setOpenedDrawer] = useState<string>('NewProfile');

  const onClose = useCallback(() => dispatch(setIsProfileCreationDrawer(false)), []);

  const handleNewProfileClick = () => {
    setOpenedDrawer('NewProfile');
  };

  const handleMassImportClick = () => {
    setOpenedDrawer('MassImport');
  };

  return (
      <ProfileDrawer opened={opened} onClose={onClose} onNewProfileClick={handleNewProfileClick} onMassImportClick={handleMassImportClick} openedDrawer={openedDrawer}>
      {openedDrawer === 'NewProfile' && <ProfileCreationForm isDrawerOpened={opened} />}
      {openedDrawer === 'MassImport' && <ProfileMassImportForm />}
    </ProfileDrawer>
  );
};
