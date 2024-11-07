import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@/shared/components/Table/Table';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { useAccounts } from '../../api/getAccounts';
import { ExtensionListItem } from './ExtensionListItem';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import cls from './ExtensionList.module.scss';
import { useFilterAccounts } from '../../hooks/useFilterAccounts';

interface ExtensionListProps {
  activePages: number[];
  setActivePages: React.Dispatch<React.SetStateAction<number[]>>;
  selectedRows: Set<string>;
  selectRow: (id: string, isSelected: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  setExtensions: Dispatch<SetStateAction<any | null>>;
  extensions: any | null;
  currentPage: number;
  totalPages: number;
  perPageCount: number;
  isLoading: boolean;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPerPageCount: Dispatch<SetStateAction<number>>;
}

export const ExtensionList = ({
  activePages,
  setActivePages,
  selectedRows,
  selectRow,
  setSelectedRows,
  extensions,
  currentPage,
  totalPages,
  setCurrentPage,
  setPerPageCount,
  perPageCount,
  isLoading
}: ExtensionListProps) => {
  const { t } = useTranslation();

  // const { accounts, isLoading } = useAccounts(activePages);
  const [searchName, setSearchName] = useState<string>('');

  const { setUseSearchName, setUseSearchField, filterAccounts, } = useFilterAccounts();

  const handlePerPageSelect = (perPageCount: number) => {
    setPerPageCount(perPageCount);
    setActivePages([1]);
    setCurrentPage(1)
  };

  const handleInputNameSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchName(value); 
    setUseSearchName(value); 
    setUseSearchField('title'); 
  };

  const filteredExtensions = useMemo(() => {
    if (searchName) {
      return extensions?.filter((extension: any) =>
        extension.title.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    return extensions; 
  }, [extensions, searchName]);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Col className={cls.colCheck}>
            <Table.IndeterminateCheckbox
              pageItems={filteredExtensions}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </Table.Col>
          <Table.Col className={cls.colName}>
            <div className={cls.searchWrapper}>
              <input
                placeholder={t('Name')}
                className={cls.inputAccount}
                onChange={handleInputNameSearch}
                value={searchName}
              />
              <SearchIcon className={cls.filterIcon} />
            </div>
          </Table.Col>
        </Table.Header>

        <Table.Main isLoading={isLoading}>
          <div className={cls.tableMainWrapper}>
            {filteredExtensions?.map((item: any, idx: number) => (
              <ExtensionListItem
                key={idx}
                item={item}
                isSelected={selectedRows.has(item.external_id)}
                selectRow={selectRow}
              />
            ))}

            {!isLoading && !filteredExtensions?.length && (
              <Table.NoItemsText>{t('No Extensions')}</Table.NoItemsText>
            )}
          </div>
        </Table.Main>

        {isLoading && <Table.Loader />}
      </Table>
    </>
  );
};

