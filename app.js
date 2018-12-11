const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = 3000;
const app = express();

const events = [];

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
      events: () => {
        return events;
      },

      createEvent: ({ eventInput }) => {
        const { title, description, price, date } = eventInput;
        const event = {
          _id: Math.random().toString(),
          title,
          description,
          price: +price,
          date: date
        };
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
