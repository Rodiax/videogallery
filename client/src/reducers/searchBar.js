import { SHOW_INPUT_LIST, SET_INPUT_TEXT } from '../actions/types';

const defaultState = {
    show: false,
    text: ''
};

export default function searchBar(state = defaultState, action) {
    switch(action.type) {
        case SHOW_INPUT_LIST:
            return {
                ...state,
                showList: action.payload
            }
        case SET_INPUT_TEXT:
            return {
                ...state,
                text: action.payload
            }
        default:
            return state
    }
}