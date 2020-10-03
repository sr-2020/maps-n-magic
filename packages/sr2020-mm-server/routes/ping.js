const express = require('express');

const router = express.Router();

router.get('/ping', (req, res, next) => {
  res.send({
    greeting: 'Maps-n-magic... online',
    date: new Date(),
  });
});

module.exports = router;
