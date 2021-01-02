import React from 'react';
import Sticker from './Sticker';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from 'react-redux';
import { 
	toggleModal
} from '../../actions/creators';

const mapStateToProps = state => {
	return {
		isOpen: state.modal.opened,

		title: state.modal.title,
		body: state.modal.body,
		footer: state.modal.footer
	};
};

const mapDispatchToProps = {
	toggleModal
};

const ModalWindow = connect(mapStateToProps, mapDispatchToProps)(props => {
    const { buttonLabel } = props;

    const toggle = () => props.toggleModal(!props.isOpen);
 
    return (
        <div>
			{buttonLabel && <Button color="danger" onClick={toggle}>{buttonLabel}</Button>}

			<Modal isOpen={props.isOpen} toggle={toggle} className="modal-window-width">	
				<Sticker />

				{
					props.title &&
						<ModalHeader toggle={toggle}>{props.title}</ModalHeader>
				}
				
				{
					props.body &&
						<ModalBody className="p-0">
							{props.body}
						</ModalBody>
				}

				{
					props.footer &&
						<ModalFooter className="justify-content-start">
							{props.footer}
						</ModalFooter>
				}
				
			</Modal>
        </div>
      );
});

export default ModalWindow;

