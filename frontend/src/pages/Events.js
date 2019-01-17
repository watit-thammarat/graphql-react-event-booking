import React, { Component, Fragment } from 'react';

import './Event.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class Events extends Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  render() {
    const { creating } = this.state;
    return (
      <Fragment>
        {creating && (
          <Fragment>
            <Backdrop />
            <Modal
              title="Add Event"
              canCancel
              canConfirm
              onCancel={this.modalCancelHandler}
              onConfirm={this.modalConfirmHandler}
            >
              <p>Modal Content</p>
            </Modal>
          </Fragment>
        )}
        <div className="events-control">
          <p>Share your own events</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      </Fragment>
    );
  }
}

export default Events;
