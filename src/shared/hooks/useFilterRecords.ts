import {useEffect, useState} from 'react';

type SortOrderListType = 'asc' | 'desc'
export const useFilterRecords = <T>({allRecords, currentPage, perPageCount}: {
    allRecords: any[],
    currentPage: number,
    perPageCount: number
}) => {
    const [currentPageRecords, setCurrentPageRecords] = useState<any[]>(allRecords);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [sortFilter, setSortFilter] = useState<string>('=asc');
    const [filteredRecords, setFilteredRecords] = useState<T[]>(allRecords);
    const [loadMoreProfiles, setLoadMoreProfiles] = useState<boolean>(false);

    const filterRecordsBySearchText = (searchField: string, searchText: string) => {
        return allRecords.filter((item) => {
            let fieldValue: string;
            if (searchField === 'title') {
                if (item.title) {
                    fieldValue = item.title;
                } else {
                    fieldValue = `${item.host}:${item.port}`;
                }
            } else {
                fieldValue = item[searchField as keyof T] as string;
            }
            return fieldValue.toLowerCase().includes(searchText)
        });
    };

    const getItemsForCurrentPage = <T>(recordsToPaginate: any[]): any[] => {
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
        const [searchField, searchText] = searchFilter.split('=')
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

    return {
        setSearchFilter, searchFilter, setSortFilter, sortFilter, currentPageRecords,
        setCurrentPageRecords, filteredRecords, setFilteredRecords,
        loadMoreProfiles, setLoadMoreProfiles
    };
};
