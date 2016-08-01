const Models = require('../models');
const { logger } = require('../utils');
const Spot = new Models.Spot();

function SpotsController() {
  this.open = (req, res) => {
    Spot.open(req.body.spotId)
    .then(() => res.json({ success: true }))
    .catch((err) => {
      logger.errorLog(`Spots.open ${err}`);
      res.json({ success: false });
    });
  };
}

module.exports = SpotsController;
