import { Router } from 'express';
import { innerPostUserPosition } from 'sr2020-mm-server-event-engine/api/position';

const router = Router();

// const express = require('express');
// const { innerPostUserPosition } = require('sr2020-mm-server-event-engine/api/position');

// const router = express.Router();

router.post('/postUserPosition/:characterId', (req, res, next) => {
  const beacon = req.body;
  innerPostUserPosition(req.params.characterId, beacon).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    console.error(err);
    next(err);
  });
});

export const postUserPosition = router;

// module.exports = router;
