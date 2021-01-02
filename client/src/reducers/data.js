import { 
    ADD_VIDEO_DATA, 
    ADD_VIDEO_DATA_FULFILLED, 
    ADD_VIDEO_DATA_PENDING, 
    
    SET_VIDEO_DATA, 
    SET_VIDEO_DATA_FULFILLED 
} from '../actions/types';


const defaultState = {
    videoData: [],
    isLoading: false
};

export default (state = defaultState, action) => { 
    switch (action.type) {
        case ADD_VIDEO_DATA_PENDING:
            return {
                ...state,
                isLoading: true
            }
        case ADD_VIDEO_DATA:
        case ADD_VIDEO_DATA_FULFILLED:
            return {
                ...state,
                isLoading: false,
                videoData: [...state.videoData].concat(...action.payload.data)
            }
        case SET_VIDEO_DATA:
        case SET_VIDEO_DATA_FULFILLED:
            return {
                ...state,
                videoData: [].concat(...action.payload.data)
            }
        default:
            return state;
    }
};