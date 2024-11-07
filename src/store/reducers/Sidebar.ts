import {Reducer} from "redux";

interface SidebarType {
    width: any
}

type SidebarAction = {
    type: any;
    payload: any;
};

const SidebarState = {
    width: null
};

const SET_SIDEBAR = 'SET_SIDEBAR';

export const SidebarReducer: Reducer<SidebarType, SidebarAction> = (state = SidebarState, action) => {
    switch (action.type) {
        case SET_SIDEBAR:
            return {...state, width: action.payload}
        default: return state;
    }
};

export const setSidebar = (payload: any) => ({type: SET_SIDEBAR, payload});