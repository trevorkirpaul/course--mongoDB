const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('The express app', () => {
  // use supertest to test 'get' request
  it('handles a get request to /api', (done) => {
    request(app)
      .get('/api')
      .end((err, response) => {
        assert(response.body.hi === 'there');
        done();
      });
  });
});