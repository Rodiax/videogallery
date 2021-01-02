import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { setAlert, showAlert, setAlertToDefault } from '../../actions/creators';

import {
    Alert
} from 'reactstrap';


const mapStateToProps = state => {
    return {
        body: state.alert.body,
        color: state.alert.color,
        show: state.alert.show,
        fadeOffTime: state.alert.fadeOffTime
    }
};

const mapDispatchToProps = {
    setAlert,
    showAlert,
    setAlertToDefault
};

const Sticker = connect(mapStateToProps, mapDispatchToProps)(props => {
    const stickerRef = useRef();
    
    useEffect(() => {
        if (!props.show) return;

        const stickerNode = stickerRef.current;

        stickerNode.classList.add('shown');

        setTimeout(() => {
            stickerNode.classList.remove('shown');

            props.setAlertToDefault();
        }, props.fadeOffTime || 2000);
    });

    return (
        <div className="sticker-wrapper">
            <div className="sticker" ref={stickerRef}>
                <Alert color={props.color}>{props.body}</Alert>
            </div>
        </div>
    );
});

export default Sticker;