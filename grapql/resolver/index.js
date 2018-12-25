const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const USER_ID = '5c17e70b5dbfb1455bab4802';

const getEvents = async ids => {
  try {
    const events = await Event.find({ _id: { $in: ids } });
    return events.map(e => ({
      ...e._doc,
      _id: e.id,
      date: new Date(e.date).toISOString(),
      creator: getUser.bind(this, e.creator)
    }));
  } catch (err) {
    throw err;
  }
};

const getEvent = async id => {
  try {
    const event = await Event.findOne({ _id: id });
    return {
      ...event._doc,
      _id: event.id,
      date: new Date(event.date).toISOString(),
      creator: getUser.bind(this, event.creator)
    };
  } catch (err) {
    throw err;
  }
};

const getUser = async id => {
  try {
    const user = await User.findById(id);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: getEvents.bind(this, user.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find({});
      return events.map(e => ({
        ...e._doc,
        _id: e.id,
        date: new Date(e.date).toISOString(),
        creator: getUser.bind(this, e.creator._id)
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  createEvent: async ({ eventInput }) => {
    const { title, description, price, date } = eventInput;
    let event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: USER_ID
    });
    try {
      event = await event.save();
      let user = await User.findById(USER_ID);
      if (!user) {
        throw new Error('User exists already.');
      }
      user.createdEvents.push(event);
      user = await user.save();
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event.date).toISOString(),
        creator: getUser.bind(this, USER_ID)
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  createUser: async ({ userInput }) => {
    let { email, password } = userInput;
    try {
      let user = await User.findOne({ email });
      if (user) {
        throw new Error('User exists already.');
      }
      password = await bcrypt.hash(password, 12);
      user = new User({ email, password });
      user = await user.save();
      return { ...user._doc, password: null, _id: user.id };
    } catch (err) {
      throw err;
    }
  },

  bookings: async () => {
    try {
      const bookings = await Booking.find({});
      return bookings.map(b => ({
        ...b._doc,
        _id: b.id,
        createdAt: new Date(b.createdAt).toISOString(),
        updatedAt: new Date(b.updatedAt).toISOString()
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  bookEvent: async ({ eventId }) => {
    try {
      let booking = new Booking({
        event: eventId,
        user: USER_ID
      });
      booking = await booking.save();
      return {
        ...booking._doc,
        _id: booking.id,
        user: getUser.bind(this, booking.user),
        event: getEvent.bind(this, booking.event),
        createdAt: new Date(booking.createdAt).toISOString(),
        updatedAt: new Date(booking.updatedAt).toISOString()
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  cancelBooking: async ({ bookingId }) => {
    try {
      let booking = await Booking.findOneAndDelete({ _id: bookingId });
      await Booking.populate(booking, { path: 'event' });
      const { event } = booking;
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event.date).toISOString(),
        creator: getUser.bind(this, event.creator)
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};
