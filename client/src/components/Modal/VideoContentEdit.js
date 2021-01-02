import React, { useState } from 'react';
import { connect } from 'react-redux';
import uuid from 'react-uuid';

import { setAlert, showAlert, setVideoData, setModalContent } from '../../actions/creators';

import API from '../../api';

import { 
    Col, 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    ButtonGroup,
    Row,
    InputGroup,
    InputGroupAddon,
    Alert
} from 'reactstrap';




const LabeledGroup = props => {

    const addLabel = () => {
        const labelInput = document.getElementById(props.labelId);

        if (!labelInput.value.length) {
            labelInput.classList.add('is-invalid');
            return;
        } else {
            labelInput.classList.remove('is-invalid');
        }

        props.add(props.labelId, {
            name: labelInput.value,
            id: uuid()
        });

        labelInput.value = '';
    };

    const deleteLabel = id => {
        props.delete(props.labelId, id);
    };

    return (
        <FormGroup row>
            <Label for={props.labelId} lg={2}>{props.labelName}</Label>
            <Col lg={10}>
                
                <Row className="mb-2">
                    <Col lg={12}>
                        <InputGroup>
                            <Input type="text" name={props.labelId} id={props.labelId} />
                            <InputGroupAddon addonType="append"><Button onClick={addLabel}>{props.addButtonName}</Button></InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <div className={`border border-${props.color} rounded p-1`}>
                            {
                                props.data.length 
                                    ? props.data.map(data => {
                                        return <ButtonGroup className="m-1" key={uuid()}>
                                                    <Button outline disabled color={props.color} className={`text-${props.textColor}`} size="sm">
                                                        {data.name}
                                                    </Button>
                                                    <Button color={props.color} size="sm" onClick={e => deleteLabel(data.id)}>&times;</Button>
                                                </ButtonGroup>
                                    })
                                    : <Alert color={props.color} className="m-0">There are no {props.labelName}!</Alert>
                                
                            }
                        </div>                   
                    </Col>
                </Row>
                
            </Col>
        </FormGroup>
    );
};

const mapStateToProps = state => {
    return {
        videoData: state.data.videoData,
        
        modalTitle: state.modal.title,
        modalBody: state.modal.body, 
        modalFooter: state.modal.footer
    }
};
 
const mapDispatchToProps = {
    setAlert,
    showAlert,
    setVideoData,
    setModalContent
};

const VideoContentEdit = connect(mapStateToProps, mapDispatchToProps)(props => {
    const [data, setData] = useState(Object.assign({}, props.data));

    const handleCancel = () => {
        props.switchToEdit(false);
    };
    
    const handleLabelAdd = (labelKey, value) => {
        setData(data => {
            return {
                ...data,
                [labelKey]: data[labelKey].concat(value)
            };
        });
    };

    const handleLabelDel = (labelKey, id) => {
        setData(data => {
            data[labelKey] = data[labelKey].filter(item => item.id !== id);
            
            return {
                ...data
            };
        });
    };


    const handleSavedChanges = e => {
        e.preventDefault();

        const changes = {
            ...data,
            name: e.target.elements["name"].value,
            year: e.target.elements["year"].value,
            description: e.target.elements["description"].value
        }

        API.Videos
            .update(changes)
            .then(res => {
                const dataToSet = [].concat(props.videoData);
                const toReplaceIndex = dataToSet.findIndex(video => video.id === changes.id);
                
                dataToSet[toReplaceIndex] = res.data[0];

                props.showAlert(true);
                props.setAlert({
                    body: 'Saved!',
                    color: 'success',
                    fadeOffTime: 3000
                });

                props.setVideoData({ data: dataToSet });

                props.setModalContent({
                    title: changes.name,
                    body: props.modalBody,
                    footer: props.modalFooter
                });

            })
            .catch(err => {
                props.showAlert(true);
                props.setAlert({
                    body: 'Something went wrong!',
                    color: 'danger',
                    fadeOffTime: 3000
                });
            }); 
         
    };

    return (
        <Form className="w-100" onSubmit={handleSavedChanges}>
            <FormGroup row>
                <Label for="name" lg={2}>Name</Label>
                <Col lg={10}>
                    <Input 
                        type="text" 
                        name="name" 
                        id="name" 
                        defaultValue={data.name} 
                    />
                </Col>
            </FormGroup>

            <FormGroup row>
                <Label for="description" lg={2}>Description</Label>
                <Col lg={10}>
                    <Input 
                        type="textarea" 
                        name="description" 
                        id="description" 
                        defaultValue={data.description}
                        className="area-minh"
                    />
                </Col>
            </FormGroup>

            <FormGroup row>
                <Label for="year" lg={2}>Year</Label>
                <Col lg={2}>
                    <Input 
                        type="text" 
                        name="year" 
                        id="year" 
                        defaultValue={data.year} 
                    />
                </Col>
            </FormGroup>

            <LabeledGroup 
                labelName="Actors"
                labelId="actors"
                addButtonName="Add Actor"
                data={data.actors}
                color="primary"
                add={handleLabelAdd}
                delete={handleLabelDel}
            />

            <LabeledGroup 
                labelName="Categories"
                labelId="categories"
                addButtonName="Add Category"
                data={data.categories}
                color="info"
                add={handleLabelAdd}
                delete={handleLabelDel}
            />

            <LabeledGroup 
                labelName="Tags"
                labelId="tags"
                addButtonName="Add Tag"
                data={data.tags}
                color="warning"
                add={handleLabelAdd}
                delete={handleLabelDel}
                textColor="dark"
            />

            <Row>
                <Col
                 className="text-right">
                    <Button color="secondary" className="mr-2" onClick={handleCancel}>Cancel</Button>    
                    <Button color="success">Save</Button>    
                </Col>
            </Row>
            
        </Form>
    );
});


export default VideoContentEdit;