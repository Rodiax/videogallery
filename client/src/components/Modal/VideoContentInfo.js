import React from 'react';

import {
    Badge, Card, CardText, CardBody, CardHeader, CardDeck, Alert
} from 'reactstrap';



const CardItem = props => {
    return (
        <Card className={props.cardClassName}>
            <CardHeader>{props.title}</CardHeader>
            <CardBody>
                <CardText tag="div" className={props.textClassName}>
                    {props.children}
                </CardText>
            </CardBody>
        </Card>
    );
}

const VideoContentInfo = props => {
    let indexedDate = new Date(props.data.indexed);
    
    return (
        <div className="w-100">
            <div className="row">
                <div className="col-6">
                    <h5>{props.data.name}</h5>
                </div>
                <div className="col-6 text-right">
                    {
                        props.data.categories.map(cat => {
                            return <Badge key={cat.id} className="align-middle badge-info ml-1">{cat.name}</Badge>
                        })
                    }
                </div>
            </div>
            
            <div className="row mb-3">
                <div className="col-7" style={{fontSize: '.9rem'}}>
                    <p>{props.data.description}</p>    
                </div>
                <div className="col-5 text-right" style={{fontSize: '.8rem'}}>  
                    <div>Year: <strong>{props.data.year}</strong></div>
                    <div>Duration: <strong>{props.data.duration}</strong></div>
                    <div>Indexed: <strong>{indexedDate.toString().split('GMT')[0]}</strong></div>
                </div>
            </div>
            
            <CardDeck>
                <CardItem cardClassName="border-primary" textClassName="text-primary" title="Actors">
                    {   
                        props.data.actors.length
                            ? props.data.actors.map(act => act.name).join(', ')
                            : <Alert color="primary">No actors.</Alert>
                    }
                </CardItem>
                
                <CardItem cardClassName="border-warning" textClassName="text-warning" title="Tags">
                {
                    props.data.tags.length 
                        ? props.data.tags.map(tag => {
                            return <Badge key={tag.id} className="mr-1 badge-warning">{tag.name}</Badge>
                          })
                        : <Alert color="warning">No tags.</Alert>
                }
                </CardItem>

                <CardItem cardClassName="border-info" textClassName="text-info" title="Categories">
                {
                    props.data.categories.length
                        ? props.data.categories.map(cat => {
                            return <Badge key={cat.id} className="mr-1 badge-info">{cat.name}</Badge>
                          })
                        : <Alert color="info">No categories.</Alert>
                }
                </CardItem>
            </CardDeck>
            
            <div className="row mt-3">
                <div className="col-12 text-right">
                    <button className="btn btn-primary" onClick={() => props.switchToEdit(true)}>
                        <div className="d-flex align-items-center">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square align-baseline mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>Edit
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoContentInfo;