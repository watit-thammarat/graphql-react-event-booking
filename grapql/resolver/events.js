const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

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

  createEvent: async ({ eventInput }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const { title, description, price, date } = eventInput;
    let event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: req.userId
    });
    try {
      event = await event.save();
      let user = await User.findById(req.userId);
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
