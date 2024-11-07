import { useMemo } from "react";
import { useProfilesStore } from "../store";
import { Profile } from "../types";


export const useProxyParams = (profile: Profile) => {

    const { configData } = useProfilesStore();

    const proxyParams = useMemo(() => {
        if (configData && profile?.profile_proxy_external_id) {
            const argsParams = [];

            const proxiesParams = configData?.proxies?.find((proxy: any) =>
                proxy?.external_id === profile?.profile_proxy_external_id);

            proxiesParams && argsParams.push(`-L=:${proxiesParams?.port}`);

            proxiesParams && argsParams.push(`-F=${proxiesParams?.type}://${proxiesParams?.login}:${proxiesParams?.password}@${proxiesParams?.host}:${proxiesParams?.port}`);

            return argsParams;

        }
        return null;

    }, [configData, profile]);

    return proxyParams;
};
