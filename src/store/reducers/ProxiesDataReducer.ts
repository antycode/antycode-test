import {Reducer} from "redux";

interface ProxiesStateType {
    proxies: any[],
    proxiesSingle: any[],
}

type ProxiesAction = {
    type: any;
    payload: any;
};

const proxiesState = {
    proxies: [],
    proxiesSingle: []
};

const SET_PROXIES_DATA = 'SET_PROXIES_DATA';
const SET_PROXIES_SINGLE_DATA = 'SET_PROXY_SINGLE_DATA';

export const ProxiesDataReducer: Reducer<ProxiesStateType, ProxiesAction> = (state = proxiesState, action) => {
    switch (action.type) {
        case SET_PROXIES_DATA:
            return {...state, proxies: [...action.payload]}
        case SET_PROXIES_SINGLE_DATA:
            return {...state, proxiesSingle: [...action.payload]}
        default: return state;
    }
};

export const setProxiesData = (payload: any[]) => ({type: SET_PROXIES_DATA, payload});
export const setProxiesSingleData = (payload: any[]) => ({type: SET_PROXIES_SINGLE_DATA, payload});