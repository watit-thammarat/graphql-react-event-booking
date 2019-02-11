import React, { Component, Fragment } from 'react';

import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingControls/BookingControls';

class Bookings extends Component {
  static contextType = AuthContext;

  state = {
    isLoading: false,
    bookings: [],
    outputType: 'list'
  };

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    const body = {
      query: `
        query {
          bookings {
            _id
            createdAt
            updatedAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `
    };
    try {
      this.setState({ isLoading: true });
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
      this.setState({ bookings: data.bookings });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  deleteBookingHanlder = async id => {
    const body = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: { id }
    };
    try {
      this.setState({ isLoading: true });
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
      await res.json();
      this.setState(prev => ({
        bookings: prev.bookings.filter(b => b._id !== id)
      }));
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  changeOutputTypeHandler = outputType => {
    if (outputType === 'list') {
      this.setState({ outputType: 'list' });
    } else {
      this.setState({ outputType: 'chart' });
    }
  };

  render() {
    const { isLoading, bookings, outputType } = this.state;
    let content = <Spinner />;
    if (!isLoading) {
      content = (
        <Fragment>
          <BookingsControls
            onChange={this.changeOutputTypeHandler}
            activeOutputType={outputType}
          />
          <div>
            {outputType === 'list' ? (
              <BookingList
                bookings={bookings}
                onDelete={this.deleteBookingHanlder}
              />
            ) : (
              <BookingsChart bookings={bookings} />
            )}
          </div>
        </Fragment>
      );
    }
    return <Fragment>{content}</Fragment>;
  }
}

export default Bookings;
