const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
// const cors = require('cors');

const schema = require('./grapql/schema');
const rootValue = require('./grapql/resolver');
const isAuth = require('./middleware/is-auth');

const PORT = 5000;
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema,
    rootValue,
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
