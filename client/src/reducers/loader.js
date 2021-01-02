import { SHOW_LOADER } from '../actions/types';

const defaultState = {
    show: false
};

export default (state = defaultState, action) => {
    switch(action.type) {
        case SHOW_LOADER:
            return {
                ...state,
                show: action.payload
            }
        default:
            return state;
    }
}