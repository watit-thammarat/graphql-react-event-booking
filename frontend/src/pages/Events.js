import React, { Component, Fragment } from 'react';

import './Event.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';

class Events extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = { creating: false, events: [] };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = async () => {
    const body = {
      query: `
        query {
          events {
            _id
            title
            price
            description
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };
    try {
      const res = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const statuses = [200, 201];
      if (!statuses.includes(res.status)) {
        throw new Error('Failed');
      }
      const { data } = await res.json();
      this.setState({ events: data.events });
    } catch (err) {
      console.error(err);
    }
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true });

    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  };

  modalConfirmHandler = async () => {
    this.setState({ creating: false });

    const title = this.titleElRef.current.value;
    const price = this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const body = {
      query: `
        mutation {
          createEvent(eventInput: { title: "${title}", price: ${+price} , description: "${description}", date: "${date}" }) {
            _id
            title
            price
            description
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };
    const token = this.context.token;
    try {
      const res = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const statuses = [200, 201];
      if (!statuses.includes(res.status)) {
        throw new Error('Failed');
      }
      const json = await res.json();
      console.log('json: ', json);
      this.fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  render() {
    const { creating, events } = this.state;
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
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input id="title" type="text" ref={this.titleElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input id="price" type="number" ref={this.priceElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input id="date" type="datetime-local" ref={this.dateElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    ref={this.descriptionElRef}
                  />
                </div>
              </form>
            </Modal>
          </Fragment>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">
          {events.map(e => (
            <li key={e._id} className="events__list-item">
              {e.title}
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

export default Events;
