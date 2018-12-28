const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');
const { USER_ID } = require('../../helpers/user');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find({});
      return events.map(transformEvent);
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
      return transformEvent(event);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};
