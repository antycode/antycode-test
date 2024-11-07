import { create } from 'zustand';
import { Account, InProgressAccount } from './types';
import { DocumentSnapshot } from 'firebase/firestore';
import { excludeObjFields, includeObjFields } from '@/shared/utils';

type State = {
  accounts: {
    [key: number]: (Account | InProgressAccount)[];
  };
  isLoading: boolean;
  cursor: null | DocumentSnapshot<Account>; // last page cursor
  totalCount: number;
  perPageCount: number;
};

type Actions = {
  setLoading: (value: boolean) => void;
  setPerPageCount: (value: number) => void;
  setAccountsData: (
    accounts: State['accounts'],
    cursor: State['cursor'],
    totalCount: number
  ) => void;
  resetAccounts: (
    params?: { exclude: Array<keyof State> } | { include: Array<keyof State> }
  ) => void;
};

const initialState: State = {
  accounts: [],
  isLoading: false,
  cursor: null,
  totalCount: 0,
  perPageCount: 30,
};

export const useAccountsStore = create<State & Actions>((set) => ({
  ...initialState,
  setPerPageCount: (perPageCount) => set({ perPageCount }),
  setLoading: (isLoading) => set({ isLoading }),
  setAccountsData: (accountsByPage, cursor, totalCount) => {
    set((state) => ({
      accounts: { ...state.accounts, ...accountsByPage },
      cursor,
      totalCount,
    }));
  },
  resetAccounts: (params) => {
    let newState = initialState;

    if (params && 'exclude' in params) {
      newState = excludeObjFields(initialState, params.exclude);
    } else if (params && 'include' in params) {
      newState = includeObjFields(initialState, params.include);
    }

    set(newState);
  },
}));
