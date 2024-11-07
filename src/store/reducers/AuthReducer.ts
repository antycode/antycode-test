import {Reducer} from "redux";

interface AuthType {
    token: string
}

type AuthAction = {
    type: any;
    payload: any;
};

const authState = {
    token: ''
};

const SET_TOKEN = 'SET_TOKEN';

export const AuthReducer: Reducer<AuthType, AuthAction> = (state = authState, action) => {
    switch (action.type) {
        case SET_TOKEN:
            return {...state, token: action.payload}
        default: return state;
    }
};

export const setToken = (payload: string) => ({type: SET_TOKEN, payload});