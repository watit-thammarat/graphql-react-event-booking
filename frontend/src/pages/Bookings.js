import React, { Component, Fragment } from 'react';

import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';

class Bookings extends Component {
  static contextType = AuthContext;

  state = {
    isLoading: false,
    bookings: []
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

  render() {
    const { isLoading } = this.state;
    return (
      <Fragment>
        {isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {this.state.bookings.map(b => (
              <li key={b._id}>
                {b.event.title} - {new Date(b.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </Fragment>
    );
  }
}

export default Bookings;
