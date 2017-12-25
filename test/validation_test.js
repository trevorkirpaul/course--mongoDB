const assert = require('assert');
const User = require('../src/user');

describe('Validating records', () => {
  // testing validation for name required
  it('Requires a user name', () => {
    
    const user = new User({ name: undefined });
    // validateSync is a synchronus process, returns result in same line
    //  validate is async and uses callbacks (or promises?) 
    const validationResult = user.validateSync();
    //this is where the the error message form the schema validation
    // is returned
    const { message } = validationResult.errors.name;

    assert(message === 'Name is required.');

  });
  // test that user name is longer than 2 chars
  it('Requires a user\'s name longer than 2 characters', () => {
    const user = new User({ name: 'Al' });
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === 'Name must be longer than 2 characters');
  });

  // prevent new user from being created if it isn't valid
  // catch error
  it('disallows invalid records from being saved', (done) => {
    const user = new User({ name: 'Al' });
    user.save()
      .catch((validationResult) => {
        const { message } = validationResult.errors.name;
        assert(message === 'Name must be longer than 2 characters');
        done();
      });
  });

  

});