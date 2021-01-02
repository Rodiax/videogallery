import React, { useState, useEffect, useRef } from 'react';
import uuid from 'react-uuid';

import { connect } from 'react-redux';
import { showSuggestionList, setSuggestedText, setVideoData, toggleModal, setModalContent } from '../actions/creators';

import ContentList from './Modal/ContentList';
import Loader from './Loader';
import API from '../api';

import {
    InputGroup,
    InputGroupAddon,
    Input,
    Button,
    ListGroup,
    ListGroupItem,
    Row,
    Col
} from 'reactstrap';




const mapStateToProps = state => {
    return {
        showList: state.searchBar.showList,
        text: state.searchBar.text,
        videoData: state.data.videoData
    }
};


const mapDispatchToProps = dispatch => {
    return {
        showSuggestionList: 
            (...args) => dispatch(showSuggestionList(...args)),
        setSuggestedText: 
            (...args) => dispatch(setSuggestedText(...args)),
        setVideoData: 
            (func, opts) => {
                API.FilteredVideos.storeFilter(func, opts);

                dispatch(setVideoData(func(opts)));
            },

        toggleModal: 
            (...args) => dispatch(toggleModal(...args)),
        setModalContent:
            (...args) => dispatch(setModalContent(...args))
    };
};

const SearchBar = connect(mapStateToProps, mapDispatchToProps)(props => {
    const inputRef = useRef();

    const openList = () => 
        props.showSuggestionList(true);

    const setText = e => 
        props.setSuggestedText(e.target.value);

    const handleKey = e => {
        const [ ENTER_KEY, ESC_KEY ] = [ 13, 27 ];

        if (![ENTER_KEY, ESC_KEY].includes(e.keyCode)) {
            return;
        }

        if (e.keyCode === ENTER_KEY) {
            setSuggested();
        }

        e.target.blur();
        props.showSuggestionList(false);
    };

    const setSuggested = () => {
        const inputValue = inputRef.current.props.value;

        props.setSuggestedText(inputValue);

        props.setVideoData(inputValue.length ? API.Filter.filterTypedVideo : API.Videos.getAll, { text: inputValue });
    }

    return (
        <InputGroup>
            <Input 
                ref={inputRef}
                placeholder="Search" 
                value={props.text}

                onChange={setText}
                onFocus={openList}
                onClick={e => e.stopPropagation()}
                onKeyDown={handleKey}
            />
            <InputGroupAddon addonType="append">
                <Button color="info" onClick={setSuggested}>
                    <svg width="3em" height="1em" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                        <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                    </svg>
                </Button>
            </InputGroupAddon>
        </InputGroup>
    );
});

const SearchList = connect(mapStateToProps, mapDispatchToProps)(props => {
    if (!props.showList) return null;

    const [suggestions, setSuggestions] = useState([]);

    const selectItem = (filter, sug) => {
        props.setSuggestedText(sug.result);
        props.showSuggestionList(false);

        props.setVideoData(API.Filter.selectFilteredVideo, { id: sug.id, filter: filter });
    };

    useEffect(() => {
        API.Filter
            .getSuggestions({ text: props.text })
            .then(sugs => setSuggestions(sugs.data));
    }, [props.text]);
    
    return (
        <Col xl="6" lg="6" md="7" sm="8" xs="8">
            <ListGroup className={`position-absolute w-100 searchlist-shadow ${suggestions.length && 'scroll-y'} z-index-1000`}>
                {
                    suggestions.length
                        ? suggestions.map(sugs => <SearchListItem key={uuid()} suggestion={sugs} selectItem={selectItem} />)
                        : <ListGroupItem disabled tag="button" className="text-left negative-m-1">No results</ListGroupItem>
                }   
            </ListGroup>
        </Col>
    );
});

const SearchListItem = ({ suggestion, selectItem }) => {
    return (
        <>
            <ListGroupItem 
                key={uuid()} 
                disabled 
                tag="button"
                className="text-capitalize text-left p-0"
            >
                <div className="bg-info text-white pt-2 pb-2 pl-3 pr-3 negative-m-1">
                    <strong>{ suggestion.filter }</strong>
                </div>
                
            </ListGroupItem>  
            
            { 
                suggestion.data.map(data => 
                    <ListGroupItem 
                        key={uuid()} 
                        action
                        tag="button"
                        className="text-left"
                        onClick={() => selectItem(suggestion.filter, data)}
                    >
                        { data.result }
                    </ListGroupItem>
                ) 
            }
        </>
    );
};

const ContentListButton = connect(null, mapDispatchToProps)(props => {
    const openContentList = () => {
        props.toggleModal(true);

        props.setModalContent({
            title: 'Content list',
            body: <ContentList />
        });
    }

    return (
        <Button color="info" onClick={openContentList}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                <path fillRule="evenodd" d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
            </svg>
        </Button>
    );
});

const Filter = props => {
    return (
        <div className="sticky-top mb-4">
            <div className="bg-secondary rounded-bottom p-4">
                <Row>
                    <Col xl="7" lg="8" md="9" sm="10" xs="10">
                        <SearchBar />
                    </Col>
                    <div>
                        <ContentListButton />
                    </div>
                </Row>
                <Row>
                    <SearchList />
                </Row>
            </div>
            
            <div className="overflow-hidden">
                <Loader />
            </div>
        </div>
    );
};

export default Filter;