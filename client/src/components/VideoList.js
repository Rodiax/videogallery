import React from 'react';
import { connect } from 'react-redux';

import uuid from 'react-uuid';

import VideoCard from './VideoCard';

import { addVideoData } from '../actions/creators';

import divideToPartition from '../utils/array';
import API from '../api';

import { CardDeck } from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroll-component';



const mapStateToProps = state => ({
    videoData: state.data.videoData,
    isLoading: state.data.isLoading
});

const mapDispatchToProps = {
    addVideoData
};

const VideoList = connect(mapStateToProps, mapDispatchToProps)(props => {
    const videosInRow = 4;

    const videoComponent = videoData => <VideoCard key={videoData.id} data={videoData} />;
    
    const appendNextData = () => props.addVideoData(API.FilteredVideos.getFiltered(props.videoData.length) || API.Videos.getAll({ offset: props.videoData.length }));  
    
    if (!props.videoData.length && !props.isLoading) {
        return <div>No videos!</div>;
    }

    return (
        <InfiniteScroll
            dataLength={props.videoData.length}
            hasMore={true}
            next={appendNextData} 
            className="overflow-hidden"
        >            
        {
            divideToPartition(props.videoData, videosInRow).map((part) => {
                return <CardDeck className="mb-4" key={uuid()}>{ part.map(videoComponent) }</CardDeck>
            })
        }
        </InfiniteScroll>        
    );
});

        
export default VideoList;