import { Router } from 'express';
import * as R from 'ramda';
import { ErrorResponse, GetSpirit, getSpiritLocationId, GetUserRecord, invalidRequestBody, validateCatchSpiritInternalRequest } from 'sr2020-mm-event-engine';
import { createLogger, getQrModelData, InnerApiRequest, validateQrModelData } from 'sr2020-mm-server-event-engine';
import { mainCatchSpirit } from './catchSpirit';
import { mainFreeSpirit } from './freeSpirit';

const router = Router();

router.post('/catchSpirit', mainCatchSpirit);
router.post('/freeSpirit', mainFreeSpirit);

export const spiritRouter = router;
