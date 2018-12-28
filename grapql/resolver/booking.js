const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');
const { USER_ID } = require('../../helpers/user');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find({});
      return bookings.map(transformBooking);
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
      return transformBooking(booking);
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
      return transformEvent(event);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};
