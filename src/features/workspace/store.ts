import { create } from 'zustand';
import { Team } from './types';
import { excludeObjFields, includeObjFields } from '@/shared/utils';
import { boolean } from 'zod';
import { User } from '@/features/user/types';
import userAgents from '@/user-agents';

type State = {
  teamId: string;
  myTeams: Team[];
  selectedTeam: Team | null;
  customerData: any;
  teamCustomers: any[];
  currentPageTeam: number;
  currentPageNotice: number;
  allFilteredCustomers: any[];
  isLoading: boolean;
  totalCount: number;
  perPageCountTeam: number;
  perPageCountNotice: number;
  verticals: any[];
  positions: any[];
  notifications: any[];
  filteredNotice: any[];
  visibleNotice: any[];
  totalPagesCount: number;
  userAgent: string;
};

type Actions = {
  setTeamId: (value: string) => void;
  setMyTeams: (myTeams: State['myTeams']) => void;
  resetMyTeams: (
    params?: { exclude: Array<keyof State> } | { include: Array<keyof State> },
  ) => void;
  setSelectedTeam: (value: Team) => void;
  setCustomerData: (value: any[]) => void;
  setTeamCustomers: (value: any[]) => void;
  setLoading: (value: boolean) => void;
  setPerPageCountTeam: (value: number) => void;
  setPerPageCountNotice: (value: number) => void;
  setCurrentPageTeam: (value: number) => void;
  setCurrentPageNotice: (value: number) => void;
  setAllFilteredCustomers: (allFilteredUsers: User[]) => void;
  resetUsers: (params?: { exclude: Array<keyof State> } | { include: Array<keyof State> }) => void;
  setVerticals: (value: any[]) => void;
  setPositions: (value: any[]) => void;
  setNotifications: (value: any[]) => void;
  setFilteredNotice: (value: any[]) => void;
  setVisibleNotice: (value: any[]) => void;
  setTotalPagesCount: (value: number) => void;
  setResetStoreWorkspace: () => void;
  setUserAgent: (value: string) => void;
};

const initialState: State = {
  teamId: '',
  myTeams: [],
  selectedTeam: null,
  customerData: {},
  teamCustomers: [],
  currentPageTeam: 1,
  currentPageNotice: 1,
  allFilteredCustomers: [],
  isLoading: false,
  totalCount: 0,
  perPageCountTeam: 2,
  perPageCountNotice: 50,
  verticals: [],
  positions: [],
  notifications: [],
  filteredNotice: [],
  visibleNotice: [],
  totalPagesCount: 0,
  userAgent: '',
};

export const useWorkspacesStore = create<State & Actions>((set) => ({
  ...initialState,
  setTeamId: (teamId) => set({ teamId }),
  setMyTeams: (myTeams) => {
    set((state) => ({
      myTeams,
    }));
  },
  resetMyTeams: (params) => {
    let newState = initialState;

    if (params && 'exclude' in params) {
      newState = excludeObjFields(initialState, params.exclude);
    } else if (params && 'include' in params) {
      newState = includeObjFields(initialState, params.include);
    }

    set(newState);
  },
  setSelectedTeam: (selectedTeam) => set({ selectedTeam }),
  setCustomerData: (customerData) => set({ customerData }),
  setPerPageCountTeam: (perPageCountTeam) => set({ perPageCountTeam }),
  setPerPageCountNotice: (perPageCountNotice) => set({ perPageCountNotice }),
  setLoading: (isLoading) => set({ isLoading }),
  setCurrentPageTeam: (currentPageTeam) => set({ currentPageTeam }),
  setCurrentPageNotice: (currentPageNotice) => set({ currentPageNotice }),
  setTeamCustomers: (teamCustomers) =>
    set((state) => ({
      teamCustomers,
      allFilteredUsers: teamCustomers,
      currentPageTeam: 1,
      totalCount: teamCustomers.length,
    })),
  setAllFilteredCustomers: (allFilteredCustomers) =>
    set({
      allFilteredCustomers,
      currentPageTeam: 1,
      totalCount: allFilteredCustomers.length,
    }),
  resetUsers: (params) => {
    let newState = initialState;
    if (params && 'exclude' in params) {
      newState = excludeObjFields(initialState, params.exclude);
    } else if (params && 'include' in params) {
      newState = includeObjFields(initialState, params.include);
    }
    set(newState);
  },
  setVerticals: (verticals) => set({ verticals }),
  setPositions: (positions) => set({ positions }),
  setNotifications: (notifications) => set({ notifications }),
  setFilteredNotice: (filteredNotice) => set({ filteredNotice }),
  setVisibleNotice: (visibleNotice) => set({ visibleNotice }),
  setTotalPagesCount: (totalPagesCount) => set({ totalPagesCount }),
  setUserAgent: (userAgent) => set({ userAgent }),
  setResetStoreWorkspace: () => initialState,
}));
