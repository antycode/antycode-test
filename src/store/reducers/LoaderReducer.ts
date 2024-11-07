import {Reducer} from "redux";

interface LoaderType {
    loaderIsActive: boolean
}

type LoaderAction = {
    type: any;
    payload: any;
};

const loaderState = {
    loaderIsActive: true
};

const SET_LOADER_IS_ACTIVE = 'SET_LOADER_IS_ACTIVE';

export const LoaderReducer: Reducer<LoaderType, LoaderAction> = (state = loaderState, action) => {
    switch (action.type) {
        case SET_LOADER_IS_ACTIVE:
            return {...state, loaderIsActive: action.payload}
        default: return state;
    }
};

export const setLoaderIsActive = (payload: boolean) => ({type: SET_LOADER_IS_ACTIVE, payload});