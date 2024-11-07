import { create } from 'zustand';

type PaymentParams = {

};

type State = {
  transactions: any[];
  isLoading: boolean;
  tariffs: any[];
  pageCount: number,
  operation: boolean | null;
  filteredTransactions: any[];
  visibleTransactions: any[];
  currentPage: number;
  activeCryptopayPopup: boolean;
  timePassed: boolean;
  paymentSuccess: boolean | null;
  perPageCount: number;
  totalPages: number;
};

type Actions = {
  setTransactions: (value: any[]) => void;
  setIsLoading: (value: boolean) => void;
  setTariffs: (value: any[]) => void;
  setPageCount: (value: number) => void;
  setOperation: (value: boolean | null) => void;
  setFilteredTransactions: (value: any[]) => void;
  setVisibleTransactions: (value: any[]) => void;
  setCurrentPage: (value: any) => void;
  setActiveCryptopayPopup: (value: boolean) => void;
  setTimePassed: (value: boolean) => void;
  setPaymentSuccess: (value: boolean | null) => void;
  setPerPageCount:(value: number) =>  void;
  setTotalPages:(value: number) =>  void;
  setResetStorePayments: () => void;
};

const initialState: State = {
  transactions: [],
  isLoading: false,
  tariffs: [],
  pageCount: 30,
  operation: null,
  filteredTransactions: [],
  visibleTransactions: [],
  currentPage: 1,
  activeCryptopayPopup: false,
  timePassed: false,
  paymentSuccess: null,
  perPageCount: 30,
  totalPages: 1,
};

export const usePaymentStore = create<State & Actions>((set) => ({
  ...initialState,
  setTransactions: (transactions) => set({ transactions }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setTariffs: (tariffs) => set({ tariffs }),
  setPageCount: (pageCount) => set({ pageCount }),
  setOperation: (operation) => set({ operation }),
  setFilteredTransactions: (filteredTransactions) => set({ filteredTransactions }),
  setVisibleTransactions: (visibleTransactions) => set({ visibleTransactions }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setActiveCryptopayPopup: (activeCryptopayPopup) => set({ activeCryptopayPopup }),
  setTimePassed: (timePassed) => set({ timePassed }),
  setPaymentSuccess: (paymentSuccess) => set({ paymentSuccess }),
  setPerPageCount: (perPageCount) => set({ perPageCount}),
  setTotalPages: (totalPages) => set({ totalPages }),
  setResetStorePayments: () => (initialState)
}));