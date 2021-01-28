import { Router } from 'express';

const router = Router();
// const express = require('express');

// const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// module.exports = router;

export const indexRouter = router;
