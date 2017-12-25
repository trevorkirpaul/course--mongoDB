const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of database', () => {
  // declare here for scoping
  let alex, joe, maria, zach;

  beforeEach((done) => {
    alex = new User({ name: 'Alex' });
    joe = new User({ name: 'Joe' });
    maria = new User({ name: 'Maria' });
    zach = new User({ name: 'Zach' });

    // alex.save()
    // .then(() => joe.save())
    // .then(() => maria.save())
    // .then(() => zach.save())
    // .then(() => done());
    

    Promise.all([alex.save(), joe.save(), maria.save(), zach.save()])
      .then(() => done());
    
  });

  // afterEach(() => {
  //   alex = null;
  //   joe = null;
  //   maria = null;
  //   zach = null;
  // })

  it('finds all users with a name of joe', (done) => {
    User.find({ name: 'Joe' })
      .then((users) => {
        
        // use toString to compare objectIDs
        assert(users[0]._id.toString() === joe._id.toString());
        done();
      })
  });

  it('find a user with a particular id', (done) => {
    User.findOne({ _id: joe._id })
      .then((user) => {
        assert(user.name === 'Joe');
        done();
      })
  });
  // using skip & limit to paginate results and sort()
  it('can skip and limit the result set', (done) => {
    User.find({})
    .sort({ name: 1 })
    .skip(1)
    .limit(2)
    .then((users) => {
      assert(users.length === 2);
      assert(users[0].name === 'Joe');
      assert(users[1].name === 'Maria');
      done();
    })
  });

});