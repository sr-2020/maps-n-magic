import { Router } from 'express';
import * as R from 'ramda';
import { ErrorResponse, GetSpirit, getSpiritLocationId, GetUserRecord, invalidRequestBody, validateCatchSpiritInternalRequest } from 'sr2020-mm-event-engine';
import { createLogger, getQrModelData, InnerApiRequest } from 'sr2020-mm-server-event-engine';
import { mainCatchSpirit } from './catchSpirit';
import { mainDispirit } from './dispirit';
import { mainFreeSpirit } from './freeSpirit';
import { mainSuitSpirit } from './suitSpirit';

const router = Router();

router.post('/catchSpirit', mainCatchSpirit);
router.post('/freeSpirit', mainFreeSpirit);
router.post('/suitSpirit', mainSuitSpirit);
router.post('/dispirit', mainDispirit);

export const spiritRouter = router;
