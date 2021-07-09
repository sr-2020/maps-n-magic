import fetch from 'isomorphic-fetch';
import { 
  getQrModelData, 
  createLogger,
  validateSpiritJarQrModelData,
} from 'sr2020-mm-server-event-engine';
import { 
  ErrorResponse, 
} from "sr2020-mm-event-engine";
import { Router } from 'express';

import { decode, playerServerCookie } from "../../utils";
import { catchSpirit2 } from './catchSpirit2';
import { freeSpirit } from './freeSpirit';
import { getSpiritDataByQr } from "./getSpiritDataByQr";
import { isBodyStorageValid } from './isBodyStorageValid';
import { isSpiritJarValid } from './isSpiritJarValid';
import { suitSpirit } from './suitSpirit';
import { dispirit } from './dispirit';

const logger = createLogger('player-server/spirits.ts');

const router = Router();

// this handler makes shallow check of qrId and spiritId and send request to server
router.post('/catchSpirit2', catchSpirit2);

router.post('/freeSpirit', freeSpirit);

router.post('/suitSpirit', suitSpirit);

router.post('/dispirit', dispirit);

router.get('/getSpiritDataByQr', getSpiritDataByQr);

router.get('/isBodyStorageValid', isBodyStorageValid);

router.get('/isSpiritJarValid', isSpiritJarValid);

export const spiritRouter = router;
