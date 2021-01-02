import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import API from '../../api';

import { setVideoData, setSuggestedText, toggleModal } from '../../actions/creators';

import InfiniteScroll from 'react-infinite-scroll-component';

import { 
    TabContent, 
    TabPane, 
    Nav, 
    NavItem, 
    NavLink,
    Row, 
    Col,
    Badge,
    ListGroup,
    ListGroupItem,
    Spinner
} from 'reactstrap';


const mapDispatchToProps = dispatch => {
    return {
        setSuggestedText: 
            (...args) => dispatch(setSuggestedText(...args)),
        setVideoData: 
            (func, opts) => {
                API.FilteredVideos.storeFilter(func, opts);

                dispatch(setVideoData(func(opts)));
            },
        toggleModal: 
            (...args) => dispatch(toggleModal(...args))
    };
};


const TabTitle = props => {
    return (
        <NavItem>
            <NavLink
                className={`${props.activeTab === props.tabIndex && 'active'} pointer`}
                onClick={() => props.toggle(props.tabIndex)}
            >
            { props.title }
            </NavLink>
        </NavItem>
    );
};

const TabBody = connect(null, mapDispatchToProps)(props => {
    const [content, setContent] = useState([...props.content.data]);

    const appendNextData = () => {
        props.content
            .fetch({ offset: content.length })
            .then(result => {
                setContent(data => [...data, ...result.data.content]);
            });
    };

    const chooseVideo = (id, title) => {
        props.setVideoData(API.Filter.selectFilteredVideo, { id, filter: props.content.item.toLowerCase() });
        props.setSuggestedText(title);
        props.toggleModal(false);
    };
    
    return (
        <TabPane tabId={props.tabIndex}>
            <Row className="mt-3">
                <Col sm="12">
                    <h5 className="underline">{ props.title } <Badge color="secondary">{ props.content.total }</Badge></h5>
                </Col>
            </Row>
            <Row>
                <Col sm="12" >   
                    <InfiniteScroll
                            dataLength={content.length}
                            hasMore={true}
                            next={appendNextData} 
                            style={{overflow: 'hidden'}}
                            scrollableTarget={`tab-${props.tabIndex}`}
                        >
                        <ListGroup id={`tab-${props.tabIndex}`} flush style={{maxHeight: '500px', overflowY: 'auto'}}>     
                        {
                            
                            content.map(data => {
                                return <ListGroupItem tag="button" onClick={() => chooseVideo(data.id, data.name)} key={data.id} action>{ data.name }</ListGroupItem>
                            })
                        }
                        </ListGroup>    
                    </InfiniteScroll>    
                </Col>
            </Row>
        </TabPane>
    );
});

const ContentList = props => {
    const [activeTab, setActiveTab] = useState(0);
    const [contentList, setContentList] = useState([]);

    useEffect(() => {
        Promise.all(
            [
                API.List.getVideos({offset : 0}),
                API.List.getCategories({offset : 0}),
                API.List.getActors({offset : 0})
            ]
        ).then(data => {
            const [videos, cats, actors] = data;

            setContentList([
                { item: 'Videos', data: videos.data.content, total: videos.data.total, fetch: API.List.getVideos },
                { item: 'Categories', data: cats.data.content, total: cats.data.total, fetch: API.List.getCategories },
                { item: 'Actors', data: actors.data.content, total: actors.data.total, fetch: API.List.getActors }
            ]);
        });
    }, []);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    if (!contentList.length) {
        return (
            <div className="p-4 d-flex justify-content-center align-items-center">
                <Spinner style={{ width: '3rem', height: '3rem' }} color="primary" />
            </div>
        );
    }
    
    return (
        <div className="p-4">
            <Nav tabs>
                {
                    contentList.map((content, index) => {
                        return (
                            <TabTitle 
                                title={content.item}
                                tabIndex={index} 
                                activeTab={activeTab} 
                                toggle={toggle}
                                key={index}
                            /> 
                        );
                    })
                }
            </Nav>

            <TabContent activeTab={activeTab}>
                {
                    contentList.map((content, index) => {
                        return (
                            <TabBody 
                                title={content.item}
                                content={content}
                                tabIndex={index} 
                                key={index}
                            />
                        );
                    })
                }
            </TabContent>
        </div>
    );
};


export default ContentList;