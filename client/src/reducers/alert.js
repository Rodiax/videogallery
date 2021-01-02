import { SET_ALERT, SHOW_ALERT, SET_ALERT_DEFAULT } from '../actions/types';

const defaultState = {
    show: false,
    body: '',
    color: 'success',
    fadeOffTime: 2000
};


export default (state = defaultState, action) => {
    switch(action.type) {
        case SHOW_ALERT: 
            return {
                ...state,
                show: action.payload
            }
        case SET_ALERT:
            return {
                ...state,
                body: action.payload.body,
                color: action.payload.color,
                fadeOffTime: action.payload.fadeOffTime
            }
        case SET_ALERT_DEFAULT:
            return {
                ...defaultState
            }
        default:
            return state;
    }
}