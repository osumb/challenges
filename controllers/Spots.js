const Models = require('../models');
const Spot = new Models.Spot();

function SpotsController() {
  this.open = (req, res) => {
    console.log(req.body.spotId);
    Spot.open(req.body.spotId)
    .then(() => res.json({ success: true }))
    .catch((err) => {
      console.error(err);
      res.json({ success: false });
    });
  };
}

module.exports = SpotsController;
