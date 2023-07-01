const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');

const port = process.env.PORT || 5000;
const app = express();

const schema = require('./schema/schema.js');

const colors = require('colors');
const connectDB = require('./config/db.js');

connectDB();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(port, () => {
  console.log('Server running on port', port);
});
