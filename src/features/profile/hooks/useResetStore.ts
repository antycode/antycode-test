import { useExtensionsStore } from '@/features/account/components/ExtensionList/store';
import { usePaymentStore } from '@/features/payment/store';
import { useProfilesStore } from '@/features/profile/store';
import { useProxiesStore } from '@/features/proxy/store';
import { useWorkspacesStore } from '@/features/workspace/store';

export const useResetZustandStores = () => {
  const { setResetStoreProfiles } = useProfilesStore();
  const { setResetStoreProxies } = useProxiesStore();
  const { setResetStorePayments } = usePaymentStore();
  const { setResetStoreWorkspace } = useWorkspacesStore();
  const { setResetStoreExtensions } = useExtensionsStore();

  const resetStore = () => {
    setResetStoreProfiles();
    setResetStoreProxies();
    setResetStorePayments();
    setResetStoreWorkspace();
    setResetStoreExtensions();
  };

  return resetStore;
};
