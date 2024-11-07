import { ipcRenderer } from 'electron';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@/shared/components/Table/Table';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { ReactComponent as ArrowIcon } from '@/shared/assets/icons/arrow.svg';
import { Profile } from '../../types';
import { ProfileListItem } from './ProfileListItem';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import { ReactComponent as ArrowUpIcon } from '@/shared/assets/icons/arrow-up.svg';
import { ReactComponent as ArrowDownIcon } from '@/shared/assets/icons/arrow-down.svg';
import { ReactComponent as CheckboxSortIcon } from '@/shared/assets/icons/checkbox-sort.svg';
import { ReactComponent as CheckboxSortSelectedIcon } from '@/shared/assets/icons/checkbox-sort-selected.svg';
import { ReactComponent as CheckboxMinusIcon } from '@/shared/assets/icons/checkbox-minus.svg';
import cls from './ProfileList.module.scss';
import { useFilterProfiles } from '@/shared/hooks';
import { useDispatch } from 'react-redux';
import { setPidProcess } from '@/store/reducers/RunBrowsersReducer';
import tableCls from '@/shared/components/Table/Table.module.scss';
import clsx from 'clsx';
import { useProfilesStore } from '@/features/profile/store';
import { fetchData } from '@/shared/config/fetch';
import { AccountInfo } from '@/features/accountInfo';

const itemsPerPageOptions = [{ value: 50 }, { value: 100 }];

