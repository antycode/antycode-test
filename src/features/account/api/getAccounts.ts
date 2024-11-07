import {
  query,
  orderBy,
  getDocs,
  collection,
  CollectionReference,
  DocumentSnapshot,
  limit,
  startAfter,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QueryStartAtConstraint,
  QueryEndAtConstraint,
  getCountFromServer,
  startAt,
  endAt
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { Account } from '../types';
import { useEffect, useMemo, useState } from 'react';
import { useAccountsStore } from '../store';

export async function getAccountsData(
  perPageCount: number,
  cursor: null | DocumentSnapshot
) {
  const constraints: (
    | QueryOrderByConstraint
    | QueryLimitConstraint
    | QueryStartAtConstraint
  )[] = [orderBy('created_at', 'desc'), limit(perPageCount)];

  // If cursor is not undefined (e.g. not initial query) we pass it as a constraint
  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  const collectionRef = collection(db, 'accounts') as CollectionReference<Account>;
  const q = query(collectionRef, ...constraints);

  const countSnapshot = await getCountFromServer(collectionRef);
  const accountsSnapshot = await getDocs(q);

  const totalCount = countSnapshot.data().count;
  const accounts = accountsSnapshot.docs.map((doc) => doc.data());
  const newCursor = accountsSnapshot.docs[accountsSnapshot.docs.length - 1];

  return { totalCount, accounts, newCursor };
}

export const useAccounts = (pages: number[]) => {
  const {
    accounts,
    cursor,
    totalCount,
    isLoading,
    perPageCount,
    setPerPageCount,
    setLoading,
    setAccountsData,
    resetAccounts,
  } = useAccountsStore();

  useEffect(() => {
    const lastActivePage = pages[pages.length - 1];

    if (!Object.hasOwn(accounts, lastActivePage)) {
      //console.log('~~~ request');
      fetchAccounts();
    }

    async function fetchAccounts() {
      try {
        setLoading(true);
        const { accounts, newCursor, totalCount } = await getAccountsData(
          perPageCount,
          cursor
        );

        setAccountsData(
          {
            [lastActivePage]: accounts,
          },
          newCursor,
          totalCount
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  }, [pages]);

  //console.log('accounts', accounts);

  useEffect(() => { }, [perPageCount]);

  const currentAccounts = useMemo(() => {
    return pages.reduce((res: any[], currPage) => {
      const currPageAccounts = accounts[currPage] ?? [];
      return [...res, ...currPageAccounts];
    }, []);
  }, [pages, accounts]);

  return {
    accounts: currentAccounts,
    cursor,
    totalCount,
    isLoading,
    setLoading,
    perPageCount,
    setPerPageCount,
    resetAccounts,
  };
};

export const searchByName = async ({ name, field }: { name: string, field: string }) => {
  const namesConstraints: (
    | QueryOrderByConstraint
    | QueryEndAtConstraint
    | QueryStartAtConstraint
  )[] = [orderBy(field), startAt(name.toLowerCase()), endAt(name.toLowerCase() + '\uf8ff')];
  const namesQ = query(collection(db, "accounts"), ...namesConstraints);
  const namesSnapshot = await getDocs(namesQ);
  return namesSnapshot.docs.map((doc) => doc.data());
};