import React from 'react';

import { connect } from 'react-redux';
import { showSuggestionList } from '../actions/creators';

const mapDispatchToProps = {
    showSuggestionList
};

const AppWrapper = connect(null, mapDispatchToProps)(props => {
    const closeSuggestionList = (e) => {
        props.showSuggestionList(false);
    };
    
    return (
        <div onClick={closeSuggestionList}>
            {props.children}
        </div>
    )
});

export default AppWrapper;