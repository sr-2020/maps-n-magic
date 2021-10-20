import { Router } from 'express';
import * as R from 'ramda';
import { mainCatchSpirit } from './catchSpirit';
import { mainDispirit } from './dispirit';
import { mainEmergencyDispirit } from './emergencyDispirit';
import { mainFreeSpirit } from './freeSpirit';
import { mainPostUserPosition } from './postUserPosition';
import { mainSuitSpirit } from './suitSpirit';

const router = Router();

router.post('/catchSpirit', mainCatchSpirit);
router.post('/freeSpirit', mainFreeSpirit);
router.post('/suitSpirit', mainSuitSpirit);
router.post('/dispirit', mainDispirit);
router.post('/emergencyDispirit', mainEmergencyDispirit);
router.post('/postUserPosition', mainPostUserPosition);

export const spiritRouter = router;
