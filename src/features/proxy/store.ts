import { create } from 'zustand';
import { Proxy } from './types';
import { excludeObjFields, includeObjFields } from '@/shared/utils';
import { boolean } from 'zod';

type State = {
  currentPage: number;
  allProxies: Proxy[];
  allFilteredProxies: Proxy[];
  isLoading: boolean;
  totalCount: number;
  perPageCount: number;
  isSortStatus: boolean | null;
  totalPagesCount: number;
};

type Actions = {
  setLoading: (value: boolean) => void;
  setCurrentPage: (value: number) => void;
  setAllProxiesData: (allProxies: State['allProxies']) => void;
  setAllFilteredProxies: (allFilteredProxies: State['allFilteredProxies']) => void;
  setIsSortStatus: (value: boolean | null) => void;
  setTotalPagesCount: (value: number) => void;
  setPerPageCount: (value: number) => void;
  resetProxies: (
    params?: { exclude: Array<keyof State> } | { include: Array<keyof State> },
  ) => void;
  setResetStoreProxies: () => void;
};

const initialState: State = {
  currentPage: 1,
  allProxies: [],
  allFilteredProxies: [],
  isLoading: false,
  totalCount: 0,
  perPageCount: 50,
  isSortStatus: null,
  totalPagesCount: 0,
};

export const useProxiesStore = create<State & Actions>((set) => ({
  ...initialState,
  setLoading: (isLoading) => set({ isLoading }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setAllProxiesData: (allProxies) => {
    set((state) => ({
      allProxies,
      allFilteredProxies: allProxies,
      totalCount: allProxies.length,
    }));
  },
  setAllFilteredProxies: (allFilteredProxies) => {
    set((state) => ({
      allFilteredProxies,
      totalCount: allFilteredProxies.length,
    }));
  },
  setIsSortStatus: (isSortStatus) => set({ isSortStatus }),
  resetProxies: (params) => {
    let newState = initialState;

    if (params && 'exclude' in params) {
      newState = excludeObjFields(initialState, params.exclude);
    } else if (params && 'include' in params) {
      newState = includeObjFields(initialState, params.include);
    }

    set(newState);
  },
  setTotalPagesCount: (totalPagesCount) => set({ totalPagesCount }),
  setPerPageCount: (perPageCount) => set({ perPageCount }),
  setResetStoreProxies: () => set(initialState)
}));
