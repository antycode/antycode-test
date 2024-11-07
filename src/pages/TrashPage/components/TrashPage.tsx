import React, { useEffect, useState } from 'react';
import cls from '@/pages/ProfilesPage/components/ProfilesPage.module.scss';
import { TrashPageHeader } from '@/pages/TrashPage/components/TrashPageHeader/TrashPageHeader';
import { TrashProfileList } from '@/features/trash/components/TrashProfiles/TrashProfileList';
import { useRowSelection } from '@/shared/hooks';
import { TrashProxyList } from '@/features/trash/components/TrashProxies/TrashProxyList';
import { TrashAccounts } from '@/features/trash/components/TrashAccounts/TrashAccounts';
import { fetchData } from '@/shared/config/fetch';
import { setToken } from '@/store/reducers/AuthReducer';
import { useProfilesTrashStore } from '@/features/trash/store';
import { useDispatch } from 'react-redux';
import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localStorage';
import { useProfilesStore } from '@/features/profile/store';
import { Loader } from '@/shared/components/Loader';
import { AccountInfo } from '@/features/accountInfo';
import { useFilterProfilesTrash } from '@/shared/hooks/useFilterProfilesTrash';
import { useProxiesStore } from '@/features/proxy/store';

const itemsPerPageOptions = [{ value: 50 }, { value: 100 }];

export const TrashPage = () => {
  const {
    currentPage,
    perPageCount,
    setCurrentPage,
    isLoading,
    totalCount,
    profilesAll,
    setPerPageCount,
    filteredProfilesAll,
    selectedTags,
    setSelectedTags,
    selectedStatuses,
    setSelectedStatuses,
    setFilteredProfilesAll,
    setProfilesAllData,
    selectedFolder,
    setShouldFilterProfiles,
    shouldFilterProfiles,
    totalPages,
    setTotalPages,
  } = useProfilesTrashStore();
  const { configData } = useProfilesStore();

  const {
    setUseSort,
    useSort,
    useSort2,
    setUseSort2,
    searchFilter,
    setSearchFilter,
    currentPageRecords,
    setSearchFilterProxy,
    searchFilterProxy,
    setCurrentPageRecords,
  } = useFilterProfilesTrash({
    allRecords: filteredProfilesAll,
    currentPage,
    perPageCount,
  });

  const {
    perPageCount: perPageCountProxy,
    setCurrentPage: setCurrentPageProxy,
    setPerPageCount: setPerPageCountProxy,
    allProxies,
    currentPage: currentPageProxy,
    setTotalPagesCount,
    totalPagesCount,
  } = useProxiesStore();

  const dispatch = useDispatch();

  const [activePages, setActivePages] = useState<[number, ...number[]]>([1]);
  const [activeComponent, setActiveComponent] = useState<string>('Profiles');
  const [loaderIsActive, setLoaderIsActive] = useState<boolean>(true);

  const { selectedRows, selectRow, setSelectedRows } = useRowSelection();
  const [pidProcess, setPidProcess] = useState<any[]>([]);

  const handleProfilesClick = () => {
    setActiveComponent('Profiles');
  };

  const handleProxiesClick = () => {
    setActiveComponent('Proxies');
  };

  const handleAccountsClick = () => {
    setActiveComponent('Accounts');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActivePages([page]);
    setSearchFilter('');
    setSearchFilterProxy('');
  };

  const handlePageChangeProxy = (page: number) => {
    setCurrentPageProxy(page);
    setActivePages([page]);
    setSearchFilter('');
  };

  const handlePerPageSelectProxy = (perPageCount: number) => {
    setPerPageCountProxy(perPageCount);
    setCurrentPageProxy(1);
  };

  const handlePerPageSelect = (perPageCount: number) => {
    setPerPageCount(perPageCount);
    setCurrentPage(1);
    setActivePages([1]);
  };

  const deleteProfiles = async () => {
    const teamId = localStorage.getItem('teamId');
    try {
      const profileArr = [...selectedRows];
      const promises = profileArr.map((external_id) =>
        fetchData({
          url: `/profile/${external_id}`,
          method: 'DELETE',
          team: teamId,
        }),
      );
      await Promise.all(promises);
      const profiles = profilesAll.filter(
        (profile: any) => !profileArr.includes(profile.external_id),
      );
      setProfilesAllData(profiles);
      setSelectedRows(new Set());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfile = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: '/profile', method: 'GET', team: teamId })
      .then((data: any) => {
        if (data.errorCode === 7 && data.errorMessage && data.errorMessage.includes('not found')) {
          return dispatch(setToken(''));
        }
        if (data.is_success) {
          const profilesInBasket = data?.data.filter((profile: any) => profile.date_basket);
          setProfilesAllData(profilesInBasket);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="page">
      <div className={cls.content}>
        <TrashPageHeader
          setLoaderIsActive={setLoaderIsActive}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          deleteProfiles={deleteProfiles}
          onProfilesClick={handleProfilesClick}
          onProxiesClick={handleProxiesClick}
          onAccountsClick={handleAccountsClick}
          activeComponent={activeComponent}
        />

        {activeComponent === 'Profiles' && (
          <TrashProfileList
            searchFilterProxy={searchFilterProxy}
            setCurrentPageRecords={setCurrentPageRecords}
            setSearchFilterProxy={setSearchFilterProxy}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            currentPageRecords={currentPageRecords}
            useSort={useSort}
            useSort2={useSort2}
            setUseSort={setUseSort}
            setUseSort2={setUseSort2}
            activePages={activePages}
            setActivePages={setActivePages}
            selectedRows={selectedRows}
            selectRow={selectRow}
            setSelectedRows={setSelectedRows}
            pidProcess={pidProcess}
          />
        )}

        {activeComponent === 'Proxies' && (
          <TrashProxyList
            activePages={activePages}
            setActivePages={setActivePages}
            selectedRows={selectedRows}
            selectRow={selectRow}
            setSelectedRows={setSelectedRows}
          />
        )}

        {/* {activeComponent === 'Accounts' && ( */}
        {/*    <TrashAccounts/>*/}
        {/*)}*/}
      </div>
      {activeComponent === 'Profiles' && (
        <AccountInfo
          activePages={activePages}
          currentPage={currentPage}
          totalPages={totalPages}
          perPageCount={perPageCount}
          handlePageChange={handlePageChange}
          handlePerPageSelect={handlePerPageSelect}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      )}
      {activeComponent === 'Proxies' && (
        <AccountInfo
          totalPages={totalPagesCount}
          currentPage={currentPageProxy}
          handlePageChange={handlePageChangeProxy}
          handlePerPageSelect={handlePerPageSelectProxy}
          perPageCount={perPageCountProxy}
          activePages={activePages}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      )}
    </div>
  );
};
