import {Dispatch, SetStateAction, useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import { EditProfileForm } from './EditProfileForm/EditProfileForm';
import {RootEditProfileDrawer} from "@/features/profile/components/RootEditProfileDrawer/RootEditProfileDrawer";
import {setIsEditProfileDrawer} from "@/store/reducers/Drawers";
import {useDispatch} from "react-redux";

interface RootEditProfileDrawerProps {
  opened: boolean;
  profileToEdit: any;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const EditProfileDrawer = (props: RootEditProfileDrawerProps) => {
  const { opened, profileToEdit, setSelectedRows } = props;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setIsEditProfileDrawer(false)),
    setSelectedRows(new Set())
  },[]);

  return (
    <RootEditProfileDrawer opened={opened} onClose={onClose} profileToEdit={profileToEdit}>
      <EditProfileForm isDrawerOpened={opened} profileToEdit={profileToEdit} setSelectedRows={setSelectedRows}/>
    </RootEditProfileDrawer>
  );
};
