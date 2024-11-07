import {Reducer} from "redux";

interface DrawersType {
    isProfileCreationDrawer: boolean,
    isEditProfileDrawer: boolean
}

type DrawersAction = {
    type: any;
    payload: any;
};

const drawersState = {
    isProfileCreationDrawer: false,
    isEditProfileDrawer: false
};

const SET_IS_PROFILE_CREATION_DRAWER = 'SET_IS_PROFILE_CREATION_DRAWER';
const SET_IS_EDIT_PROFILE_DRAWER = 'SET_IS_EDIT_PROFILE_DRAWER';

export const DrawersReducer: Reducer<DrawersType, DrawersAction> = (state = drawersState, action) => {
    switch (action.type) {
        case SET_IS_PROFILE_CREATION_DRAWER:
            return {...state, isProfileCreationDrawer: action.payload}
        case SET_IS_EDIT_PROFILE_DRAWER:
            return {...state, isEditProfileDrawer: action.payload}
        default: return state;
    }
};

export const setIsProfileCreationDrawer = (payload: boolean) => ({type: SET_IS_PROFILE_CREATION_DRAWER, payload});
export const setIsEditProfileDrawer = (payload: boolean) => ({type: SET_IS_EDIT_PROFILE_DRAWER, payload});