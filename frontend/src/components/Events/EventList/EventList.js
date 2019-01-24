import React from 'react';

import './EventList.css';
import EventItem from './EventItem/EventItem';

const eventList = ({ events, authUserId, onViewDetail }) => {
  return (
    <ul className="event__list">
      {events.map(e => (
        <EventItem
          key={e._id}
          id={e._id}
          title={e.title}
          price={e.price}
          date={e.date}
          authUserId={authUserId}
          creatorId={e.creator._id}
          onDetail={onViewDetail}
        />
      ))}
    </ul>
  );
};

export default eventList;
