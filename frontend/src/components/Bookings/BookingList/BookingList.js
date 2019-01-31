import React from 'react';

import './BookingList.css';

const BookingList = ({ bookings, onDelete }) => {
  return (
    <ul className="bookings__list">
      {bookings.map(b => (
        <li className="bookings__item" key={b._id}>
          <div className="bookings__item-data">
            {b.event.title} - {new Date(b.createdAt).toLocaleDateString()}
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={() => onDelete(b._id)}>
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookingList;
