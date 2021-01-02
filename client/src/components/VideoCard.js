import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardTitle, CardText, CardBody, CardSubtitle, Spinner
} from 'reactstrap';

import { connect } from 'react-redux';

import { toggleModal, setModalContent } from '../actions/creators';

import Video from './Video';
import VideoContent from './Modal/VideoContent';


const mapDispatchToProps = {
    toggleModal,
    setModalContent
};

const VideoCard = (props) => {
    const [previewingVideo, setVideoPreview] = useState(false);
    const headerCardRef = useRef();
    const spinnerRef = useRef();
    const posterRef = useRef();
    let timeout, videoRef;

    useEffect(() => {
        if (!posterRef.current.complete) showSpinner();

        return () => clearTimeout(timeout);
    });

    const toggleModal = () => { 
        props.toggleModal(true);

        props.setModalContent({
            title: props.data.name,
            body: <Video src={props.data.pathTo.video} controls play />,
            footer: <VideoContent id={props.data.id} />
        });
    };

    const handleMouseEnter = () => {
        if (!videoRef) headerCardRef.current.classList.add('loading-preview');

        timeout = setTimeout(() => {
            showSpinner();
            setVideoPreview(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        headerCardRef.current.classList.remove('loading-preview');

        if (videoRef) {
            videoRef.promise.then(() => {
                videoRef.stop();
                
                clearPreview();
            });
        } else {
            clearPreview();
        }
    };

    const clearPreview = () => {
        clearTimeout(timeout);
        hideSpinner();
        setVideoPreview(false);
    }

    const setVideoRef = ref => videoRef = ref;

    const hideSpinner = () => spinnerRef.current.style.display = "none";
    const showSpinner = () => spinnerRef.current.style.display = "block";

    return (
        <Card className="card-preview">
            <div ref={headerCardRef}
                className="card-preview-header" 
                onClick={toggleModal}
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave} 
            >
                <div className="card-header-spinner" ref={spinnerRef}>
                    <Spinner size="sm" color="primary" />
                </div>

                <img 
                    src={props.data.pathTo.poster} 
                    alt={props.data.name} 
                    style={{opacity: (previewingVideo ? 0 : 1)}}
                    onLoad={hideSpinner}
                    ref={posterRef}
                />
                {
                previewingVideo && 
                <Video 
                    isPreview
                    src={props.data.pathTo.preview} 
                    className="video-preview"
                    setRef={setVideoRef}
                    onLoad={hideSpinner}
                />
                }
            </div>
            
            
            <CardBody className="card-preview-body">
                <CardTitle className="card-preview-body__title mb-2">{props.data.name}</CardTitle>
                
                <CardSubtitle className="card-preview-body__subtitle text-truncate mb-3 text-primary">
                    {props.data.actors.map(actor => actor.name).join(', ')}
                </CardSubtitle>
                
                <CardText className="card-preview-body__text">{props.data.description}</CardText>
            </CardBody>

            <div className="card-preview-footer">                
                <div className="card-preview-footer__left">
                    Year: {props.data.year}
                </div>
                <div className="card-preview-footer__right">
                    Duration: {props.data.duration}
                </div>
            </div>
        </Card>
    );
};


export default connect(null, mapDispatchToProps)(VideoCard);
