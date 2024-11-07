import {Reducer} from "redux";

interface ProxiesForCheckStateType {
    proxiesForCheck: any[],
    accumulatedProxiesForCheckSingle: any[],
    accumulatedProxiesForCheck: any[],
    proxySingleForCheck: any[],
    proxiesChangeIpResult: any[]
}

type ProxiesForCheckAction = {
    type: any;
    payload: any;
};

const proxiesForCheckState = {
    proxiesForCheck: [],
    accumulatedProxiesForCheckSingle: [],
    accumulatedProxiesForCheck: [],
    proxySingleForCheck: [],
    proxiesChangeIpResult: []
};

const SET_PROXIES_FOR_CHECK = 'SET_PROXIES_FOR_CHECK';
const SET_ACCUMULATED_PROXIES_FOR_CHECK_SINGLE = 'SET_ACCUMULATED_PROXIES_FOR_CHECK_SINGLE';
const SET_ACCUMULATED_PROXIES_FOR_CHECK = 'SET_ACCUMULATED_PROXIES_FOR_CHECK';
const SET_PROXY_SINGLE_FOR_CHECK = 'SET_PROXY_SINGLE_FOR_CHECK';
const SET_PROXIES_CHANGE_IP_RESULT = 'SET_PROXIES_CHANGE_IP_RESULT';

export const ProxiesForCheckReducer: Reducer<ProxiesForCheckStateType, ProxiesForCheckAction> = (state = proxiesForCheckState, action) => {
    switch (action.type) {
        case SET_PROXIES_FOR_CHECK:
            return {...state, proxiesForCheck: [...action.payload]}
        case SET_ACCUMULATED_PROXIES_FOR_CHECK_SINGLE:
            return {...state, accumulatedProxiesForCheckSingle: [...action.payload]}
        case SET_ACCUMULATED_PROXIES_FOR_CHECK:
            return {...state, accumulatedProxiesForCheck: [...action.payload]}
        case SET_PROXY_SINGLE_FOR_CHECK:
            return {...state, proxySingleForCheck: [...action.payload]}
        case SET_PROXIES_CHANGE_IP_RESULT:
            return {...state, proxiesChangeIpResult: [...action.payload]}
        default: return state;
    }
};

export const setProxiesForCheck = (payload: any[]) => ({type: SET_PROXIES_FOR_CHECK, payload});
export const setAccumulatedProxiesForCheckSingle = (payload: any[]) => ({type: SET_ACCUMULATED_PROXIES_FOR_CHECK_SINGLE, payload});
export const setAccumulatedProxiesForCheck = (payload: any[]) => ({type: SET_ACCUMULATED_PROXIES_FOR_CHECK, payload});
export const setProxySingleForCheck = (payload: any[]) => ({type: SET_PROXY_SINGLE_FOR_CHECK, payload});
export const setProxiesChangeIpResult = (payload: any[]) => ({type: SET_PROXIES_CHANGE_IP_RESULT, payload});