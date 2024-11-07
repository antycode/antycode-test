import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';
import { persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {ProxiesDataReducer} from '@/store/reducers/ProxiesDataReducer';
import {ProxiesForCheckReducer} from '@/store/reducers/ProxiesForCheckReducer';
import {RunBrowsersReducer} from "@/store/reducers/RunBrowsersReducer";
import {AuthReducer} from "@/store/reducers/AuthReducer";
import {PlatformReducer} from "@/store/reducers/PlatformReducer";
import {SidebarReducer} from "@/store/reducers/Sidebar";
import {LoaderReducer} from "@/store/reducers/LoaderReducer";
import {DrawersReducer} from "@/store/reducers/Drawers";

const persistProxiesDataConfig = {
    key: 'proxies',
    storage,
}

const persistAuth = {
    key: 'token',
    storage
}

const persistedProxiesDataReducer = persistReducer(persistProxiesDataConfig, ProxiesDataReducer);
const persistedAuthReducer = persistReducer(persistAuth, AuthReducer);

const rootReducer = combineReducers({
    proxiesDataReducer: persistedProxiesDataReducer,
    proxiesForCheckReducer: ProxiesForCheckReducer,
    runBrowsersReducer: RunBrowsersReducer,
    authReducer: persistedAuthReducer,
    platformReducer: PlatformReducer,
    sidebarReducer: SidebarReducer,
    loaderReducer: LoaderReducer,
    drawersReducer: DrawersReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export const persist = persistStore(store);
export default store;