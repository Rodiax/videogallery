import { SET_MODAL_CONTENT, SET_MODAL_STYLE, TOOGLE_MODAL } from '../actions/types';

const defaultState = {
    opened: false,

    title: '',
    body: '',
    footer: '',

    className: ''
};  

export default (state = defaultState, action) => {
    switch(action.type) {
        case TOOGLE_MODAL: 
            return {
                ...state,
                opened: action.payload
            }
        case SET_MODAL_CONTENT:
            return {
                ...state,
                title: action.payload.title,
                body: action.payload.body,
                footer: action.payload.footer
            }

        case SET_MODAL_STYLE:
            return {
                ...state,
                className: action.payload
            }
        default:
            return state;
    }
};
