import { useEffect, useState } from 'react';
import { ExtensionPageHeader } from './ExtensionPageHeader/ExtensionPageHeader';
import cls from './ExtensionPage.module.scss';
import { useRowSelection } from '@/shared/hooks';
import { ExtensionList } from '@/features/account/components/ExtensionList/ExtensionList';
import { fetchData } from '@/shared/config/fetch';
import { useExtensionsStore } from '@/features/account/components/ExtensionList/store';
import { AccountInfo } from '@/features/accountInfo';

export interface CreateExtensionParams {
  title: string;
  url: string;
  logo: any;
  is_public: boolean;
}

const itemsPerPageOptions = [{ value: 50 }, { value: 100 }];

export const ExtensionPage = () => {
  const { extensions, setExtensions, firstLoaded, setFirstLoaded } = useExtensionsStore();
  const [activePages, setActivePages] = useState<number[]>([1]);
  const [perPageCount, setPerPageCount] = useState<number>(50);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedRows, selectRow, setSelectedRows } = useRowSelection();

  const handlePerPageSelect = (perPageCount: number) => {
    setPerPageCount(perPageCount);
    setActivePages([1]);
    setCurrentPage(1)
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActivePages([page]);
  };

  const getExtensions = (page = 1) => {
    const teamId = localStorage.getItem('teamId');
    if (firstLoaded) {
      setIsLoading(true);
    }
    try {
      fetchData({
        url: `/profile/extension?count=${perPageCount}&page=${page}`,
        method: 'GET',
        team: teamId || '',
      }).then((data: any) => {
        if (data.is_success) {
          setExtensions(data.data);
          setTotalPages(data.settings?.total_pages || 1);
          setCurrentPage(page);
          setFirstLoaded(true);
        } else {
          console.error('Fetch failed:', data.errors);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getExtensions(currentPage);
  }, [perPageCount, currentPage]);

  return (
    <div className="page">
      <div className={cls.content}>
        <ExtensionPageHeader
          extensions={extensions}
          getExtensions={getExtensions}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          setActivePages={setActivePages}
        />
        <ExtensionList
          setCurrentPage={setCurrentPage}
          perPageCount={perPageCount}
          currentPage={currentPage}
          totalPages={totalPages}
          setExtensions={setExtensions}
          extensions={extensions}
          activePages={activePages}
          setActivePages={setActivePages}
          selectedRows={selectedRows}
          selectRow={selectRow}
          setSelectedRows={setSelectedRows}
          setPerPageCount={setPerPageCount}
          isLoading={isLoading}
        />
      </div>
      <AccountInfo
        handlePageChange={handlePageChange}
        handlePerPageSelect={handlePerPageSelect}
        activePages={activePages}
        currentPage={currentPage}
        perPageCount={perPageCount}
        totalPages={totalPages}
        itemsPerPageOptions={itemsPerPageOptions}
      />
    </div>
  );
};
