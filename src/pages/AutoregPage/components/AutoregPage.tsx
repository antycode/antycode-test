import { useEffect, useState } from 'react';
import { doc, writeBatch } from 'firebase/firestore';
import { AccountList } from '@/features/account';
import { useAccountsStore } from '@/features/account/store';
import { db } from '@/shared/lib/firebase';
import { AutoregPageHeader } from './AutoregPageHeader/AutoregPageHeader';
import cls from './AutoregPage.module.scss';
import { useRowSelection } from '@/shared/hooks';
import { AccountInfo } from '@/features/accountInfo';
import { fetchData } from '@/shared/config/fetch';
import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localStorage';
import { useProfilesStore } from '@/features/profile/store';
import { AccountInfoSimple } from '@/features/accountInfo/components/AccountInfoSimple';

export const AutoregPage = () => {
  const [activePages, setActivePages] = useState<[number, ...number[]]>([1]);
  const { resetAccounts } = useAccountsStore();
  const { setProfilesConfigData } = useProfilesStore();
  const { selectedRows, selectRow, setSelectedRows } = useRowSelection();

  const deleteAccounts = async () => {
    const batch = writeBatch(db);
    selectedRows.forEach((acc) => batch.delete(doc(db, 'accounts', acc)));
    await batch.commit();
  };

  const handleRefetch = () => {
    setActivePages([1]);
    resetAccounts({ exclude: ['perPageCount'] });
  };

  const fetchProfileConfig = () => {
    const lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY) as string;
    const teamId = localStorage.getItem('teamId');
    const urlApi = lang === 'ru' ? '/profile/config' : `/${lang}/profile/config`;
    fetchData({ url: urlApi, method: 'GET', team: teamId })
      .then((data: any) => {
        setProfilesConfigData(data.data);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProfileConfig();
  }, []);

  return (
    <div className="page">
      <div className={cls.content}>
        <AutoregPageHeader deleteAccounts={deleteAccounts} handleRefetch={handleRefetch} />
        <AccountList
          activePages={activePages}
          setActivePages={setActivePages}
          selectedRows={selectedRows}
          selectRow={selectRow}
          setSelectedRows={setSelectedRows}
        />
      </div>
      {/* <AccountInfo /> */}
      <AccountInfoSimple className={cls.info}/>
      {/*<div className={cls.footer}></div>*/}
    </div>
  );
};
