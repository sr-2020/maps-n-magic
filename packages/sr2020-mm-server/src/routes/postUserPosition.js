const express = require('express');
const { innerPostUserPosition } = require('sr2020-mm-event-engine/api/position');

const router = express.Router();

router.post('/postUserPosition/:characterId', (req, res, next) => {
  const beacon = req.body;
  innerPostUserPosition(req.params.characterId, beacon).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    console.error(err);
    next(err);
  });
});

module.exports = router;
