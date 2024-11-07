import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { Table } from '@/shared/components/Table/Table';
import cls from '@/features/trash/components/TrashProfiles/TrashProfileList.module.scss';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import { ReactComponent as ArrowDownIcon } from '@/shared/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/shared/assets/icons/arrow-up.svg';
import { TrashProfileListItem } from '@/features/trash/components/TrashProfiles/TrashProfileListItem';
import { ReactComponent as ArrowIcon } from '@/shared/assets/icons/arrow.svg';
import { PageCounter } from '@/shared/components/PageCounter/PageCounter';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { Profile } from '@/features/profile/types';
import { useTranslation } from 'react-i18next';
import { useProfiles } from '@/features/profile/api/getProfiles';
import { useFilterProfiles } from '@/shared/hooks/useFilterProfiles';
import { ipcRenderer } from 'electron';
import clsx from 'clsx';
import { useProfilesStore } from '@/features/profile/store';
import { useDispatch } from 'react-redux';
import tableCls from '@/shared/components/Table/Table.module.scss';
import { setPidProcess } from '@/store/reducers/RunBrowsersReducer';
import { ReactComponent as CheckboxSortIcon } from '@/shared/assets/icons/checkbox-sort.svg';
import { ReactComponent as CheckboxSortSelectedIcon } from '@/shared/assets/icons/checkbox-sort-selected.svg';
import { ReactComponent as CheckboxMinusIcon } from '@/shared/assets/icons/checkbox-minus.svg';
import { ProfileListItem } from '@/features/profile/components/ProfileList/ProfileListItem';
import { useProfilesTrashStore } from '@/features/trash/store';
import { useFilterProfilesTrash } from '@/shared/hooks/useFilterProfilesTrash';
import { fetchData } from '@/shared/config/fetch';

