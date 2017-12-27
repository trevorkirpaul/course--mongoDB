const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

// set up mongoose
// mocha is using 'test' and has its own
// connection setup in `test_helper.js`
// can't connect testDB here, reasoning inside above file 
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test'){
  mongoose.connect('mongodb://localhost/muber', { useMongoClient: true });
}

// set up middleware -- needs to be above routes
// set up body-parser to assume incoming requests
// are JSON and parse into object
app.use(bodyParser.json());

// routes
routes(app);

// our custom middleware
// error handler
// next is a fxn, when called it forcibly goes to
// the next middleware in the chain
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});


module.exports = app;