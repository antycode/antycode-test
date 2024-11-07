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
    [key: number]: Profile[];
  };
  profilesAll: Profile[];
  selectedTags: string[];
  selectedTagsProfile: string[];
  profileTags: string[];
  selectedStatuses: any[];
  isLoading: boolean;
  perPageCount: number;
  configData: any;
  profilesParams: any;
  currentPage: number;
  timers: Record<string, { time: number; isActive: boolean }>;
  loaderProfilesPage: boolean;
  folders: any[];
  selectedFolder: string;
  shouldFilterProfiles: boolean;
  totalPages: number;
  totalCount: number;
  dateFilter: string;
  isOpenChangeTags: boolean;
  isOpenChangeProxyPopup: boolean;
  proxyHost: string;
  isOpenDeleteProfilesPopup: boolean;
  isOpenImportCookies: boolean;
  isOpenSendUserPopup: boolean;
  isOpenTransferFolderPopup: boolean;
  isOpenRemoveFolder: boolean;
  profileToEdit: any;
};

type Actions = {
  setLoading: (value: boolean) => void;
  setPerPageCount: (value: number) => void;
  setProfilesConfigData: (value: any[]) => void;
  setProfilesAllData: (profilesAll: State['profilesAll']) => void;
  setSelectedTags: (value: string[]) => void;
  setSelectedStatuses: (value: any) => void;
  setProfilesData: (profiles: State['profiles'], totalCount: number) => void;
  setProfilesParams: (params: any) => void;
  resetProfiles: (
    params?: { exclude: Array<keyof State> } | { include: Array<keyof State> },
  ) => void;
  setCurrentPage: (value: number) => void;
  setTimer: (id: string, time: number, isActive: boolean) => void;
  setLoaderProfilesPage: (value: boolean) => void;
  setFolders: (value: any[]) => void;
  setSelectedFolder: (value: string) => void;
  setShouldFilterProfiles: (value: boolean) => void;
  setTotalPages: (value: number) => void;
  setDateFilter: (value: string) => void;
  setIsOpenChangeTags: (value: boolean) => void;
  setProfileTags: (value: string[]) => void;
  setSelectedTagsProfile: (value: string[]) => void;
  setIsOpenChangeProxyPopup: (value: boolean) => void;
  setIsOpenDeleteProfilesPopup: (value: boolean) => void;
  setIsOpenImportCookies: (value: boolean) => void;
  setIsOpenSendUserPopup: (value: boolean) => void;
  setIsOpenTransferFolderPopup: (value: boolean) => void;
  setIsOpenRemoveFolder: (value: boolean) => void;
  setProxyHost: (value: string) => void;
  setProfileToEdit: (value: any) => void;
  setResetStoreProfiles: () => void;
};

const initialState: State = {
  profiles: [],
  profilesAll: [],
  selectedTags: [],
  selectedStatuses: [],
  isLoading: false,
  totalPages: 1,
  perPageCount: 50,
  configData: {},
  profilesParams: [],
  currentPage: 1,
  timers: {},
  loaderProfilesPage: false,
  folders: [],
  selectedFolder: 'all',
  shouldFilterProfiles: false,
  totalCount: 50,
  dateFilter: 'DESC',
  isOpenChangeTags: false,
  profileTags: [],
  selectedTagsProfile: [],
  isOpenChangeProxyPopup: false,
  proxyHost: '',
  isOpenDeleteProfilesPopup: false,
  isOpenImportCookies: false,
  isOpenSendUserPopup: false,
  isOpenTransferFolderPopup: false,
  isOpenRemoveFolder: false,
  profileToEdit: undefined,
};

export const useProfilesStore = create<State & Actions>((set) => ({
  ...initialState,
  setPerPageCount: (perPageCount) => set({ perPageCount }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setLoading: (isLoading) => set({ isLoading }),
  setProfilesConfigData: (configData) => set({ configData }),
  setProfilesAllData: (profilesAll) => set({ profilesAll }),
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
  setDateFilter: (dateFilter) => set({ dateFilter }),
  setIsOpenChangeTags: (isOpenChangeTags) => set({ isOpenChangeTags }),
  setProfileTags: (profileTags) => set({ profileTags }),
  setSelectedTagsProfile: (selectedTagsProfile) => set({ selectedTagsProfile }),
  setIsOpenChangeProxyPopup: (isOpenChangeProxyPopup) => set({ isOpenChangeProxyPopup }),
  setProxyHost: (proxyHost) => set({ proxyHost }),
  setIsOpenDeleteProfilesPopup: (isOpenDeleteProfilesPopup) => set({ isOpenDeleteProfilesPopup }),
  setProfileToEdit: (profileToEdit) => set({ profileToEdit }),
  setIsOpenImportCookies: (isOpenImportCookies) => set({ isOpenImportCookies }),
  setIsOpenSendUserPopup: (isOpenSendUserPopup) => set({ isOpenSendUserPopup }),
  setIsOpenRemoveFolder:(isOpenRemoveFolder) => set({ isOpenRemoveFolder }),
  setIsOpenTransferFolderPopup: (isOpenTransferFolderPopup) => set({isOpenTransferFolderPopup}),
  setResetStoreProfiles: () => set(initialState),
}));
