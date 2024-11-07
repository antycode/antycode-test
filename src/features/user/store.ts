import { create } from 'zustand';
import { User } from './types';
import { excludeObjFields, includeObjFields } from '@/shared/utils';

type State = {
    currentPage: number;
    allUsers: User[];
    allFilteredUsers: User[];
    isLoading: boolean;
    totalCount: number;
    perPageCount: number;
};

type Actions = {
    setLoading: (value: boolean) => void;
    setPerPageCount: (value: number) => void;
    setCurrentPage: (value: number) => void;
    setAllUsersData: (allUsers: User[]) => void;
    setAllFilteredUsers: (allFilteredUsers: User[]) => void;
    resetUsers: (
        params?: { exclude: Array<keyof State> } | { include: Array<keyof State> }
    ) => void;
};

const initialState: State = {
    currentPage: 1,
    allUsers: [],
    allFilteredUsers: [],
    isLoading: false,
    totalCount: 0,
    perPageCount: 30,
};

export const useUsersStore = create<State & Actions>((set) => ({
    ...initialState,
    setPerPageCount: (perPageCount) => set({ perPageCount }),
    setLoading: (isLoading) => set({ isLoading }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setAllUsersData: (allUsers) => set((state) => ({
        allUsers,
        allFilteredUsers: allUsers,
        currentPage: 1,
        totalCount: allUsers.length
    })),
    setAllFilteredUsers: (allFilteredUsers) => set({
        allFilteredUsers,
        currentPage: 1,
        totalCount: allFilteredUsers.length
    }),
    resetUsers: (params) => {
        let newState = initialState;
        if (params && 'exclude' in params) {
            newState = excludeObjFields(initialState, params.exclude);
        } else if (params && 'include' in params) {
            newState = includeObjFields(initialState, params.include);
        }
        set(newState);
    }
}));