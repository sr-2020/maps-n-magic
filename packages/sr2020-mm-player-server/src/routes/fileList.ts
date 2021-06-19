import { Router } from 'express';
import fetch from 'isomorphic-fetch';
import { Dropbox } from 'dropbox';
import { ACCESS_TOKEN } from '../settings';

// const fetch = require('isomorphic-fetch'); // or another library of choice.
// const { Dropbox } = require('dropbox');
// const { ACCESS_TOKEN } = require('../settings');
// const express = require('express');

const router = Router();

// const express = require('express');

// const router = express.Router();

// const fetch = require('isomorphic-fetch'); // or another library of choice.
// const { Dropbox } = require('dropbox');
// const { ACCESS_TOKEN } = require('../settings');

const dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch });
// dbx.filesListFolder({path: '/SR_sounds'})
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });

/* GET users listing. */
router.get('/fileList', (req, res) => {
  dbx.filesListFolder({ path: '/SR_sounds' })
    .then((response) => {
      // console.log(response);
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    })
    .catch((error) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(error);
      // console.error(error);
    });
  // setTimeout(() => {
  //   res.setHeader('Content-Type', 'application/json');
  //   res.json({hello:'world!!!!'});
  // }, 1000)
  // res.send('respond with a resource');
});

// router.get('/file/:name', function(req, res) {
//   console.log(req.query.name);
//   res.send(req.query.name);
// });

// module.exports = router;

export const fileListRouter = router;
