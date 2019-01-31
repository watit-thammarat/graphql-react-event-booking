const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map(transformBooking);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let booking = new Booking({
        event: eventId,
        user: req.userId
      });
      booking = await booking.save();
      return transformBooking(booking);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let booking = await Booking.findOneAndDelete({ _id: bookingId });
      await Booking.populate(booking, { path: 'event' });
      const { event } = booking;
      return transformEvent(event);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};
