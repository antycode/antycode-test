import { create } from 'zustand';

interface ExtensionData {
  data_created: string; 
  external_id: string; 
  is_public: boolean;
  logo: string; 
  title: string;
  url: string; 
}

type State = {
  extensions: ExtensionData[];
  firstLoaded: boolean;
};

type Actions = {
  setExtensions: (extensions: ExtensionData[]) => void;
  setFirstLoaded:(firstLoaded: boolean) => void
  setResetStoreExtensions: () => void
};

const initialState: State = {
  extensions: [],
  firstLoaded: false
};

export const useExtensionsStore = create<State & Actions>((set) => ({
  ...initialState,
  setExtensions: (extensions) => set({ extensions }),
  setFirstLoaded: (firstLoaded) => set({ firstLoaded }),
  setResetStoreExtensions: () => set(initialState),
}));