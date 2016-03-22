const express = require('express');
const router = express.Router();

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);
}

module.exports = router;
