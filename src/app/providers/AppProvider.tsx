import React from 'react';
import {ThemeProvider} from './ThemeProvider';
import {SidebarModeProvider} from './SidebarModeProvider';
import {Provider} from "react-redux";
import store, {persist} from "@/store";
import {PersistGate} from "redux-persist/integration/react";
import {FoldersModeProvider} from "@/app/providers/FoldersModeProvider";

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider = ({children}: AppProviderProps) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persist}>
                <SidebarModeProvider>
                    <FoldersModeProvider>
                        <ThemeProvider>
                            {children}
                        </ThemeProvider>
                    </FoldersModeProvider>
                </SidebarModeProvider>
            </PersistGate>
        </Provider>
    );
};
