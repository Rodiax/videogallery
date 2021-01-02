import axios from 'axios';

const API_URL = `http://localhost:9000`;

const Videos = {
    getAll: opts => 
        axios.get(`${API_URL}/videos/all?offset=${opts.offset || 0}`),
    update: changes => 
        axios.put(`${API_URL}/videos/update`, changes)
};

const Filter = {
    filterTypedVideo: opts =>
        axios.get(`${API_URL}/videos/search?text=${opts.text}&offset=${opts.offset || 0}`),
    selectFilteredVideo: opts =>
        axios.get(`${API_URL}/videos/filter?id=${opts.id}&filter=${opts.filter}&offset=${opts.offset || 0}`),
    getSuggestions: opts =>
        axios.get(`${API_URL}/videos/suggestion?text=${opts.text}`)
};

const FilteredVideos = {
    getFiltered: offset => undefined,

    storeFilter: (funcRef, opts) => 
        FilteredVideos.getFiltered = offset => funcRef({...opts, offset})
};

const List = {
    getVideos: opts => 
        axios.get(`${API_URL}/list/videos?offset=${opts.offset || 0}`),
    getCategories: opts => 
        axios.get(`${API_URL}/list/categories?offset=${opts.offset || 0}`),
    getActors: opts => 
        axios.get(`${API_URL}/list/actors?offset=${opts.offset || 0}`),
};


export default {
    Videos,

    Filter,
    FilteredVideos,

    List
};
