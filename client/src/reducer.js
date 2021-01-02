import { combineReducers } from 'redux';
import modal from './reducers/modal';
import searchBar from './reducers/searchBar';
import loader from './reducers/loader';
import data from './reducers/data.js';
import alert from './reducers/alert.js';


export default combineReducers({
    modal,
    searchBar,
    loader,
    data,
    alert
});