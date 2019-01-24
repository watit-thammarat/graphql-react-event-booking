import React from 'react';

import './EventItem.css';

const eventItem = ({
  id,
  title,
  price,
  date,
  authUserId,
  creatorId,
  onDetail
}) => {
  return (
    <li className="event__list-item">
      <div>
        <h1>{title}</h1>
        <h2>
          ${price} - {new Date(date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {authUserId === creatorId ? (
          <button className="btn" onClick={() => onDetail(id)}>
            View Details
          </button>
        ) : (
          <p>You are not the owner of this event</p>
        )}
      </div>
    </li>
  );
};

export default eventItem;
