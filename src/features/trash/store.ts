import { create } from 'zustand';
import { Profile } from './types';
import { excludeObjFields, includeObjFields } from '@/shared/utils';

type ProfilesParams = {
  external_id: string;
  chromiumParams: string[];
  proxyParams: string[] | null;
};

type State = {
  profiles: {
    [key: number]: (Profile)[];
  };
  profilesAll: (Profile)[];
  filteredProfilesAll: (Profile)[];
  selectedTags: string[];
  selectedStatuses: any[];
  isLoading: boolean;
  totalCount: number;
  totalPages: number;
  perPageCount: number;
  configData: any;
  profilesParams: any;
  currentPage: number;
  timers: Record<string, { time: number, isActive: boolean }>;
  loaderProfilesPage: boolean;
  folders: any[],
  selectedFolder: string,
  shouldFilterProfiles: boolean
};

type Actions = {
  setLoading: (value: boolean) => void;
  setPerPageCount: (value: number) => void;
  setProfilesConfigData: (value: any[]) => void;
  setProfilesAllData: (profilesAll: State['profilesAll']) => void;
  setFilteredProfilesAll: (filteredProfilesAll: State['filteredProfilesAll']) => void;
  setSelectedTags: (value: string[]) => void;
  setSelectedStatuses: (value: any) => void;
  setProfilesData: (
      profiles: State['profiles'],
      totalCount: number
  ) => void;
  setProfilesParams: (params: any) => void;
  resetProfiles: (
      params?: { exclude: Array<keyof State> } | { include: Array<keyof State> }
  ) => void;
  setCurrentPage: (value: number) => void;
  setTimer: (id: string, time: number, isActive: boolean) => void;
  setLoaderProfilesPage: (value: boolean) => void;
  setFolders: (value: any[]) => void;
  setSelectedFolder: (value: string) => void;
  setShouldFilterProfiles: (value: boolean) => void;
  setTotalPages: (value: number) => void
};

const initialState: State = {
  profiles: [],
  profilesAll: [],
  filteredProfilesAll: [],
  selectedTags: [],
  selectedStatuses: [],
  isLoading: false,
  totalCount: 1,
  totalPages: 1,
  perPageCount: 50,
  configData: {},
  profilesParams: [],
  currentPage: 1,
  timers: {},
  loaderProfilesPage: false,
  folders: [],
  selectedFolder: 'all',
  shouldFilterProfiles: false
};

export const useProfilesTrashStore = create<State & Actions>((set) => ({
  ...initialState,
  setPerPageCount: (perPageCount) => set({ perPageCount }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setLoading: (isLoading) => set({ isLoading }),
  setProfilesConfigData: (configData) => set({ configData }),
  setProfilesAllData: (profilesAll) => set({ profilesAll }),
  setFilteredProfilesAll: (filteredProfilesAll) => set({ filteredProfilesAll }),
  setSelectedTags: (selectedTags) => set({ selectedTags }),
  setSelectedStatuses: (selectedStatuses) => set({ selectedStatuses }),
  setProfilesData: (profilesByPage) => {
    set((state) => ({
      profiles: { ...state.profiles, ...profilesByPage },
    }));
  },
  setProfilesParams: (allProfilesParams: ProfilesParams[]) => {
    set((state) => ({
      profilesParams: [...allProfilesParams],
    }));
  },
  resetProfiles: (params) => {
    let newState = initialState;
    if (params && 'exclude' in params) {
      newState = excludeObjFields(initialState, params.exclude);
    } else if (params && 'include' in params) {
      newState = includeObjFields(initialState, params.include);
    }
    set(newState);
  },
  setTimer: (id, time, isActive) => {
    set((state) => ({
      timers: {
        ...state.timers,
        [id]: { time, isActive },
      },
    }));
  },
  setLoaderProfilesPage: (loaderProfilesPage) => set({ loaderProfilesPage }),
  setFolders: (folders) => set({ folders }),
  setSelectedFolder: (selectedFolder) => set({ selectedFolder }),
  setShouldFilterProfiles: (shouldFilterProfiles) => set({ shouldFilterProfiles }),
  setTotalPages: (totalPages) => set({ totalPages }),
}));