import React, { useState } from 'react';
import { connect } from 'react-redux';

import VideoContentInfo from './VideoContentInfo';
import VideoContentEdit from './VideoContentEdit';

const mapStateToProps = state => {
    return {
        videoData: state.data.videoData
    }
}

const VideoContent = connect(mapStateToProps)(props => {
    const [showEdit, setShowEdit] = useState(false);

    const videoData = props.videoData.find(data => data.id === props.id);

    return (
        showEdit 
            ? <VideoContentEdit data={videoData} switchToEdit={setShowEdit} /> 
            : <VideoContentInfo data={videoData} switchToEdit={setShowEdit} /> 
    );
});

export default VideoContent;