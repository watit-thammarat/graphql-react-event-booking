const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find({});
          return events.map(e => ({ ...e._doc, _id: e.id }));
        } catch (err) {
          console.error(err);
          throw err;
        }
      },

      createEvent: async ({ eventInput }) => {
        const { title, description, price, date } = eventInput;
        const userId = '5c17e70b5dbfb1455bab4802';
        let event = new Event({
          title,
          description,
          price: +price,
          date: new Date(date),
          creator: userId
        });
        try {
          event = await event.save();
          let user = await User.findById(userId);
          if (!user) {
            throw new Error('User exists already.');
          }
          user.createdEvents.push(event);
          user = await user.save();
          return { ...event._doc, _id: event.id };
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
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb://localhost:27017/${process.env.MONGO_DB}`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
  })
  .catch(err => console.error(err));