interface ProfileListProp {
  activePages: number[];
  setActivePages: React.Dispatch<React.SetStateAction<number[]>>;
  selectedRows: Set<string>;
  selectRow: (id: string, isSelected: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  pidProcess?: any[];
  setProfilesData: React.Dispatch<React.SetStateAction<any[]>>;
  profilesData: any[];
  checkProxies: (proxyItem: { [key: string]: any }) => void;
  rotateProxyLink: (proxyItem: { [key: string]: any }) => void;
  setIsHandlingWindows: Dispatch<SetStateAction<boolean>>;
  isHandlingWindows: boolean;
  contentWidth: number | null;
  setIsProfileFetching: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileFetching: boolean;
  searchName: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
  searchNote: string;
  setSearchNote: React.Dispatch<React.SetStateAction<string>>;
  currentPageRecords: any, 
  setSearchFilterProxy: any,
  searchFilterProxy: string,
  setCurrentPageRecords: any
}

export const ProfileList = (props: ProfileListProp) => {
  const {
    setActivePages,
    selectedRows,
    selectRow,
    setSelectedRows,
    pidProcess,
    profilesData,
    setProfilesData,
    checkProxies,
    rotateProxyLink,
    isHandlingWindows,
    setIsHandlingWindows,
    contentWidth,
    setIsProfileFetching,
    isProfileFetching,
    searchName,
    searchNote,
    setSearchName,
    setSearchNote,
    currentPageRecords,
    searchFilterProxy,
    setCurrentPageRecords,
    setSearchFilterProxy,
  } = props;

  const { t } = useTranslation();
  const {
    currentPage,
    perPageCount,
    setCurrentPage,
    isLoading,
    setLoading,
    profilesAll,
    setPerPageCount,
    selectedTags,
    setSelectedTags,
    selectedStatuses,
    setSelectedStatuses,
    selectedFolder,
    setShouldFilterProfiles,
    shouldFilterProfiles,
    setTotalPages,
    dateFilter,
    setDateFilter,
  } = useProfilesStore();

  const dispatch = useDispatch();
  const { configData } = useProfilesStore();

  const [isDropdownTagsOpen, setIsDropdownTagsOpen] = useState<boolean>(false);
  const [isDropdownStatusOpen, setIsDropdownStatusOpen] = useState<boolean>(false);

  const dropdownTagsRef = useRef<HTMLDivElement | null>(null);
  const dropdownStatusesRef = useRef<HTMLDivElement | null>(null);
  const [dropdownTagsWidth, setDropdownTagsWidth] = useState<number | null>(null);
  const [dropdownStatusWidth, setDropdownStatusWidth] = useState<number | null>(null);
  const [searchTag, setSearchTag] = useState<string>('');
  const [firstLoad, setFirstLoad] = useState(false);

  let allTags: string[] = [];
  profilesAll?.forEach((profile: any) => {
    profile.tags.map((tag: string) => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  const handleDropdownOpen = (item: string) => {
    if (item === 'tags') {
      setIsDropdownTagsOpen(true);
    } else if (item === 'statuses') {
      setIsDropdownStatusOpen(true);
    }
  };

  const handleDropdownClose = (item: string) => {
    if (item === 'tags') {
      setIsDropdownTagsOpen(false);
    } else if (item === 'statuses') {
      setIsDropdownStatusOpen(false);
    }
  };

  const handleInputNameSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchName(value);
  };
  const handleInputNoteSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchNote(value);
  };

  const filteredProfiles = useMemo(() => {
    return currentPageRecords.filter((profile: any) => {
      const matchesTitle = searchName
        ? profile.title.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchesNote = searchNote
        ? profile.note.toLowerCase().includes(searchNote.toLowerCase())
        : true;
      return matchesTitle && matchesNote;
    });
  }, [currentPageRecords, searchName, searchNote]);

  const displaySearchInput = (
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    searchIconClass?: string,
  ) => {
    return (
      <div className={tableCls.searchWrapper}>
        <input
          placeholder={label}
          className={tableCls.searchInput}
          value={value}
          onChange={onChange}
        />
        <SearchIcon width={13} height={13} className={clsx(tableCls.searchIcon, searchIconClass)} />
      </div>
    );
  };

  const filterRecordsBySearchTextProxy = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const searchText = event.target.value.toLowerCase();
    setSearchFilterProxy(`${field}=${searchText}`);
    if (!searchText) {
      fetchDataProfiles(currentPage, selectedStatuses, selectedTags, dateFilter, selectedFolder);
    }
  };

  const displaySearchInputProxy = (label: string, fieldName: string, searchIconClass?: string) => {
    let searchText = '';
    if (searchFilterProxy.includes('=')) {
      const fieldAndText = searchFilterProxy.split('=');
      if (fieldAndText[0] == fieldName) {
        searchText = fieldAndText[1];
      }
    }
    return (
      <div className={tableCls.searchWrapper}>
        <input
          placeholder={label}
          className={tableCls.searchInput}
          value={searchText}
          onChange={(e) => filterRecordsBySearchTextProxy(e, fieldName)}
        />
        <SearchIcon width={13} height={13} className={clsx(tableCls.searchIcon, searchIconClass)} />
      </div>
    );
  };

  const sortProfilesByTags = (tag: string) => {
    setShouldFilterProfiles(true);
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((item: string) => item !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const selectAllTags = () => {
    setShouldFilterProfiles(true);
    if (selectedTags.length !== allTags.length) {
      setSelectedTags([...allTags]);
    } else {
      setSelectedTags([]);
    }
  };

  const selectAllStatuses = () => {
    setShouldFilterProfiles(true);
    if (selectedStatuses.length !== configData?.statuses.length) {
      setSelectedStatuses([...configData?.statuses]);
    } else {
      setSelectedStatuses([]);
    }
  };

  const getFilteredTags = (): string[] => {
    if (!searchTag) {
      return allTags;
    }
    return allTags.filter((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()));
  };

  const toggleSortOrder = () => {
    const newSortOrder = dateFilter === 'ASC' ? 'DESC' : 'ASC';
    setDateFilter(newSortOrder);
    fetchDataProfiles(currentPage, selectedStatuses, selectedTags, newSortOrder, selectedFolder);
  };

  const fetchDataProfiles = async (
    page: number = 1,
    selectedStatuses: Array<{ external_id: string }> = [],
    selectedTags: string[] = [],
    sortOrder = dateFilter,
    folderId?: string,
  ) => {
    if (isProfileFetching) return;

    setIsProfileFetching(true);
    if (firstLoad) {
      setLoading(true);
    }

    const teamId = localStorage.getItem('teamId');
    const statuses = selectedStatuses.map((status) => status.external_id).join(',');
    const tags = selectedTags.join(',');

    let url = `/profile?count=${perPageCount}&page=${page}&date_sort=${sortOrder}&is_basket=0`;
    if (folderId && folderId !== 'all') {
      url += `&folders=${folderId}`;
    }
    if (statuses) {
      url += `&statuses=${statuses}`;
    }
    if (tags) {
      url += `&tags=${tags}`;
    }

    try {
      const data = await fetchData({
        url,
        method: 'GET',
        team: teamId,
      });

      if (data.is_success) {
        setTotalPages(data.settings?.total_pages || 1);
        setCurrentPageRecords(data.data);
        setCurrentPage(page);
        setFirstLoad(true);
      } else {
        console.error('Fetch failed:', data.errors);
      }
    } catch (err) {
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
      setIsProfileFetching(false);
    }
  };

  const handleStatusClick = (status: any) => {
    const updatedStatuses = selectedStatuses.some((s) => s.external_id === status.external_id)
      ? selectedStatuses.filter((s) => s.external_id !== status.external_id)
      : [...selectedStatuses, status];

    console.log('updatedStatuses', updatedStatuses);

    setSelectedStatuses(updatedStatuses);
    setActivePages([1]);
  };

  const updateDisplayedProfiles = () => {
    setCurrentPage(1);
    setActivePages([1]);
  };

  const filterProfiles = () => {
    setShouldFilterProfiles(false);
  };

  useEffect(() => {
    if (shouldFilterProfiles) {
      updateDisplayedProfiles();
      filterProfiles();
    }
  }, [selectedStatuses, selectedTags, selectedFolder]);

  useEffect(() => {
    ipcRenderer.on('processPid', (i, pid, processId) => {
      const newPidProcess = { id: processId, pid };
      dispatch(setPidProcess([...(pidProcess || []), newPidProcess]));
    });
  }, [pidProcess]);

  useEffect(() => {
    if (selectedFolder) {
      fetchDataProfiles(currentPage, selectedStatuses, selectedTags, dateFilter, selectedFolder);
    } else {
      fetchDataProfiles(currentPage, selectedStatuses, selectedTags, dateFilter);
    }
  }, [
    currentPage,
    perPageCount,
    selectedStatuses,
    selectedTags,
    selectedFolder,
    dateFilter,
    profilesAll,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownTagsRef.current &&
        !dropdownTagsRef.current.contains(event.target as HTMLElement)
      ) {
        setIsDropdownTagsOpen(false);
        setSearchTag('');
      }
    };

    if (isDropdownTagsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownTagsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownStatusesRef.current &&
        !dropdownStatusesRef.current.contains(event.target as HTMLElement)
      ) {
        setIsDropdownStatusOpen(false);
      }
    };

    if (isDropdownStatusOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownStatusOpen]);

  useEffect(() => {
    setShouldFilterProfiles(false);
  }, []);

  useEffect(() => {
    const updateWidth = (ref: any, setWidth: any) => {
      if (ref.current) {
        setWidth((prevWidth: any) => {
          const newWidth = ref.current.offsetWidth;
          return newWidth !== prevWidth ? newWidth : prevWidth;
        });
      }
    };

    const handleResize = () => {
      updateWidth(dropdownTagsRef, setDropdownTagsWidth);
      updateWidth(dropdownStatusesRef, setDropdownStatusWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Table className={cls.table}>
        <Table.Header>
          <Table.Col className={cls.colCheck}>
            <Table.IndeterminateCheckbox
              pageItems={filteredProfiles}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </Table.Col>
          <Table.Col className={cls.colName}>
            <div className={cls.searchWrapper}>
              {displaySearchInput(t('Profile name'), searchName, handleInputNameSearch)}
            </div>
          </Table.Col>
          <Table.Col className={cls.colProxy}>
            <div className={cls.searchWrapper}>
              {displaySearchInputProxy(t('Proxy name'), 'title')}
            </div>
          </Table.Col>
          <Table.Col className={cls.colStatus} dropdownRef={dropdownStatusesRef}>
            <div
              className={cls.searchWrapper}
              onClick={() => {
                isDropdownStatusOpen
                  ? handleDropdownClose('statuses')
                  : handleDropdownOpen('statuses');
              }}>
              <span className={cls.freeSpace} />
              <p>{t('Status')}</p>
              {isDropdownStatusOpen ? (
                <ArrowUpIcon className={cls.filterSortIcon} />
              ) : (
                <ArrowDownIcon className={cls.filterSortIcon} />
              )}
            </div>
            {isDropdownStatusOpen && (
              <div
                className={cls.dropdown}
                style={{ width: `${dropdownStatusWidth}px`, paddingTop: '15px' }}>
                {configData?.statuses.length > 0 ? (
                  <div className={cls.selectItemsWrapper}>
                    <div className={cls.selectAllWrapper}>
                      <div
                        className={clsx(cls.selectItem, cls.selectAll)}
                        onClick={selectAllStatuses}>
                        <p>{t('Select all')}</p>
                        {!selectedStatuses.length && <CheckboxSortIcon />}
                        {selectedStatuses.length === configData?.statuses.length && (
                          <CheckboxSortSelectedIcon className={cls.checkboxSelected} />
                        )}
                        {selectedStatuses.length > 0 &&
                          selectedStatuses.length !== configData?.statuses.length && (
                            <CheckboxMinusIcon />
                          )}
                      </div>
                    </div>
                    <div
                      className={
                        configData?.statuses.length < 5
                          ? cls.chooseItemsWrapperUpTo5
                          : cls.chooseItemsWrapper
                      }>
                      {configData?.statuses.map((status: { [key: string]: any }, index: number) => (
                        <div
                          className={cls.selectItem}
                          key={index}
                          onClick={() => handleStatusClick(status)}>
                          <div className={cls.statusNameWrapper}>
                            <span
                              className={cls.statusColor}
                              style={{ background: `${status.color}` }}
                            />
                            <p className={cls.statusText}>
                              {status.title.length > 14
                                ? `${status.title.slice(0, 14)}...`
                                : status.title}
                            </p>
                          </div>
                          {selectedStatuses.find(
                            (item: { [key: string]: any }) =>
                              item.external_id === status.external_id,
                          ) ? (
                            <CheckboxSortSelectedIcon className={cls.checkboxSelected} />
                          ) : (
                            <CheckboxSortIcon />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={cls.itemsNotFound}>{t('Statuses not found')}</div>
                )}
              </div>
            )}
          </Table.Col>
          <Table.Col className={cls.colTags} dropdownRef={dropdownTagsRef}>
            <div
              className={cls.searchWrapper}
              onClick={() => {
                isDropdownTagsOpen ? handleDropdownClose('tags') : handleDropdownOpen('tags');
              }}>
              <span className={cls.freeSpace} />
              <p>{t('Tags')}</p>
              {isDropdownTagsOpen ? (
                <ArrowUpIcon className={cls.filterSortIcon} />
              ) : (
                <ArrowDownIcon className={cls.filterSortIcon} />
              )}
            </div>
            {isDropdownTagsOpen && (
              <div className={cls.dropdown} style={{ width: `${dropdownTagsWidth}px` }}>
                <div className={cls.searchTagsWrapper}>
                  <input
                    className={cls.inputSearchTags}
                    type="text"
                    placeholder={t('Find tags')}
                    onChange={(event) => setSearchTag(event.target.value)}
                  />
                  <SearchIcon />
                </div>
                {getFilteredTags().length > 0 ? (
                  <div className={cls.selectItemsWrapper} style={{ paddingTop: '10px' }}>
                    {!searchTag && (
                      <div className={cls.selectAllWrapper}>
                        <div
                          className={clsx(cls.selectItem, cls.selectAll)}
                          onClick={selectAllTags}>
                          <p>{t('Select all')}</p>
                          {!selectedTags.length && <CheckboxSortIcon />}
                          {selectedTags.length === allTags.length && (
                            <CheckboxSortSelectedIcon className={cls.checkboxSelected} />
                          )}
                          {selectedTags.length > 0 && selectedTags.length !== allTags.length && (
                            <CheckboxMinusIcon />
                          )}
                        </div>
                      </div>
                    )}
                    <div
                      className={
                        getFilteredTags().length < 5
                          ? cls.chooseItemsWrapperUpTo5
                          : cls.chooseItemsWrapper
                      }>
                      {getFilteredTags().map((tag: string, index: number) => (
                        <div
                          className={cls.selectItem}
                          key={index}
                          onClick={() => sortProfilesByTags(tag)}>
                          <p className={cls.tagText}>
                            {tag.length > 14 ? `${tag.slice(0, 14)}...` : tag}
                          </p>
                          {selectedTags.includes(tag) ? (
                            <CheckboxSortSelectedIcon className={cls.checkboxSelected} />
                          ) : (
                            <CheckboxSortIcon />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={cls.itemsNotFound}>{t('Tags not found')}</div>
                )}
              </div>
            )}
          </Table.Col>
          <Table.Col className={cls.colNote}>
            {displaySearchInput(t('Note'), searchNote, handleInputNoteSearch)}
          </Table.Col>
          <Table.Col className={cls.colDate}>
            <div className={cls.searchWrapper} onClick={toggleSortOrder}>
              <span className={cls.freeSpace} />
              <p>{getDateTitle(profilesAll)}</p>
              {dateFilter === 'ASC' ? (
                <ArrowDownIcon className={cls.filterSortIcon} />
              ) : (
                <ArrowUpIcon className={cls.filterSortIcon} />
              )}
            </div>
          </Table.Col>
          {contentWidth && contentWidth >= 1000 && (
            <Table.Col className={cls.colTimer}>{t('Timer')}</Table.Col>
          )}
          <Table.Col
            className={contentWidth && contentWidth < 1400 ? cls.colActionSecond : cls.colAction}>
            {t('Launch')}
          </Table.Col>
        </Table.Header>

        <Table.Main isLoading={isLoading}>
          <div className={cls.tableMainWrapper}>
            {filteredProfiles.map((item: any, idx: any) => (
              <ProfileListItem
                setSelectedRows={setSelectedRows}
                pidProcess={pidProcess}
                setPidProcess={setPidProcess}
                key={idx}
                item={item}
                isSelected={selectedRows.has(item?.external_id)}
                selectRow={selectRow}
                selectedRows={selectedRows}
                profilesData={profilesData}
                setProfilesData={setProfilesData}
                checkProxies={checkProxies}
                rotateProxyLink={rotateProxyLink}
                isHandlingWindows={isHandlingWindows}
                setIsHandlingWindows={setIsHandlingWindows}
                contentWidth={contentWidth}
              />
            ))}

            {!isLoading && !currentPageRecords.length && (
              <Table.NoItemsText>{t('No profiles')}</Table.NoItemsText>
            )}
          </div>
        </Table.Main>

        {isLoading && <Table.Loader />}
      </Table>
    </>
  );
};

function getDateTitle(profilesAll?: Profile[] | null | undefined): JSX.Element | string {
  const { t } = useTranslation();

  // if (!profilesAll || profilesAll.length === 0) return '—';

  // const dateFrom = cookies[0].created_at.toDate();
  // const dateTo = cookies[cookies.length - 1].created_at.toDate();
  const dateFrom = new Date();
  const dateTo = new Date();

  // Get day, month, and last two digits of the year for both dates
  const dayFrom = dateFrom.getDate();
  const monthFrom = dateFrom.getMonth() + 1; // Months are 0-indexed
  const yearFrom = dateFrom.getFullYear() % 100;

  const dayTo = dateTo.getDate();
  const monthTo = dateTo.getMonth() + 1; // Months are 0-indexed
  const yearTo = dateTo.getFullYear() % 100;

  // Format the month with a leading "0" if necessary
  const formattedMonthFrom = monthFrom < 10 ? `0${monthFrom}` : `${monthFrom}`;
  const formattedMonthTo = monthTo < 10 ? `0${monthTo}` : `${monthTo}`;

  // Create formatted date strings
  const formattedDateFrom = `${dayFrom}.${formattedMonthFrom}.${yearFrom}`;
  const formattedDateTo = `${dayTo}.${formattedMonthTo}.${yearTo}`;

  return (
    <>
      {/*{formattedDateTo}*/}
      {/*<span className={cls.colDateDivider}>&nbsp;—&nbsp;</span>*/}
      {/*{formattedDateFrom}*/}
      {t('Date')}
    </>
  );
}
