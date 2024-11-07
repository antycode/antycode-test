import { useEffect, useState } from 'react';
import { useProxiesStore } from '@/features/proxy/store';

export const useFilterProfiles = <T>({
  allRecords,
  currentPage,
  perPageCount,
}: {
  allRecords: T[];
  currentPage: number;
  perPageCount: number;
}) => {
  const { allProxies } = useProxiesStore();

  const [currentPageRecords, setCurrentPageRecords] = useState<T[]>([]);
  const [searchFilterProxy, setSearchFilterProxy] = useState<string>('');

  const filterRecordsBySearchTextProxy = (searchField: string, searchText: string): T[] => {
    return allRecords.filter((item: any) => {
      const proxyExternalId = item.profile_proxy_external_id;
      const proxy = allProxies.find((proxy: any) => proxy.external_id === proxyExternalId);
      if (proxy) {
        const fieldValue = `${proxy.host}:${proxy.port}`;
        return proxy.title.toLowerCase().includes(searchText.toLowerCase()) || fieldValue.toLowerCase().includes(searchText.toLowerCase());
      }
      return false;
    });
  };

  const getItemsForCurrentPage = <T>(recordsToPaginate: T[]): T[] => {
    const startIndex = (currentPage - 1) * perPageCount;
    const endIndex = startIndex + perPageCount;
    return recordsToPaginate.slice(startIndex, endIndex);
  };

  useEffect(() => {
    let filteredRecords = allRecords;

    const [proxyField, proxyText] = searchFilterProxy.split('=');
    if (proxyField && proxyText) {
      filteredRecords = filterRecordsBySearchTextProxy(proxyField, proxyText);
    }

    const itemsForPage = getItemsForCurrentPage(filteredRecords);
    setCurrentPageRecords(itemsForPage);
  }, [ searchFilterProxy, allRecords, currentPage]);

  return {
    setSearchFilterProxy,
    searchFilterProxy,
    setCurrentPageRecords,
    currentPageRecords,
  };
};