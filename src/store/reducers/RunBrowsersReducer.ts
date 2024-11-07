import {Reducer} from "redux";

interface RunBrowsersState {
    runBrowsers: { [key: string]: boolean },
    runBrowsersLoader: { [key: string]: boolean },
    pidProcess: any[]
}

type RunBrowsersAction = {
    type: any;
    payload: any;
};

const runBrowsersState = {
    runBrowsers: {},
    runBrowsersLoader: {},
    pidProcess: []
};

const SET_RUN_BROWSERS = 'SET_RUN_BROWSERS';
const SET_RUN_BROWSERS_LOADER = 'SET_RUN_BROWSERS_LOADER';
const SET_PID_PROCESS = 'SET_PID_PROCESS';

export const RunBrowsersReducer: Reducer<RunBrowsersState, RunBrowsersAction> = (state = runBrowsersState, action) => {
    switch (action.type) {
        case SET_RUN_BROWSERS:
            return {...state, runBrowsers: {...action.payload}}
        case SET_RUN_BROWSERS_LOADER:
            return {...state, runBrowsersLoader: {...action.payload}}
        case SET_PID_PROCESS:
            return {...state, pidProcess: [...action.payload]}
        default:
            return state;
    }
};

export const setRunBrowsers = (payload: { [key: string]: boolean }) => ({type: SET_RUN_BROWSERS, payload});
export const setRunBrowsersLoader = (payload: { [key: string]: boolean }) => ({type: SET_RUN_BROWSERS_LOADER, payload});
export const setPidProcess = (payload: any[]) => ({type: SET_PID_PROCESS, payload});