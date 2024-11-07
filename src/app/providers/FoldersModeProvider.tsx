import { useMemo, useState, useLayoutEffect, PropsWithChildren } from 'react';
import { LOCAL_STORAGE_FOLDERS_MODE } from '@/shared/const/localStorage';
import { FoldersModeContext } from '@/shared/context/FoldersModeContext';
import { FoldersMode } from '@/shared/const/context';

const storedFoldersMode = localStorage.getItem(LOCAL_STORAGE_FOLDERS_MODE) as FoldersMode;

export const FoldersModeProvider = (props: PropsWithChildren) => {
    const { children } = props;

    const [foldersMode, setFoldersMode] = useState(storedFoldersMode || FoldersMode.FULL);

    useLayoutEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_FOLDERS_MODE, foldersMode);
    }, [foldersMode]);

    const defaultProps = useMemo(
        () => ({
            foldersMode,
            setFoldersMode,
        }),
        [foldersMode]
    );

    return (
        <FoldersModeContext.Provider value={defaultProps}>
            {children}
        </FoldersModeContext.Provider>
    );
};
