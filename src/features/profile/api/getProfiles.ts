
import { useEffect, useMemo } from 'react';
import { useProfilesStore } from '../store';
import { initialProfile } from '../initialProfile';

export async function getProfilesData() {

    const totalCount = initialProfile.length;
    const profiles = initialProfile;
    const newCursor: any = profiles.length - 1;
    return { totalCount, profiles, newCursor };
}

export const useProfiles = (pages: number[]) => {
    const {
        profilesAll,
        profiles,
        totalCount,
        isLoading,
        perPageCount,
        setPerPageCount,
        setLoading,
        setProfilesData,
        resetProfiles,
    } = useProfilesStore();

    useEffect(() => {
        const lastActivePage = pages[pages.length - 1];

        if (!Object.hasOwn(profiles, lastActivePage)) {
            fetchProfiles();
        }

        async function fetchProfiles() {
            try {
                setLoading(true);
                const { profiles, totalCount } = await getProfilesData();
                setProfilesData(
                    {
                        [lastActivePage]: profiles,
                    },
                    totalCount
                );
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    }, [pages]);

    //console.log('profiles', profiles);

    useEffect(() => { }, [perPageCount]);

    // const currentProfiles = useMemo(() => {
    //     return pages.reduce((res: any[], currPage) => {
    //         const currPageProfiles = profiles[currPage] ?? [];
    //         return [...res, ...currPageProfiles];
    //     }, []);
    // }, [pages, profiles]);

    return {
        profiles: profilesAll || initialProfile,
        totalCount,
        isLoading,
        perPageCount,
        setPerPageCount,
        resetProfiles,
    };
};

export const searchByNameProfiles = async (name: string) => {
    const profiles = initialProfile.filter((profile) => profile.title === name);
    return profiles;
};

