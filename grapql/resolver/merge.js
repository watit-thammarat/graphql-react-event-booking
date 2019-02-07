const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const DataLoader = require('dataloader');

const eventLoader = new DataLoader(eventIds => {
  return getEvents(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const getEvents = async ids => {
  try {
    const events = await Event.find({ _id: { $in: ids } });
    return events.map(transformEvent);
  } catch (err) {
    throw err;
  }
};

const getEvent = async id => {
  try {
    const event = await eventLoader.load(id.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

const getUser = async id => {
  try {
    const user = await userLoader.load(id.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event.date),
    creator: getUser.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: getUser.bind(this, booking.user),
    event: getEvent.bind(this, booking.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt)
  };
};

module.exports = {
  transformEvent,
  transformBooking
};
