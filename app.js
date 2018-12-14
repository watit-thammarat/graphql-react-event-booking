const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

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

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
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
          return events.map(e => ({ ...e._doc, _id: e.id.toString() }));
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
          date: new Date(date)
        });
        try {
          event = await event.save();
          console.log(event);
          return { ...event._doc, _id: event.id.toString() };
        } catch (err) {
          console.error(err);
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