interface TrashProfileListProp {
  activePages: [number, ...number[]];
  setActivePages: React.Dispatch<React.SetStateAction<[number, ...number[]]>>;
  selectedRows: Set<string>;
  selectRow: (id: string, isSelected: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  pidProcess?: any[];
  setUseSort: any;
  useSort: boolean;
  useSort2: boolean;
  setUseSort2: any;
  searchFilter: string;
  setSearchFilter: any;
  currentPageRecords: Profile[];
  setSearchFilterProxy: any;
  searchFilterProxy: string;
  setCurrentPageRecords: any;
}

export const TrashProfileList = (props: TrashProfileListProp) => {
  const {
    activePages,
    setActivePages,
    selectedRows,
    selectRow,
    setSelectedRows,
    pidProcess,
    useSort2,
    currentPageRecords,
    searchFilter,
    searchFilterProxy,
    setCurrentPageRecords,
    setSearchFilter,
    setSearchFilterProxy,
    setUseSort,
    setUseSort2,
    useSort,
  } = props;

  const { t } = useTranslation();
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

  const dispatch = useDispatch();
  const { configData } = useProfilesStore();

  const [isDropdownTagsOpen, setIsDropdownTagsOpen] = useState<boolean>(false);
  const [isDropdownStatusOpen, setIsDropdownStatusOpen] = useState<boolean>(false);

  const dropdownTagsRef = useRef<HTMLDivElement | null>(null);
  const dropdownStatusesRef = useRef<HTMLDivElement | null>(null);
  const [dropdownTagsWidth, setDropdownTagsWidth] = useState<number | null>(null);
  const [dropdownStatusWidth, setDropdownStatusWidth] = useState<number | null>(null);
  const [searchTag, setSearchTag] = useState<string>('');
  // const [shouldFilterProfiles, setShouldFilterProfiles] = useState<boolean>(false);
  const [sortDirection, setSortDirection] = useState<any>('asc');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  let allTags: string[] = [];
  profilesAll?.forEach((profile: any) => {
    profile.tags.map((tag: string) => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  const fetchDataProfiles = async (page: number = 1) => {
    const teamId = localStorage.getItem('teamId');

    let url = `/profile?count=${perPageCount}&page=${page}&is_basket=1`;

    try {
      const data = await fetchData({
        url,
        method: 'GET',
        team: teamId,
      });

      if (data.is_success) {
        setTotalPages(data.settings?.total_pages || 1);
        setCurrentPageRecords(data.data);
        console.log('data.data', data.data);
        setCurrentPage(page);
      } else {
        console.error('Fetch failed:', data.errors);
      }
    } catch (err) {
      console.log('Fetch error:', err);
    }
    // finally {
    //   setLoading(false);
    //   setIsProfileFetching(false);
    // }
  };

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

  const handleChangeSort = () => {
    setUseSort((prev: any) => !prev);
    setActivePages([currentPage]);
    setFilteredProfilesAll([...filteredProfilesAll.reverse()]);
  };

  const handleChangeSortDateDeleted = () => {
    setUseSort2((prev: any) => !prev);

    const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newSortDirection);

    const sortedProfiles = [...filteredProfilesAll].sort((a: any, b: any) => {
      const dateA = new Date(a.date_basket).getTime();
      const dateB = new Date(b.date_basket).getTime();

      if (newSortDirection === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setFilteredProfilesAll(sortedProfiles);
    setActivePages([currentPage]);
  };

  const filterRecordsBySearchText = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!event.target.value) {
      setCurrentPage(currentPage);
      setActivePages([currentPage]);
    }
    setSearchFilter(`${field}=${event.target.value.toLowerCase()}`);
  };

  const displaySearchInput = (label: string, fieldName: string, searchIconClass?: string) => {
    let searchText = '';
    if (searchFilter.includes('=')) {
      const fieldAndText = searchFilter.split('=');
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
          onChange={(e) => filterRecordsBySearchText(e, fieldName)}
        />
        <SearchIcon width={13} height={13} className={clsx(tableCls.searchIcon, searchIconClass)} />
      </div>
    );
  };

  const filterRecordsBySearchTextProxy = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    if (!event.target.value) {
      setCurrentPage(currentPage);
      setActivePages([currentPage]);
    }
    setSearchFilterProxy(`${field}=${event.target.value.toLowerCase()}`);
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

  const getCurrentPageProfiles = async () => {
    const startIndex = (currentPage - 1) * perPageCount;
    const endIndex = startIndex + perPageCount;
    return filteredProfilesAll.slice(startIndex, endIndex);
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

  const getFilteredTags = () => {
    return allTags.filter((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()));
  };

  const sortProfilesByStatuses = (status: { [key: string]: any }) => {
    setShouldFilterProfiles(true);
    if (
      selectedStatuses.find(
        (item: { [key: string]: any }) => item.external_id === status.external_id,
      )
    ) {
      setSelectedStatuses([
        ...selectedStatuses.filter(
          (item: { [key: string]: any }) => item.external_id !== status.external_id,
        ),
      ]);
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const filterProfilesByTagsAndStatusesAndFolders = () => {
    let filteredProfiles = profilesAll.filter((profile) => {
      if (selectedTags.length > 0) {
        return selectedTags.some((tag: string) => profile.tags?.includes(tag));
      }
      return true;
    });

    filteredProfiles = filteredProfiles.filter((profile) => {
      if (selectedStatuses.length === 0) {
        return true;
      } else {
        return selectedStatuses.some(
          (status) => profile.profile_status_external_id === status.external_id,
        );
      }
    });

    filteredProfiles = filteredProfiles.filter((profile) => {
      if (selectedFolder === 'all') {
        return true;
      } else {
        return profile.folders.some((folderId: string) => folderId === selectedFolder);
      }
    });

    setFilteredProfilesAll([...filteredProfiles]);
  };

  const updateDisplayedProfiles = () => {
    const startIndex = (currentPage - 1) * perPageCount;
    const endIndex = startIndex + perPageCount;
    const currentPageProfiles = filteredProfilesAll.slice(startIndex, endIndex);
    setCurrentPage(1);
    setActivePages([1]);
  };

  const filterProfiles = () => {
    setShouldFilterProfiles(false);
    filterProfilesByTagsAndStatusesAndFolders();
  };

  useEffect(() => {
    if (shouldFilterProfiles) {
      updateDisplayedProfiles();
      filterProfiles();
    }
  }, [selectedStatuses, selectedTags, selectedFolder]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  useEffect(() => {
    ipcRenderer.on('processPid', (i, pid, processId) => {
      const newPidProcess = { id: processId, pid };
      dispatch(setPidProcess([...(pidProcess || []), newPidProcess]));
    });
  }, [pidProcess]);

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
    setFilteredProfilesAll(profilesAll);
    filterProfiles();
  }, [profilesAll]);

  useEffect(() => {
    fetchDataProfiles(currentPage);
  }, [perPageCount]);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Col className={cls.colCheck}>
            <Table.IndeterminateCheckbox
              pageItems={currentPageRecords}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </Table.Col>
          <Table.Col className={cls.colName}>
            <div className={cls.searchWrapper}>
              {displaySearchInput(t('Profile name'), 'title')}
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
                          onClick={() => sortProfilesByStatuses(status)}>
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
          <Table.Col className={cls.colNote}>{displaySearchInput(t('Note'), 'note')}</Table.Col>
          <Table.Col className={cls.colDate}>
            <div className={cls.searchWrapper} onClick={handleChangeSort}>
              <span className={cls.freeSpace} />
              <p>{t('Date created')}</p>
              {!useSort && <ArrowDownIcon className={cls.filterSortIcon} />}
              {useSort && <ArrowUpIcon className={cls.filterSortIcon} />}
            </div>
          </Table.Col>
          <Table.Col className={cls.colDate}>
            <div className={cls.searchWrapper} onClick={handleChangeSortDateDeleted}>
              <span className={cls.freeSpace} />
              <p>{t('Date deleted')}</p>
              {!useSort2 && <ArrowDownIcon className={cls.filterSortIcon} />}
              {useSort2 && <ArrowUpIcon className={cls.filterSortIcon} />}
            </div>
          </Table.Col>
          <Table.Col className={cls.colAction}>{t('Cleaning')}</Table.Col>
        </Table.Header>

        <Table.Main isLoading={isLoading}>
          <div className={cls.tableMainWrapper}>
            {currentPageRecords.map((item, idx) => (
              <TrashProfileListItem
                pidProcess={pidProcess}
                setPidProcess={setPidProcess}
                key={idx}
                item={item}
                isSelected={selectedRows.has(item?.external_id)}
                selectRow={selectRow}
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

function getDateTitle(profiles?: Profile[] | null | undefined): JSX.Element | string {
  if (!profiles || profiles.length === 0) return '—';

  // const dateFrom = profiles[0].created_at.toDate();
  // const dateTo = profiles[profiles.length - 1].created_at.toDate();
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
      {formattedDateTo}
      <span className={cls.colDateDivider}>&nbsp;—&nbsp;</span>
      {formattedDateFrom}
    </>
  );
}
