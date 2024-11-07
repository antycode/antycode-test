import {useEffect, useState} from 'react';
import {useProxiesStore} from "@/features/proxy/store";

type SortOrderListType = 'asc' | 'desc'

export const useFilterNotice = <T>({allRecords, currentPage, perPageCount}: {
    allRecords: T[],
    currentPage: number,
    perPageCount: number
}) => {
    const {allProxies} = useProxiesStore();

    const [filteredRecords, setFilteredRecords] = useState<T[]>(allRecords);
    const [currentPageRecords, setCurrentPageRecords] = useState<T[]>(allRecords);
    const [useSort, setUseSort] = useState<boolean>(false);
    const [useSort2, setUseSort2] = useState<boolean>(false);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [sortFilter, setSortFilter] = useState<string>('=asc');
    const [searchFilterProxy, setSearchFilterProxy] = useState<string>('');
    const [loadMoreProfiles, setLoadMoreProfiles] = useState<boolean>(false);

    const filterRecordsBySearchText = (searchField: string, searchText: string) => {
        return allRecords.filter((item) => {
            const fieldValue = item[searchField as keyof T] as string;
            return fieldValue.toLowerCase().includes(searchText);
        });
    };

    const filterRecordsBySearchTextProxy = (searchField: string, searchText: string) => {
        return allRecords.filter((item: any) => {
            const proxyExternalId = item.profile_proxy_external_id;
            const proxy = allProxies.find((proxy: any) => proxy.external_id === proxyExternalId);
            if (proxy) {
                for (const key in proxy) {
                    if (proxy.hasOwnProperty(key)) {
                        if (proxy.title) {
                            if (proxy.title.toLowerCase().includes(searchText)) {
                                return true;
                            }
                        }
                        const fieldValue = `${proxy.host}:${proxy.port}`;
                        if (fieldValue.toLowerCase().includes(searchText)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        });
    };

    const getItemsForCurrentPage = <T>(recordsToPaginate: T[]): T[] => {
        const startIndex = (currentPage - 1) * perPageCount;
        const endIndex = startIndex + perPageCount;
        return recordsToPaginate.slice(startIndex, endIndex);
    };

    const sortRecords = (sortField: string, sortOrder: SortOrderListType) => {
        const sortedRecords = filteredRecords.sort((a, b) => {
            const aValue = a[sortField as keyof T];
            const bValue = b[sortField as keyof T];
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sortOrder === 'desc' ? -comparison : comparison;
        });
        return [...sortedRecords]
    };
    useEffect(() => {
        const [sortField, sortOrder] = sortFilter.split('=')
        if (sortField) {
            const sortedRecords = sortRecords(sortField, sortOrder as SortOrderListType);
            const itemsForPage = getItemsForCurrentPage(sortedRecords);
            setCurrentPageRecords(itemsForPage);
        }
    }, [sortFilter, allRecords]);

    useEffect(() => {
        const itemsForPage = getItemsForCurrentPage(filteredRecords);
        setCurrentPageRecords(itemsForPage);
    }, [currentPage, perPageCount]);

    useEffect(() => {
        setFilteredRecords(allRecords)
        const itemsForPage = getItemsForCurrentPage(allRecords);
        setCurrentPageRecords(itemsForPage);
    }, [allRecords]);

    useEffect(() => {
        const [searchField, searchText] = searchFilter.split('=');
        if (searchField) {
            if (searchText) {
                const allFilteredRecords = filterRecordsBySearchText(searchField, searchText);
                setFilteredRecords(allFilteredRecords);
                setCurrentPageRecords(allFilteredRecords);
            } else {
                setFilteredRecords(allRecords)
                const itemsForPage = getItemsForCurrentPage(allRecords);
                setCurrentPageRecords(itemsForPage);
            }
        }
    }, [searchFilter, allRecords]);

    useEffect(() => {
        const [searchField, searchText] = searchFilterProxy.split('=')
        if (searchField) {
            if (searchText) {
                const allFilteredRecords = filterRecordsBySearchTextProxy(searchField, searchText);
                setFilteredRecords(allFilteredRecords);
                setCurrentPageRecords(allFilteredRecords);
            } else {
                setFilteredRecords(allRecords);
                const itemsForPage = getItemsForCurrentPage(allRecords);
                setCurrentPageRecords(itemsForPage);
            }
        }
    }, [searchFilterProxy, allRecords]);

    return {
        setUseSort, filteredRecords, useSort, setSortFilter, setSearchFilterProxy, searchFilterProxy,
        setFilteredRecords, searchFilter, setSearchFilter, setCurrentPageRecords, currentPageRecords,
        loadMoreProfiles, setLoadMoreProfiles, useSort2, setUseSort2
    };
};