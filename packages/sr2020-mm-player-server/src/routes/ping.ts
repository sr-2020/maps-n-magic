import { Router } from 'express';

const router = Router();

// const express = require('express');

// const router = express.Router();

router.get('/ping', (req, res, next) => {
  res.send({
    greeting: 'Maps-n-magic player server... online',
    date: new Date(),
  });
});

// module.exports = router;

export const pingRouter = router;
