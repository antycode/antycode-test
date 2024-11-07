import { useEffect, useState } from 'react';
import { Account } from '../types';
import { searchByName } from '../api/getAccounts';

export const useFilterAccounts = () => {

    const [filterAccounts, setFilterAccounts] = useState<Account[]>([]);
    const [useSearchName, setUseSearchName] = useState<string>('');
    const [useSearchField, setUseSearchField] = useState<string>('');
    const [useSort, setUseSort] = useState<boolean>(false);

    useEffect(() => {
        if (useSearchName && useSearchField) {
            searchByName({ name: useSearchName, field: useSearchField }).then((res: any[]) => {
                setFilterAccounts(res.sort((a, b) => { return b?.created_at.seconds - a?.created_at.seconds }));
            }).catch((err) => {
                console.log(err);
            });
            setUseSearchField('');
        } else if (!useSearchName) {
            setFilterAccounts([]);
        }
    }, [useSearchName, useSearchField]);

    return {
        setUseSearchName, setUseSearchField, setUseSort, filterAccounts, useSort,
        setFilterAccounts
    };
};