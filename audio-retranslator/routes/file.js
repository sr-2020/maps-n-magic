const express = require('express');

const router = express.Router();

const fetch = require('isomorphic-fetch'); // or another library of choice.
const { Dropbox } = require('dropbox');
const { ACCESS_TOKEN } = require('../settings');

const dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch });
// dbx.filesListFolder({path: '/SR_sounds'})
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });


/* GET users listing. */
// router.get('/fileList', function(req, res) {
//   dbx.filesListFolder({path: '/SR_sounds'})
//     .then(function(response) {
//       // console.log(response);
//       res.setHeader('Content-Type', 'application/json');
//       res.json(response);
//     })
//     .catch(function(error) {
//       res.setHeader('Content-Type', 'application/json');
//       res.json(error);
//       // console.error(error);
//     });
//   // setTimeout(() => {
//   //   res.setHeader('Content-Type', 'application/json');
//   //   res.json({hello:'world!!!!'});
//   // }, 1000)
//   // res.send('respond with a resource');
// });

router.get('/file/:name', (req, res) => {
  // console.log(req.params);
  // res.send(req.params.name);
  dbx.filesDownload({ path: `/sr_sounds/${req.params.name}` })
    .then((response) => {
      let type;
      if (req.params.name.endsWith('.mp3')) {
        type = 'audio/mpeg';
      } else if (req.params.name.endsWith('.wav')) {
        type = 'audio/wav';
      }
      res.setHeader('Content-Type', type);
      res.send(response.fileBinary);
      console.log(response);
      // res.send('OK');
    })
    .catch((error) => {
      console.log(error);
      res.send('FAIL');
    });
});

module.exports = router;
