import React, { Component, Fragment } from 'react';

import './Event.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

class Events extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      events: [],
      isLoading: false,
      selectedEvent: null
    };
    this.isActive = true;
  }

  componentDidMount() {
    this.fetchEvents();
  }

  componentWillUnmount() {
    this.isActive = false;
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
      this.setState({ isLoading: true });
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
      if (this.isActive) {
        this.setState({ events: data.events });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
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
          }
        }
      `
    };
    const token = this.context.token;
    try {
      this.setState({ isLoading: true });
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
      this.setState(prev => ({
        events: [
          ...prev.events,
          {
            ...json.data.createEvent,
            creator: { _id: this.context.userId }
          }
        ]
      }));
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  showDetailHandler = id => {
    this.setState(prev => ({
      selectedEvent: prev.events.find(e => e._id === id)
    }));
  };

  bookEventHandler = async () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const body = {
      query: `
        mutation {
          bookEvent(eventId: "${this.state.selectedEvent._id}") {
            _id
            createdAt
            updatedAt
          }
        }
      `
    };
    try {
      const token = this.context.token;
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
      const { data } = await res.json();
      console.log(data);
      this.setState({ selectedEvent: null });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { creating, events, selectedEvent } = this.state;
    return (
      <Fragment>
        {creating && (
          <Fragment>
            <Backdrop />
            <Modal
              title="Add Event"
              confirmText="Confirm"
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
        {selectedEvent && (
          <Fragment>
            <Backdrop />
            <Modal
              title={selectedEvent.title}
              confirmText={this.context.token ? 'Book' : 'Confirm'}
              canCancel
              canConfirm
              onCancel={this.modalCancelHandler}
              onConfirm={this.bookEventHandler}
            >
              <h1>{selectedEvent.title}</h1>
              <h2>
                ${selectedEvent.price} -{' '}
                {new Date(selectedEvent.date).toLocaleDateString()}
              </h2>
              <p>{selectedEvent.description}</p>
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
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            authUserId={this.context.userId}
            events={events}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </Fragment>
    );
  }
}

export default Events;
