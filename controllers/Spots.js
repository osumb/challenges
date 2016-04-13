const Spots = require('../models').Spot;

function SpotsController() {
  this.showAll = (req, res) => {
    const spots = Spots.findAll();
    spots.then((data) => {
      res.send(data);
    });
    return spots;
  };
}

module.exports = SpotsController;
