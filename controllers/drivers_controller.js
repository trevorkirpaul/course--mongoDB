const Driver = require('../models/driver');

// es6 style, method doesnt need to be
// greeting: function(req, res)....

module.exports = {
  
  greeting(req, res) {
    res.send({ hi: 'there' });
  },

  index(req, res, next) {
    const { lng, lat } = req.query;
    // we need to parseFloat these bc
    // they are currently strings

    Driver.geoNear(
      { type: 'Point', coordinates: [ parseFloat(lng), parseFloat(lat) ] },
      { spherical: true, maxDistance: 200000 }
    )
      .then(drivers => res.send(drivers))
      .catch(next);

  },

  create(req, res, next) {
    const driverProps = req.body;
    
    Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next);
    
  },

  edit(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;

    Driver.findByIdAndUpdate({ _id: driverId }, driverProps)
      .then(() => Driver.findById({ _id: driverId }) )
      .then(driver => res.send(driver))
      .catch(next);
  } ,

  delete(req, res, next) {
    const driverId = req.params.id;
    
    Driver.findByIdAndRemove({ _id: driverId })
      .then((driver) => res.status(200).send(driver))
      .catch(next);
  }

}