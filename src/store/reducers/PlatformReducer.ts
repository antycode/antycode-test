import {Reducer} from "redux";

interface PlatformState {
    platform: any,
}

type PlatformAction = {
    type: any;
    payload: any;
};

const platformState = {
    platform: '',
};

const SET_PLATFORM = 'SET_PLATFORM';

export const PlatformReducer: Reducer<PlatformState, PlatformAction> = (state = platformState, action) => {
    switch (action.type) {
        case SET_PLATFORM:
            return {...state, platform: action.payload}
        default:
            return state;
    }
};

export const setPlatform = (payload: any) => ({type: SET_PLATFORM, payload});
