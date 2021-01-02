import React, { useRef, useEffect } from 'react';

const Video = props => {
    const video = useRef();

    useEffect(() => {
        if (props.isPreview) {
            video.current.muted = true;
            video.current.disablePictureInPicture = true;
    
            playVideo();
        }
    });

    const playVideo = () => {
        if (!video.current) return; 
        
        const promise = video.current.play();

        if (props.setRef) {
            props.setRef({
                promise,
                stop: stopVideo
            });
        }
    };

    const stopVideo = () => {
        if (!video.current) return; 

        video.current.pause();
        video.current.currentTime = 0;
    }

    return  (
        <video 
            ref={video}
            className={props.className} 
            src={props.src} 
            controls={props.controls || false}
            autoPlay={props.play}
        />
    );

}


export default Video;