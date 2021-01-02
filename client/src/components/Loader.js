import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => { 
    return {
        show: [
            state.data.isLoading, 
            state.loader.show
        ]
    }
}

const Loader = connect(mapStateToProps, null)((props) => {
    if (!props.show.includes(true)) return null;

    return (
        <div className={props.type}></div>
    );
});


Loader.defaultProps = {
    type: 'main-loader'
};

export default Loader;