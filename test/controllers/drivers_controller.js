const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
// express/mocha/mongoose don't work well together
// so we get the model this way
// if we used require, mocha would keep trying 
// to declare Driver thus creating an error
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
  it('POST to /api/drivers creates a new driver', (done) => {
    Driver.count().then(count => {

      request(app)
      .post('/api/drivers')
      .send({ email: 'test@test.com'})
      .end(() => {
        Driver.count().then(newCount => {
          assert(count + 1 === newCount);
          done();
        });
      });

    });    
  }); //end of it()

  it('PUT to /api/drivers edits an existing driver', (done) => {

    const driver = new Driver({ email: 't@t.com', driving: false });
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: 't@t.com' })
            .then(driver => {
              assert(driver.driving === true);
              done();
            });
        });
    })

  }); //end of it()

  it('DELETE to /api/drivers deletes an existing driver', (done) => {
    const driver = new Driver({ email: 't@t.com' });
    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: 't@t.com' })
            .then((driver) => {
              assert(driver === null);
              done();
            })
        })
    });
  }); //end of it()

  it('GET to /api/drivers frinds driers in a location', (done) => {
    // create new drivers
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    });
    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
    });
    // save then execute test
    Promise.all([seattleDriver.save(), miamiDriver.save()])
      .then(() => {
        request(app)
          .get('/api/drivers/?lng=-80&lat=25')
          .end((err, response) => {
            assert(response.body.length === 1);
            assert(response.body[0].obj.email === 'miami@test.com');
            done();
          })
      });

  });

})