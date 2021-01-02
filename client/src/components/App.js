import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Container } from 'reactstrap';

import VideoList from './VideoList';
import ModalWindow from './Modal/ModalWindow';
import Filter from './Filter';
import AppWrapper from './AppWrapper';

import { addVideoData } from '../actions/creators';
import API from '../api';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


const mapDispatchToProps = {
    addVideoData
};

function App(props) { 
    useEffect(() => {
        props.addVideoData(API.Videos.getAll({}));
    });

    return (
        <AppWrapper>
            <Container>
                <Filter />
                <VideoList />
                <ModalWindow />
            </Container>
        </AppWrapper>
    ); 
}


export default connect(null, mapDispatchToProps)(App);