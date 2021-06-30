import { Router } from 'express';
import fetch from 'isomorphic-fetch';
import { Dropbox } from 'dropbox';
import { ACCESS_TOKEN } from '../settings';

const router = Router();

const dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch });

router.get('/file/:name', (req, res) => {
  // console.log(req.params);
  // res.send(req.params.name);
  dbx.filesDownload({ path: `/sr_sounds/${req.params.name}` })
    .then((response) => {
      let type = '';
      if (req.params.name.endsWith('.mp3')) {
        type = 'audio/mpeg';
      } else if (req.params.name.endsWith('.wav')) {
        type = 'audio/wav';
      }
      res.setHeader('Content-Type', type);
      // @ts-ignore
      res.send(response.fileBinary);
      console.log(response);
      // res.send('OK');
    })
    .catch((error) => {
      console.log(error);
      res.send('FAIL');
    });
});

// module.exports = router;

export const fileRouter = router;
