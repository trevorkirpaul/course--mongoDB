const mongoose = require('mongoose');

before(done => {
  mongoose.connect('mongodb://localhost/muber_test');
  mongoose.connection
    .once('open', () => done())
    .on('error', err => {
      console.warn('Warning', error);
    });
});

// we set up this mongo connection here, instead of app.js
// because mocha might exceute a test before we connect
// unless we do it here

beforeEach(done => {
  const { drivers } = mongoose.connection.collections;
  drivers.drop()
    .then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
    .then(() => done())
    .catch(() => done());
});