// mongoose setup
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// connect to mongoose before all tests
before((done) => {
  mongoose.connect('mongodb://localhost/users_test', {
    useMongoClient: true,
  });
  mongoose.connection
    .once('open', () => { done(); })
    .on ('error', (error) => {
      console.warn('Warning', error);
    });
});

  
// hook, helps us clear the db each time we run each test
//  from mocha
beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});