import {
    TOOGLE_MODAL,
    SET_MODAL_CONTENT,

    SHOW_INPUT_LIST,
    SET_INPUT_TEXT,

    SHOW_LOADER,

    ADD_VIDEO_DATA,
    SET_VIDEO_DATA,

    SHOW_ALERT,
    SET_ALERT,
    SET_ALERT_DEFAULT
} from './types';


const toggleModal = openClose => {
    return {
        type: TOOGLE_MODAL,
        payload: openClose
    };
};

const setModalContent = content => {
    return {
        type: SET_MODAL_CONTENT,
        payload: content
    };
};

const showSuggestionList = show => {
    return {
        type: SHOW_INPUT_LIST,
        payload: show
    };
};

const setSuggestedText = text => {
    return {
        type: SET_INPUT_TEXT,
        payload: text
    };
};

const showLoader = show => {
    return {
        type: SHOW_LOADER,
        payload: show
    };
};

const addVideoData = data => {
    return {
        type: ADD_VIDEO_DATA,
        payload: data
    };
};

const setVideoData = data => {
    return {
        type: SET_VIDEO_DATA,
        payload: data
    };
};

const showAlert = show => {
    return {
        type: SHOW_ALERT,
        payload: show
    };
};

const setAlert = params => {
    return {
        type: SET_ALERT,
        payload: params
    };
};

const setAlertToDefault = () => {
    return {
        type: SET_ALERT_DEFAULT
    };
};

export {
    toggleModal,
    setModalContent,

    showSuggestionList,
    setSuggestedText,

    showLoader,

    addVideoData,
    setVideoData,

    setAlert,
    showAlert,
    setAlertToDefault
};